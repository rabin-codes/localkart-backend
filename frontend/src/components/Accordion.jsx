import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ items }) => {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-2 border border-gray-200 rounded-lg overflow-hidden">
      {items.map((item) => (
        <div key={item.id} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-secondary">{item.title}</span>
            <ChevronDown
              size={20}
              className={`text-primary transition-transform duration-300 ${
                openId === item.id ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openId === item.id && (
            <div className="px-4 py-3 bg-white border-t border-gray-200 animate-fadeIn">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
