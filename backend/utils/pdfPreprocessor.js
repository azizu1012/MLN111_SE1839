const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PRIMARY_PDF_KEYWORD = 'Học thuyết hình thái kinh tế';

async function preprocessPDF() {
  const rootDir = path.join(__dirname, '..', '..');
  const outputDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outputDir, 'philosophy_chunks.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let pdfFiles = [];
  try {
    const files = fs.readdirSync(rootDir);
    pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
  } catch (err) {
    console.error('Không thể quét thư mục gốc để tìm file PDF:', err);
    return;
  }

  if (pdfFiles.length === 0) {
    console.warn('Không tìm thấy file PDF nào ở thư mục gốc.');
    return;
  }

  let needRebuild = !fs.existsSync(outputPath);
  if (!needRebuild) {
    try {
      const jsonStats = fs.statSync(outputPath);
      for (const pdfFile of pdfFiles) {
        const pdfStats = fs.statSync(path.join(rootDir, pdfFile));
        if (pdfStats.mtime > jsonStats.mtime) {
          console.log(`Phát hiện tài liệu "${pdfFile}" mới. Làm mới dữ liệu RAG...`);
          needRebuild = true;
          break;
        }
      }
    } catch (e) {
      needRebuild = true;
    }
  }

  if (!needRebuild) {
    console.log('Dữ liệu philosophy_chunks.json đã đồng bộ. Bỏ qua.');
    return;
  }

  console.log(`Đang xử lý ${pdfFiles.length} tài liệu PDF: [${pdfFiles.join(', ')}]...`);

  let allChunks = [];
  const { PDFParse } = require('pdf-parse');

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(rootDir, pdfFile);
    const isPrimary = pdfFile.includes(PRIMARY_PDF_KEYWORD);
    const priority = isPrimary ? 'high' : 'low';
    const chunkSize = isPrimary ? 400 : 1200;
    const chunkOverlap = isPrimary ? 80 : 200;

    console.log(`   └─ Xử lý: ${pdfFile} (${priority} priority, chunk=${chunkSize})...`);

    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const parser = new PDFParse({ data: dataBuffer });
      await parser.load();
      const result = await parser.getText();
      const fullText = result ? result.text : '';

      if (parser.destroy) {
        await parser.destroy();
      }

      if (fullText && fullText.trim().length > 0) {
        const chunks = chunkText(fullText, chunkSize, chunkOverlap);
        const taggedChunks = chunks.map(text => ({
          text,
          source: pdfFile,
          priority,
          chunkSize: text.length
        }));
        allChunks = allChunks.concat(taggedChunks);
        console.log(`   └─ ✓ ${pdfFile}: ${chunks.length} chunks (${priority})`);
      } else {
        console.warn(`   └─ ⚠️ ${pdfFile} không trích xuất được văn bản.`);
      }
    } catch (error) {
      console.error(`   └─ ❌ Lỗi xử lý ${pdfFile}: ${error.message}`);
    }
  }

  if (allChunks.length > 0) {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(allChunks, null, 2), 'utf8');
      console.log(`✓ Đã lưu ${allChunks.length} chunks vào ${outputPath}`);
    } catch (err) {
      console.error('Lỗi lưu file:', err);
    }
  } else {
    console.warn('Không trích xuất được chunks nào.');
  }
}

function chunkText(text, chunkSize = 800, overlap = 150) {
  let cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +/g, ' ')
    .trim();

  const chunks = [];
  let startIndex = 0;

  while (startIndex < cleanedText.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex >= cleanedText.length) {
      chunks.push(cleanedText.substring(startIndex).trim());
      break;
    }

    let bestBreak = endIndex;
    const searchRange = cleanedText.substring(endIndex - overlap, endIndex + 50);
    const searchOffset = endIndex - overlap;

    const breakPoints = [
      searchRange.lastIndexOf('.\n'),
      searchRange.lastIndexOf('.\n\n'),
      searchRange.lastIndexOf('. '),
      searchRange.lastIndexOf('?\n'),
      searchRange.lastIndexOf('? '),
      searchRange.lastIndexOf('\n\n'),
      searchRange.lastIndexOf('\n')
    ];

    const validBreakPoints = breakPoints.filter(idx => idx !== -1);
    if (validBreakPoints.length > 0) {
      bestBreak = searchOffset + Math.max(...validBreakPoints) + 1;
    }

    const chunk = cleanedText.substring(startIndex, bestBreak).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    startIndex = Math.max(bestBreak - overlap, startIndex + 1);
  }

  return chunks;
}

module.exports = preprocessPDF;
