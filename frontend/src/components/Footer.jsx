import React from 'react';

export default function Footer({ data }) {
  if (!data) return null;

  return (
    <footer className="main-footer">
      <div className="footer-left">
        <span className="footer-label">{data.label}</span>
        <h2 className="footer-title">{data.title}</h2>
      </div>
      <div className="footer-right">
        <p style={{ color: '#888888', fontSize: '0.85rem' }}>
          {data.content}
        </p>
        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666666' }}>
          © 2026 Dự án Giáo dục Triết học Mác - Lênin. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
