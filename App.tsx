import * as React from 'react';
import { CraftItem, View } from './types';
import { CRAFT_ITEMS } from './constants'; // Still used for initial reset
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
import { supabase } from './src/services/supabaseClient'; // Corrected import path

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

  // Fetch items from Supabase on initial mount
  React.useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('craft_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        // Fallback to local constants if Supabase fails
        setItems(CRAFT_ITEMS);
      } else {
        setItems(data as CraftItem[]);
      }
    };

    fetchItems();
  }, []);

  // Persist wishlist to localStorage whenever it changes
  React.useEffect(() => {
    try {
        window.localStorage.setItem('wishlistItems', JSON.stringify(Array.from(wishlist)));
    } catch (error) {
        console.error("Could not save wishlist to localStorage", error);
    }
  }, [wishlist]);

  // Admin login/logout (for now, still password-based, but will integrate with Supabase Auth later)
  const handleAdminLogin = async (password: string) => {
    // For now, we'll use a simple password check.
    // In a real scenario, you'd use Supabase auth.signInWithPassword
    // and check user metadata or roles for admin status.
    if (password === '12345678') {
      // Simulate admin login for now.
      // In a full Supabase auth flow, you'd sign in a specific admin user.
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com', // Replace with an actual admin email
        password: password,
      });

      if (error) {
        alert(`Admin login failed: ${error.message}`);
        console.error('Admin login error:', error);
      } else if (data.user) {
        setIsAdminMode(true);
        alert("Admin mode enabled.");
        setSettingsOpen(false);
      }
    } else {
      alert("Incorrect password.");
    }
  };

  const handleAdminLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
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
  
  const handleSaveItem = async (updatedItem: CraftItem) => {
    const { data, error } = await supabase
      .from('craft_items')
      .update({
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price,
        "imageUrl": updatedItem.imageUrl,
        category: updatedItem.category,
        "modelUrl": updatedItem.modelUrl,
      })
      .eq('id', updatedItem.id)
      .select();

    if (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item.');
    } else if (data && data.length > 0) {
      setItems(prevItems =>
          prevItems.map(i => (i.id === updatedItem.id ? data[0] as CraftItem : i))
      );
      setCartItems(prevCartItems =>
        prevCartItems.map(cartItem => 
          cartItem.id === updatedItem.id ? data[0] as CraftItem : cartItem
        )
      );
      setEditingItem(null);
      alert('Item updated successfully!');
    }
  };
  
  const handleDeleteItem = (itemId: number) => {
    requestConfirmation(
        'Are you sure you want to permanently delete this item? This action cannot be undone.',
        async () => {
            const { error } = await supabase
              .from('craft_items')
              .delete()
              .eq('id', itemId);

            if (error) {
              console.error('Error deleting item:', error);
              alert('Failed to delete item.');
            } else {
              setItems(prev => prev.filter(i => i.id !== itemId));
              setCartItems(prev => prev.filter(i => i.id !== itemId));
              setWishlist(prev => {
                  const newWishlist = new Set(prev);
                  newWishlist.delete(itemId);
                  return newWishlist;
              });
              alert('Item deleted successfully!');
            }
        }
    );
  };

  const handleAddItem = async (newItemData: Omit<CraftItem, 'id'>) => {
    const { data, error } = await supabase
      .from('craft_items')
      .insert([
        {
          name: newItemData.name,
          description: newItemData.description,
          price: newItemData.price,
          "imageUrl": newItemData.imageUrl,
          category: newItemData.category,
          "modelUrl": newItemData.modelUrl,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    } else if (data && data.length > 0) {
      setItems(prev => [data[0] as CraftItem, ...prev]);
      setAddItemModalOpen(false);
      alert('Item added successfully!');
    }
  };

  const handleImportItems = async (jsonString: string) => {
    try {
        const importedData: CraftItem[] = JSON.parse(jsonString);
        if (Array.isArray(importedData) && importedData.every(item => 'name' in item && 'description' in item)) {
            // Clear existing items and insert new ones
            const { error: deleteError } = await supabase.from('craft_items').delete().neq('id', 0); // Delete all
            if (deleteError) throw deleteError;

            const itemsToInsert = importedData.map(item => ({
                name: item.name,
                description: item.description,
                price: item.price,
                "imageUrl": item.imageUrl,
                category: item.category,
                "modelUrl": item.modelUrl,
            }));

            const { data, error: insertError } = await supabase
                .from('craft_items')
                .insert(itemsToInsert)
                .select();

            if (insertError) throw insertError;

            setItems(data as CraftItem[]);
            alert(`${data.length} items imported successfully! The catalog has been updated.`);
            setSettingsOpen(false);
        } else {
            throw new Error("Invalid JSON structure.");
        }
    } catch (error: any) {
        console.error("Failed to import and parse JSON:", error.message);
        alert(`Import failed: ${error.message}. Please ensure the file is a valid 'craft-items.json' file.`);
    }
  };
  
  const handleResetToDefaults = async () => {
    requestConfirmation(
        'Are you sure you want to reset all item data to the original defaults? All local changes will be lost.',
        async () => {
            const { error: deleteError } = await supabase.from('craft_items').delete().neq('id', 0); // Delete all
            if (deleteError) {
                console.error('Error deleting all items:', deleteError);
                alert('Failed to reset items.');
                return;
            }

            const itemsToInsert = CRAFT_ITEMS.map(item => ({
                name: item.name,
                description: item.description,
                price: item.price,
                "imageUrl": item.imageUrl,
                category: item.category,
                "modelUrl": item.modelUrl,
            }));

            const { data, error: insertError } = await supabase
                .from('craft_items')
                .insert(itemsToInsert)
                .select();

            if (insertError) {
                console.error('Error inserting default items:', insertError);
                alert('Failed to reset items to defaults.');
                return;
            }

            setItems(data as CraftItem[]);
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