import React from 'react';

export default function DefinitionBar({ data }) {
  if (!data) return null;

  return (
    <div className="definition-bar">
      <div className="def-left">
        <span className="def-label">{data.label}</span>
        <h2 className="def-title">{data.title}</h2>
      </div>
      <div className="def-right">
        <p style={{ color: '#E0E0E0', fontSize: '1rem', fontWeight: '400', borderLeft: '3px solid var(--primary-red)', paddingLeft: '20px' }}>
          {data.content}
        </p>
      </div>
    </div>
  );
}
