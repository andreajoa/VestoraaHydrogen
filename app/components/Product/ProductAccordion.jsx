import { useState } from "react";

export function ProductAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="mt-6 border-t border-gray-200">
      {items.map((item, index) => (
        <div key={item.title} className="border-b border-gray-200">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center py-4 text-left"
          >
            <span className="text-sm font-semibold text-gray-900">{item.title}</span>
            <span className="text-gray-500 text-xs">{openIndex === index ? "▲" : "▼"}</span>
          </button>
          {openIndex === index && (
            <div className="pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
              {item.link && (
                <button onClick={item.link.onClick} className="mt-2 text-xs font-semibold text-gray-700 underline hover:text-gray-900">
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
