import * as React from 'react';
import { CraftItem } from '../types';
import { XIcon } from './Icons';

interface EditItemModalProps {
  item: CraftItem | null;
  onClose: () => void;
  onSave: (updatedItem: CraftItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setDescription(item.description);
      setPreviewUrl(null); // Reset preview when a new item is opened
    }
  }, [item]);

  if (!item) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedItem: CraftItem = {
      ...item,
      name,
      price: Number(price) || 0,
      description,
      imageUrl: previewUrl || item.imageUrl,
    };
    onSave(updatedItem);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-brand-white-ish rounded-2xl shadow-xl p-6 w-full max-w-md m-4 flex flex-col relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute -top-3 -right-3 bg-brand-white-ish rounded-full p-1 shadow-lg text-brand-text hover:text-brand-accent transition-colors z-20"
            aria-label="Close"
        >
            <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-display text-brand-accent mb-4 text-center">Edit Item Details</h2>
        
        <div className="w-full h-48 bg-brand-background rounded-lg my-2 flex items-center justify-center overflow-hidden">
            <img 
                src={previewUrl || item.imageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
            />
        </div>
        
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />

        <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-brand-secondary text-brand-white-ish font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200"
        >
            {previewUrl ? 'Change Image' : 'Choose New Image'}
        </button>

        <div className="space-y-3 mt-4">
            <div>
                <label htmlFor="itemName" className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                    type="text" 
                    id="itemName" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
                />
            </div>
            <div>
                <label htmlFor="itemPrice" className="block text-sm font-bold text-gray-700 mb-1">Price (R)</label>
                <input 
                    type="number" 
                    id="itemPrice"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
                />
            </div>
            <div>
                <label htmlFor="itemDescription" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                    id="itemDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
                />
            </div>
        </div>

        <button
            onClick={handleSave}
            className="w-full bg-brand-accent text-brand-white-ish font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 mt-4"
        >
            Save Changes & Close
        </button>
      </div>
    </div>
  );
};

export default EditItemModal;