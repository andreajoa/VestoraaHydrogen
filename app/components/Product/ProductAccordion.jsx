import { useState } from "react";

export function ProductAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div style={{ marginTop: '24px', borderTop: '1px solid #e5e5e5' }}>
      {items.map((item, index) => (
        <div key={item.title} style={{ borderBottom: '1px solid #e5e5e5' }}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{item.title}</span>
            <span style={{ fontSize: '11px', color: '#888' }}>{openIndex === index ? '▲' : '▼'}</span>
          </button>
          {openIndex === index && (
            <div style={{ paddingBottom: '14px' }}>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, margin: 0 }}>{item.content}</p>
              {item.link && (
                <button onClick={item.link.onClick} style={{ marginTop: '8px', fontSize: '12px', fontWeight: '600', color: '#111', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {item.link.text}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
