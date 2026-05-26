const fs = require('fs');
const path = require('path');

class BM25 {
  constructor(documents) {
    this.documents = documents; // array of strings
    this.docCount = documents.length;
    
    // Average document length in words/tokens
    const lengths = documents.map(doc => this.tokenize(doc).length);
    this.avgDocLength = lengths.reduce((sum, len) => sum + len, 0) / (this.docCount || 1);
    
    this.k1 = 1.3; // standard value between 1.2 and 2.0
    this.b = 0.75; // standard value
    
    this.idf = {};
    this.docTerms = [];
    
    this.initialize();
  }

  tokenize(text) {
    if (!text) return [];
    // Convert to lowercase, remove punctuation, remove extra spaces
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”[\]\\]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  initialize() {
    const docFreqs = {};

    this.documents.forEach((doc, idx) => {
      const terms = this.tokenize(doc);
      const termFreqs = {};
      
      terms.forEach(term => {
        termFreqs[term] = (termFreqs[term] || 0) + 1;
      });
      
      this.docTerms.push({
        terms: termFreqs,
        length: terms.length
      });

      // Calculate doc frequency for each unique term in this document
      Object.keys(termFreqs).forEach(term => {
        docFreqs[term] = (docFreqs[term] || 0) + 1;
      });
    });

    // Calculate IDF for each unique term
    Object.keys(docFreqs).forEach(term => {
      const df = docFreqs[term];
      // BM25 standard IDF with smoothing to avoid negative values
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
        scores.push({ index: i, score });
      }
    }

    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);
    
    return scores.slice(0, topK).map(s => ({
      text: this.documents[s.index],
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
        console.log(`✓ RAG Helper: Lập chỉ mục thành công ${chunks.length} chunks từ giáo trình.`);
      }
    } else {
      console.warn('⚠️ RAG Helper: Chưa tìm thấy file philosophy_chunks.json. Vui lòng chạy preprocessor.');
    }
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo RAG:', error);
  }
}

function searchRAG(query, minScoreThreshold = 2.0) {
  // Lazily initialize if not done yet
  if (!bm25Instance) {
    initRAG();
  }

  if (!bm25Instance) {
    return [];
  }

  const results = bm25Instance.search(query, 3);
  
  // Filter matches below the threshold to avoid feeding irrelevant documents for non-philosophy queries
  const filteredResults = results.filter(r => r.score >= minScoreThreshold);
  
  console.log(`🔍 RAG Search: Query: "${query}" - Tìm thấy ${results.length} kết quả. Lọc lại còn ${filteredResults.length} kết quả (Ngưỡng điểm >= ${minScoreThreshold}).`);
  
  return filteredResults;
}

module.exports = {
  initRAG,
  searchRAG
};
