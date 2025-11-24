// FIX: Removed the problematic triple-slash directive.
// This was likely conflicting with the project's tsconfig.json settings and
// preventing the `declare global` augmentation for the `<model-viewer>`
// custom element from being recognized by TypeScript.
import React, { useEffect } from 'react';
import { CraftItem } from '../types';
import { XIcon } from './Icons';

interface ThreeDViewModalProps {
  item: CraftItem | null;
  onClose: () => void;
}

const ThreeDViewModal: React.FC<ThreeDViewModalProps> = ({ item, onClose }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!item || !item.modelUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-brand-white-ish rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-lg m-4 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute -top-3 -right-3 bg-brand-white-ish rounded-full p-1 shadow-lg text-brand-text hover:text-brand-accent transition-colors z-20"
            aria-label="Close viewer"
        >
            <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-display text-brand-accent mb-4 text-center">{item.name}</h2>

        <div className="relative w-full aspect-square bg-brand-background rounded-lg overflow-hidden">
          {/* FIX: With the global JSX types fixed, the type augmentation for `model-viewer` works, so the custom element can be used directly. */}
          <model-viewer
            src={item.modelUrl}
            alt={`3D model of ${item.name}`}
            ar
            arModes="webxr scene-viewer quick-look"
            cameraControls
            autoRotate
            shadowIntensity={1}
            style={{ width: '100%', height: '100%' }}
          >
             <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
               AR available
             </div>
          </model-viewer>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">Click and drag to rotate. Use pinch or scroll to zoom.</p>
      </div>
    </div>
  );
};

export default ThreeDViewModal;
