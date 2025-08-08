// components/ui/Modal.jsx
'use client';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Modal content */}
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {children}
        </div>
      </div>
    </div>
  );
}