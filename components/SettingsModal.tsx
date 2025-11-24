import * as React from 'react';
import { CraftItem } from '../types';
// No need to import supabase client here for admin login anymore

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onSetTheme: (theme: string) => void;
  isAdminMode: boolean;
  onAdminLogin: (password: string) => void; // Simplified signature
  onAdminLogout: () => void;
  items: CraftItem[];
  onImportItems: (jsonString: string) => void;
  onResetToDefaults: () => void;
  requestConfirmation: (message: string, onConfirm: () => void) => void;
}

const themes = [
    { id: 'pastel', name: 'Pastel Dreams', colors: ['#FFC0CB', '#A0E7E5', '#F38181'] },
    { id: 'forest', name: 'Forest Whisper', colors: ['#A3D29C', '#77A06F', '#C78C53'] },
    { id: 'ocean', name: 'Ocean Breeze', colors: ['#87CEEB', '#4682B4', '#FFA500'] },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onSetTheme, isAdminMode, onAdminLogin, onAdminLogout, items, onImportItems, onResetToDefaults, requestConfirmation }) => {
  const [password, setPassword] = React.useState(''); // Only password state needed
  const [isAboutOpen, setAboutOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  if (!isOpen) return null;

  const handleUnlockClick = () => {
    onAdminLogin(password); // Pass only password
    setPassword('');
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(items, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "craft-items.json";
    link.click();
    onClose();
  };
  
  const processFile = (file: File) => {
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                onImportItems(result);
            }
        };
        reader.readAsText(file);
    } else {
        alert("Import failed. Please use a valid `.json` file.");
    }
  };

  const handleImportClick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';

      input.onchange = e => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
             requestConfirmation(
                'Are you sure? This will replace all current items with the data from the file. This action cannot be undone.',
                () => processFile(file)
            );
          }
          document.body.removeChild(input);
      };
      
      document.body.appendChild(input);
      input.click();
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      requestConfirmation(
        'Are you sure? This will replace all current items with the data from the file. This action cannot be undone.',
        () => {
            processFile(file);
            e.dataTransfer.clearData();
        }
      );
    }
  };


  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-brand-white-ish rounded-2xl shadow-xl p-6 w-full max-w-sm m-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-display text-brand-text">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="space-y-3">
            <h3 className="font-bold text-brand-text">Color Theme</h3>
            {themes.map(theme => (
                <button
                    key={theme.id}
                    onClick={() => onSetTheme(theme.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${currentTheme === theme.id ? 'border-brand-accent' : 'border-transparent hover:bg-brand-background'}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-text">{theme.name}</span>
                        <div className="flex space-x-1">
                            {theme.colors.map(color => (
                                <div key={color} className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                    </div>
                </button>
            ))}
        </div>

        <div className="mt-6 pt-4 border-t border-brand-primary/50">
            <button
                onClick={() => setAboutOpen(!isAboutOpen)}
                className="w-full flex justify-between items-center text-left p-2 rounded-lg hover:bg-brand-background transition-colors"
                aria-expanded={isAboutOpen}
            >
                <h3 className="font-bold text-brand-text">About Crafty Spinx v0.4</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isAboutOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isAboutOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-3 text-sm text-brand-text space-y-4 text-left">
                    <p className="italic">A fully client-side e-commerce catalog prototype designed for simplicity. It uses browser storage to persist data, eliminating the need for a backend database.</p>
                    
                    <div>
                        <h4 className="font-bold mb-1">Key Features:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Dynamic Catalog:</strong> Switch between a modern "swipe" view and a traditional "grid" view.</li>
                            <li><strong>Persistent Wishlist & Cart:</strong> All data is saved in your browser for your next visit.</li>
                            <li><strong>3D Model Viewer:</strong> Interact with 3D models of products where available.</li>
                            <li><strong>Live Admin Mode:</strong> A password-protected mode to add, edit, and delete items on-the-fly.</li>
                            <li><strong>Data Management:</strong> Admins can import, export, and reset product data without developer help.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-green-600 mb-1">Pros (Advantages):</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>No Backend Required:</strong> Extremely cheap and easy to host on any static web hosting service.</li>
                            <li><strong>Offline Functionality:</strong> Works perfectly offline after the first visit.</li>
                            <li><strong>Fast & Responsive:</strong> Instant user experience with no server delays.</li>
                            <li><strong>Simplified Content Management:</strong> The shop owner can manage products without developer help.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-red-600 mb-1">Cons (Limitations):</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>No Real-time Sync:</strong> Data is local to each device. A cart on your phone won't appear on your laptop.</li>
                            <li><strong>Limited Scalability:</strong> Not suitable for very large inventories due to browser storage limits.</li>
                            <li><strong>Insecure Admin:</strong> The password provides convenience, not real security.</li>
                            <li><strong>Manual Deployment:</strong> Product updates still require a developer to deploy the exported data file.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>


        <div className="mt-6 pt-4 border-t border-brand-primary/50">
            <h3 className="font-bold text-brand-text mb-2">Admin Access</h3>
            {isAdminMode ? (
                <div 
                  className={`p-4 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-brand-accent bg-brand-secondary/10' : 'border-gray-300'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                    <p className="text-center text-sm text-gray-500 mb-3 pointer-events-none">Drag & drop `craft-items.json` here or click to browse.</p>
                    <div className="space-y-3">
                        <button
                            onClick={handleImportClick}
                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Import & Replace Data
                        </button>
                        <p className="text-xs text-gray-500 text-center">Load a `craft-items.json` file to overwrite the current local catalog. This is for previewing and staging only.</p>
                        <button
                            onClick={handleExport}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Export for Production
                        </button>
                        <p className="text-xs text-gray-500 text-center">Click to download the updated product list. Send this file to the developer to deploy your changes.</p>
                        
                        <button
                            onClick={() => requestConfirmation(
                                'Are you sure you want to reset all item data to the original defaults? All local changes will be lost.',
                                onResetToDefaults
                            )}
                            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Reset to Factory Defaults
                        </button>
                        <p className="text-xs text-gray-500 text-center">Reverts the local catalog to its original state. This cannot be undone.</p>

                        <button
                            onClick={onAdminLogout}
                            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUnlockClick()}
                        placeholder="Enter admin password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
                    />
                    <button
                        onClick={handleUnlockClick}
                        className="w-full bg-brand-secondary text-brand-white-ish font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all"
                    >
                        Unlock Admin Mode
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                        The password is '12345678'. This is for local demonstration only and is not secure for production.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;