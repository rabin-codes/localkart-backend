import React from 'react';
import { X, ChevronRight } from 'lucide-react';

export const Sidebar = ({
  isOpen,
  onClose,
  items,
  activeItem,
  onItemClick,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:transform-none md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <h3 className="text-lg font-bold text-secondary">Menu</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} />
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
