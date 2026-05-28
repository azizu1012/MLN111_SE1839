const fs = require('fs');
const path = require('path');

const PRIORITY_BOOST = 3.0;

class BM25 {
  constructor(documents) {
    this.documents = documents;
    this.docCount = documents.length;

    const lengths = documents.map(doc => this.tokenize(doc.text).length);
    this.avgDocLength = lengths.reduce((sum, len) => sum + len, 0) / (this.docCount || 1);

    this.k1 = 1.3;
    this.b = 0.75;

    this.idf = {};
    this.docTerms = [];

    this.initialize();
  }

  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”[\]\\]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  initialize() {
    const docFreqs = {};

    this.documents.forEach((doc, idx) => {
      const terms = this.tokenize(doc.text);
      const termFreqs = {};

      terms.forEach(term => {
        termFreqs[term] = (termFreqs[term] || 0) + 1;
      });

      this.docTerms.push({
        terms: termFreqs,
        length: terms.length,
        priority: doc.priority || 'low'
      });

      Object.keys(termFreqs).forEach(term => {
        docFreqs[term] = (docFreqs[term] || 0) + 1;
      });
    });

    Object.keys(docFreqs).forEach(term => {
      const df = docFreqs[term];
      this.idf[term] = Math.log(1 + (this.docCount - df + 0.5) / (df + 0.5));
    });
  }

  search(query, topK = 3) {
    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) return [];

    const scores = [];

    for (let i = 0; i < this.docCount; i++) {
      let score = 0;
      const doc = this.docTerms[i];
      const docLen = doc.length;

      queryTerms.forEach(term => {
        if (doc.terms[term]) {
          const tf = doc.terms[term];
          const idf = this.idf[term] || 0;
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
          score += idf * (numerator / denominator);
        }
      });

      if (score > 0) {
        let finalScore = score;
        if (doc.priority === 'high') {
          finalScore = score * PRIORITY_BOOST;
        }
        scores.push({ index: i, score: finalScore, rawScore: score, priority: doc.priority });
      }
    }

    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, topK).map(s => ({
      text: this.documents[s.index].text,
      source: this.documents[s.index].source,
      priority: s.priority,
      score: s.score
    }));
  }
}

let bm25Instance = null;
const chunksPath = path.join(__dirname, '..', 'data', 'philosophy_chunks.json');

function initRAG() {
  try {
    if (fs.existsSync(chunksPath)) {
      const data = fs.readFileSync(chunksPath, 'utf8');
      const chunks = JSON.parse(data);
      if (Array.isArray(chunks) && chunks.length > 0) {
        bm25Instance = new BM25(chunks);
        const highCount = chunks.filter(c => c.priority === 'high').length;
        console.log(`RAG: ${chunks.length} chunks (${highCount} high-priority từ giáo trình chính).`);
      }
    } else {
      console.warn('Chưa tìm thấy file philosophy_chunks.json.');
    }
  } catch (error) {
    console.error('Lỗi khởi tạo RAG:', error);
  }
}

function searchRAG(query, minScoreThreshold = 1.5) {
  if (!bm25Instance) {
    initRAG();
  }

  if (!bm25Instance) {
    return [];
  }

  const results = bm25Instance.search(query, 5);

  const filteredResults = results.filter(r => r.score >= minScoreThreshold);

  return filteredResults;
}

module.exports = {
  initRAG,
  searchRAG
};
