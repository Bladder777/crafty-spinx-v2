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
import LoginPage from '@/src/pages/LoginPage'; // Corrected import path
import { supabase } from './src/integrations/supabase/client';
import { useSession } from '@/src/components/SessionContextProvider'; // Corrected import path

const App: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession(); // Use the session context
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
  const [isAdminMode, setIsAdminMode] = React.useState(false); // Now derived from Supabase profile
  const [confirmation, setConfirmation] = React.useState<{ message: string; onConfirm: () => void; } | null>(null);

  // Fetch items from Supabase on initial mount or when session changes
  React.useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('craft_items')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching items:', error);
        setItems(CRAFT_ITEMS); // Fallback to local constants if Supabase fetch fails
      } else {
        setItems(data as CraftItem[]);
      }
    };

    fetchItems();
  }, [session]); // Refetch items if session changes (e.g., user logs in/out)

  // Fetch user profile and set admin mode
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsAdminMode(false);
        } else if (data) {
          setIsAdminMode(data.is_admin);
        }
      } else {
        setIsAdminMode(false); // Not logged in, not admin
      }
    };

    fetchProfile();
  }, [session]); // Re-run when session changes

  // Persist wishlist to localStorage whenever it changes
  React.useEffect(() => {
    try {
        window.localStorage.setItem('wishlistItems', JSON.stringify(Array.from(wishlist)));
    } catch (error) {
        console.error("Could not save wishlist to localStorage", error);
    }
  }, [wishlist]);

  // Admin login/logout now handled by Supabase Auth UI
  const handleAdminLogin = async () => {
    // This function is now a placeholder, actual login happens via Auth UI
    // We will rely on the session and profile fetch to set isAdminMode
    setSettingsOpen(false);
  };

  const handleAdminLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out.');
    } else {
      alert('Logged out successfully.');
      setSettingsOpen(false);
      setIsAdminMode(false); // Explicitly set to false on logout
    }
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
    const { error } = await supabase
      .from('craft_items')
      .update({
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price,
        imageUrl: updatedItem.imageUrl,
        category: updatedItem.category,
        modelUrl: updatedItem.modelUrl,
        status: updatedItem.status, // Include new fields
        is_available: updatedItem.is_available, // Include new fields
        knitter: updatedItem.knitter, // Include new fields
      })
      .eq('id', updatedItem.id);

    if (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item.');
    } else {
      setItems(prevItems =>
          prevItems.map(i => (i.id === updatedItem.id ? updatedItem : i))
      );
      setCartItems(prevCartItems =>
        prevCartItems.map(cartItem => 
          cartItem.id === updatedItem.id ? updatedItem : cartItem
        )
      );
      setEditingItem(null);
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
            }
        }
    );
  };

  const handleAddItem = async (newItemData: Omit<CraftItem, 'id'>) => {
    const { data, error } = await supabase
      .from('craft_items')
      .insert([newItemData])
      .select();

    if (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    } else if (data && data.length > 0) {
      const newItem = data[0] as CraftItem;
      setItems(prev => [newItem, ...prev]);
      setAddItemModalOpen(false);
    }
  };

  const handleImportItems = async (jsonString: string) => {
    try {
        const importedData = JSON.parse(jsonString);
        if (Array.isArray(importedData) && importedData.every(item => 'name' in item && 'description' in item)) {
            // Clear existing items and insert new ones
            const { error: deleteError } = await supabase.from('craft_items').delete().neq('id', 0); // Delete all
            if (deleteError) throw deleteError;

            const { data, error: insertError } = await supabase.from('craft_items').insert(importedData).select();
            if (insertError) throw insertError;

            setItems(data as CraftItem[]);
            alert(`${data.length} items imported successfully! The catalog has been updated.`);
            setSettingsOpen(false);
        } else {
            throw new Error("Invalid JSON structure. Each item must have at least 'name' and 'description'.");
        }
    } catch (error) {
        console.error("Failed to import and parse JSON:", error);
        alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file is a valid 'craft-items.json' file.`);
    }
  };
  
  const handleResetToDefaults = async () => {
    requestConfirmation(
        'Are you sure you want to reset all item data to the original defaults? All local changes will be lost.',
        async () => {
            const { error: deleteError } = await supabase.from('craft_items').delete().neq('id', 0); // Delete all
            if (deleteError) {
                console.error('Error clearing items:', deleteError);
                alert('Failed to clear existing items before reset.');
                return;
            }

            const { data, error: insertError } = await supabase.from('craft_items').insert(CRAFT_ITEMS).select();
            if (insertError) {
                console.error('Error inserting default items:', insertError);
                alert('Failed to insert default items.');
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

  // Show loading state while session is being fetched
  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background text-brand-text">
        Loading authentication...
      </div>
    );
  }

  // If no session, show login page
  if (!session) {
    return <LoginPage />;
  }

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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-brand-secondary text-brand-text px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-fade-in z-30">
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
        onAdminLogin={handleAdminLogin} // Placeholder, actual login via Auth UI
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