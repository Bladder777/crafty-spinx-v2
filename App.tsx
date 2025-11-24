import * as React from 'react';
import { CraftItem, View } from './types';
import { CRAFT_ITEMS } from './constants';
import CatalogView from './components/CatalogView';
import CartView from './components/OrderView';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import SwipeView from './components/SwipeView';
import FloatingActionMenu from './components/FloatingActionMenu';
import WishlistView from './components/WishlistView';
import EditItemModal from './components/EditItemModal';
import AddItemModal from './components/AddItemModal';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [items, setItems] = React.useState<CraftItem[]>([]);
  const [cartItems, setCartItems] = React.useState<CraftItem[]>([]);
  const [wishlist, setWishlist] = React.useState<Set<number>>(() => {
    try {
      const savedWishlist = window.localStorage.getItem('wishlistItems');
      return savedWishlist ? new Set(JSON.parse(savedWishlist)) : new Set();
    } catch (error) {
      console.error("Could not load wishlist from localStorage", error);
      return new Set();
    }
  });
  
  const [currentView, setCurrentView] = React.useState<View>('catalog');
  const [catalogMode, setCatalogMode] = React.useState<'swipe' | 'grid'>('swipe');
  const [theme, setTheme] = React.useState('pastel');
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CraftItem | null>(null);
  const [isAddItemModalOpen, setAddItemModalOpen] = React.useState(false);
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<{ message: string; onConfirm: () => void; } | null>(null);


  // Load all item data from localStorage on initial mount
  React.useEffect(() => {
    try {
      const cachedItemsJSON = window.localStorage.getItem('crafty-spinx-items');
      if (cachedItemsJSON) {
        setItems(JSON.parse(cachedItemsJSON));
      } else {
        setItems(CRAFT_ITEMS);
      }
    } catch (error) {
      console.error("Could not load items from localStorage, using defaults.", error);
      setItems(CRAFT_ITEMS);
    }
  }, []);

  // Persist the entire item list to localStorage whenever it changes
  React.useEffect(() => {
    if (items.length > 0) { // Avoid saving an empty array on initial load
        try {
            window.localStorage.setItem('crafty-spinx-items', JSON.stringify(items));
        } catch (error) {
            console.error("Could not save items to localStorage", error);
        }
    }
  }, [items]);

  React.useEffect(() => {
    try {
        window.localStorage.setItem('wishlistItems', JSON.stringify(Array.from(wishlist)));
    } catch (error) {
        console.error("Could not save wishlist to localStorage", error);
    }
  }, [wishlist]);

  const handleAdminLogin = (password: string) => {
    if (password === '12345678') {
      setIsAdminMode(true);
      alert("Admin mode enabled.");
      setSettingsOpen(false);
    } else {
      alert("Incorrect password.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    alert("Admin mode disabled.");
    setSettingsOpen(false);
  };

  const handleAddToCart = (item: CraftItem) => {
    if (!cartItems.some(i => i.id === item.id)) {
      setCartItems(prevItems => [...prevItems, item]);
    }
  };
  
  const handleRemoveFromCart = (itemId: number) => {
      setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
  };
  
  const handleToggleWishlist = (itemId: number) => {
    setWishlist(prevWishlist => {
        const newWishlist = new Set(prevWishlist);
        if (newWishlist.has(itemId)) {
            newWishlist.delete(itemId);
        } else {
            newWishlist.add(itemId);
        }
        return newWishlist;
    });
  };

  const handleSendInquiry = () => {
    setCartItems([]);
    setCurrentView('catalog');
  };
  
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.className = `theme-${newTheme}`;
  }
  
  const handleSaveItem = (updatedItem: CraftItem) => {
    // Update the master list of items
    setItems(prevItems =>
        prevItems.map(i => (i.id === updatedItem.id ? updatedItem : i))
    );
    // FIX: Also update the item if it's in the cart to prevent stale data
    setCartItems(prevCartItems =>
      prevCartItems.map(cartItem => 
        cartItem.id === updatedItem.id ? updatedItem : cartItem
      )
    );
    setEditingItem(null);
  };
  
  const handleDeleteItem = (itemId: number) => {
    requestConfirmation(
        'Are you sure you want to permanently delete this item? This action cannot be undone.',
        () => {
            setItems(prev => prev.filter(i => i.id !== itemId));
            setCartItems(prev => prev.filter(i => i.id !== itemId));
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                newWishlist.delete(itemId);
                return newWishlist;
            });
        }
    );
  };

  const handleAddItem = (newItemData: Omit<CraftItem, 'id'>) => {
    const newId = Math.max(0, ...items.map(i => i.id)) + 1;
    const newItem: CraftItem = { ...newItemData, id: newId };
    setItems(prev => [newItem, ...prev]);
    setAddItemModalOpen(false);
  };

  const handleImportItems = (jsonString: string) => {
    try {
        const importedData = JSON.parse(jsonString);
        // Basic validation
        if (Array.isArray(importedData) && importedData.every(item => 'id' in item && 'name' in item)) {
            setItems(importedData);
            alert(`${importedData.length} items imported successfully! The catalog has been updated.`);
            setSettingsOpen(false);
        } else {
            throw new Error("Invalid JSON structure.");
        }
    } catch (error) {
        console.error("Failed to import and parse JSON:", error);
        alert("Import failed. Please ensure the file is a valid 'craft-items.json' file.");
    }
  };
  
  const handleResetToDefaults = () => {
    requestConfirmation(
        'Are you sure you want to reset all item data to the original defaults? All local changes will be lost.',
        () => {
            setItems(CRAFT_ITEMS);
            alert("Catalog has been reset to factory defaults.");
            setSettingsOpen(false);
        }
    );
  };

  const requestConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmation({
        message,
        onConfirm: () => {
            onConfirm();
            setConfirmation(null);
        }
    });
  };

  const wishlistItems = items.filter(item => wishlist.has(item.id));
  const cartItemIds = new Set(cartItems.map(i => i.id));

  return (
    <div className={`theme-${theme} min-h-screen bg-brand-background font-body text-brand-text flex flex-col`}>
      <header className="p-4 flex justify-center items-center shadow-md bg-brand-white-ish/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="text-center select-none">
            <h1 className="text-3xl md:text-4xl font-display text-brand-accent">Crafty Spinx</h1>
            <p className="text-sm text-gray-500">Handmade with love</p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6 relative">
        {currentView === 'catalog' && (
          catalogMode === 'swipe' ? (
            <SwipeView 
              items={items} 
              onAddToCart={handleAddToCart}
              cartItemIds={cartItemIds}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onEditItem={setEditingItem}
              onDeleteItem={handleDeleteItem}
              isAdminMode={isAdminMode}
            />
          ) : (
            <CatalogView 
              items={items} 
              onAddToCart={handleAddToCart} 
              cartItemIds={cartItemIds}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onEditItem={setEditingItem}
              onDeleteItem={handleDeleteItem}
              isAdminMode={isAdminMode}
            />
          )
        )}
        {currentView === 'cart' && (
            <CartView 
                cartItems={cartItems} 
                onSendInquiry={handleSendInquiry}
                onRemoveItem={handleRemoveFromCart}
            />
        )}
        {currentView === 'wishlist' && (
            <WishlistView
                wishlistItems={wishlistItems}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                cartItemIds={cartItemIds}
                onEditItem={setEditingItem}
                onDeleteItem={handleDeleteItem}
                isAdminMode={isAdminMode}
            />
        )}
      </main>
      
      {currentView === 'catalog' && (
        <FloatingActionMenu 
            isGridMode={catalogMode === 'grid'}
            onToggleView={() => setCatalogMode(mode => mode === 'grid' ? 'swipe' : 'grid')}
            onOpenSettings={() => setSettingsOpen(true)}
            onAddItem={() => setAddItemModalOpen(true)}
            isAdminMode={isAdminMode}
        />
      )}

      {isAdminMode && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-fade-in z-30">
            Admin Mode Enabled
        </div>
      )}

      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        itemCount={cartItems.length}
        wishlistCount={wishlist.size}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentTheme={theme}
        onSetTheme={handleSetTheme}
        isAdminMode={isAdminMode}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        items={items}
        onImportItems={handleImportItems}
        onResetToDefaults={handleResetToDefaults}
        requestConfirmation={requestConfirmation}
      />
      
      <EditItemModal 
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
      />
      
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        onSave={handleAddItem}
      />

      <ConfirmationModal
        isOpen={!!confirmation}
        title="Please Confirm"
        message={confirmation?.message || ''}
        onConfirm={confirmation?.onConfirm}
        onCancel={() => setConfirmation(null)}
      />
    </div>
  );
};

export default App;