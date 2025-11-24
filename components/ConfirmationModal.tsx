import * as React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className="bg-brand-white-ish rounded-2xl shadow-xl p-6 w-full max-w-sm m-4 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-display text-brand-accent mb-4 text-center">{title}</h2>
        <p className="text-brand-text text-center mb-6">{message}</p>
        <div className="flex justify-center gap-4">
            <button
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="flex-1 bg-brand-accent text-brand-white-ish font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
            >
                Confirm
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;