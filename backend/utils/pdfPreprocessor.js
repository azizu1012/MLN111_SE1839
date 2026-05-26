const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function preprocessPDF() {
  const rootDir = path.join(__dirname, '..', '..');
  const outputDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(outputDir, 'philosophy_chunks.json');

  // Check if output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Scan root directory for PDF files
  let pdfFiles = [];
  try {
    const files = fs.readdirSync(rootDir);
    pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
  } catch (err) {
    console.error('❌ Không thể quét thư mục gốc để tìm file PDF:', err);
    return;
  }

  if (pdfFiles.length === 0) {
    console.warn('⚠️ RAG Preprocessor: Không tìm thấy file PDF nào ở thư mục gốc để nạp dữ liệu Triết học.');
    return;
  }

  // Check if we need to rebuild: rebuild if JSON does not exist or any PDF has a newer modified time
  let needRebuild = !fs.existsSync(outputPath);
  if (!needRebuild) {
    try {
      const jsonStats = fs.statSync(outputPath);
      for (const pdfFile of pdfFiles) {
        const pdfStats = fs.statSync(path.join(rootDir, pdfFile));
        if (pdfStats.mtime > jsonStats.mtime) {
          console.log(`⚡ Phát hiện tài liệu "${pdfFile}" mới được cập nhật hoặc thêm mới. Bắt đầu làm mới dữ liệu RAG...`);
          needRebuild = true;
          break;
        }
      }
    } catch (e) {
      needRebuild = true;
    }
  }

  if (!needRebuild) {
    console.log('✓ Dữ liệu philosophy_chunks.json đã đồng bộ và mới nhất. Bỏ qua bước tiền xử lý PDF.');
    return;
  }

  console.log(`⏳ Đang tiến hành đọc và lập chỉ mục ${pdfFiles.length} tài liệu PDF: [${pdfFiles.join(', ')}]...`);
  
  let allChunks = [];
  const { PDFParse } = require('pdf-parse');

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(rootDir, pdfFile);
    console.log(`   └─ Đang xử lý file: ${pdfFile}...`);
    
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
        const chunks = chunkText(fullText, 800, 150);
        allChunks = allChunks.concat(chunks);
        console.log(`   └─ ✓ Đã xử lý xong ${pdfFile}: Trích xuất ${chunks.length} đoạn văn bản.`);
      } else {
        console.warn(`   └─ ⚠️ File ${pdfFile} không trích xuất được văn bản.`);
      }
    } catch (error) {
      console.error(`   └─ ❌ Lỗi khi xử lý file ${pdfFile}:`, error.message);
    }
  }

  if (allChunks.length > 0) {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(allChunks, null, 2), 'utf8');
      console.log(`✓ Đã tổng hợp và lưu thành công ${allChunks.length} chunks vào: ${outputPath}`);
    } catch (err) {
      console.error('❌ Lỗi khi lưu file philosophy_chunks.json:', err);
    }
  } else {
    console.warn('⚠️ RAG Preprocessor: Không trích xuất được bất kỳ đoạn văn bản nào từ các file PDF.');
  }
}

function chunkText(text, chunkSize = 800, overlap = 150) {
  // Clean text: remove excessive empty lines and spaces
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

    // Try to find a good breaking point (like a period, question mark, exclamation, or newline)
    // search within the overlap range to find a punctuation mark
    let bestBreak = endIndex;
    const searchRange = cleanedText.substring(endIndex - overlap, endIndex + 50);
    const searchOffset = endIndex - overlap;

    // Look for the last sentence ending in the overlap region
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
      // Get the best breaking point (prefer period or double newline closer to the end of searchRange)
      bestBreak = searchOffset + Math.max(...validBreakPoints) + 1; // include the punctuation/newline itself
    }

    const chunk = cleanedText.substring(startIndex, bestBreak).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Next chunk starts at bestBreak minus overlap, but ensure we make progress
    startIndex = Math.max(bestBreak - overlap, startIndex + 1);
  }

  return chunks;
}

module.exports = preprocessPDF;
