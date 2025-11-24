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
import { supabase } from './src/services/supabaseClient';
import { User } from '@supabase/supabase-js'; // Import Supabase User type

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [items, setItems] = React.useState<CraftItem[]>([]);
  const [cartItems, setCartItems] = React.useState<CraftItem[]>([]);
  const [wishlist, setWishlist] = React.useState<Set<number>>(new Set());
  
  const [currentView, setCurrentView] = React.useState<View>('catalog');
  const [catalogMode, setCatalogMode] = React.useState<'swipe' | 'grid'>('swipe');
  const [theme, setTheme] = React.useState('pastel');
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CraftItem | null>(null);
  const [isAddItemModalOpen, setAddItemModalOpen] = React.useState(false);
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<{ message: string; onConfirm: () => void; } | null>(null);

  // Supabase Auth Listener
  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Fetch user-specific data on login
        fetchWishlistItems(session.user.id);
        fetchCartItems(session.user.id);
      } else {
        // Clear user-specific data on logout
        setWishlist(new Set());
        setCartItems([]);
      }
    });

    // Initial check for user session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchWishlistItems(session.user.id);
        fetchCartItems(session.user.id);
      }
    };
    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch items from Supabase and set up Realtime subscription for craft_items
  React.useEffect(() => {
    const fetchAndSubscribeItems = async () => {
      const { data, error } = await supabase
        .from('craft_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        setItems(CRAFT_ITEMS); // Fallback to local constants if Supabase fails
      } else {
        setItems(data as CraftItem[]);
      }

      const channel = supabase
        .channel('public:craft_items')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'craft_items' },
          (payload) => {
            console.log('Realtime change received for craft_items!', payload);
            setItems((prevItems) => {
              if (payload.eventType === 'INSERT') {
                return [payload.new as CraftItem, ...prevItems];
              } else if (payload.eventType === 'UPDATE') {
                return prevItems.map((item) =>
                  item.id === (payload.new as CraftItem).id ? (payload.new as CraftItem) : item
                );
              } else if (payload.eventType === 'DELETE') {
                return prevItems.filter((item) => item.id !== (payload.old as CraftItem).id);
              }
              return prevItems;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchAndSubscribeItems();
  }, []);

  // Fetch Wishlist Items from Supabase
  const fetchWishlistItems = React.useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('item_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setWishlist(new Set(data.map(item => item.item_id)));
    }
  }, []);

  // Fetch Cart Items from Supabase
  const fetchCartItems = React.useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, craft_items(*)') // Join with craft_items to get full item details
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
    } else {
      // Map the joined data to CraftItem type
      const fetchedCartItems = data.map(cartItem => cartItem.craft_items as CraftItem);
      setCartItems(fetchedCartItems);
    }
  }, []);

  // Realtime subscription for wishlist_items
  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:wishlist_items:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist_items', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Realtime change received for wishlist!', payload);
          setWishlist((prevWishlist) => {
            const newWishlist = new Set(prevWishlist);
            if (payload.eventType === 'INSERT') {
              newWishlist.add((payload.new as { item_id: number }).item_id);
            } else if (payload.eventType === 'DELETE') {
              newWishlist.delete((payload.old as { item_id: number }).item_id);
            }
            return newWishlist;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Realtime subscription for cart_items
  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:cart_items:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Realtime change received for cart!', payload);
          // Re-fetch cart items to ensure we get the joined craft_items data
          fetchCartItems(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCartItems]);


  // Admin login/logout
  const handleAdminLogin = async (password: string) => {
    if (password === '08289737098') {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: password,
      });

      if (authError) {
        alert(`Admin login failed: ${authError.message}`);
        console.error('Admin login error:', authError);
      } else if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          alert('Failed to verify admin status. Please ensure the admin profile exists.');
          await supabase.auth.signOut();
        } else if (profileData?.is_admin) {
          setIsAdminMode(true);
          alert("Admin mode enabled.");
          setSettingsOpen(false);
        } else {
          alert("You are not authorized as an admin.");
          await supabase.auth.signOut();
        }
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

  const handleAddToCart = async (item: CraftItem) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, item_id: item.id, quantity: 1 })
      .select();

    if (error) {
      if (error.code === '23505') { // Unique violation, item already in cart
        alert('Item is already in your cart!');
      } else {
        console.error('Error adding item to cart:', error);
        alert(`Failed to add item to cart: ${error.message}`);
      }
    } else if (data) {
      // Realtime subscription will update cartItems state
      console.log('Item added to cart in Supabase:', data);
    }
  };
  
  const handleRemoveFromCart = async (itemId: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId);

    if (error) {
      console.error('Error removing item from cart:', error);
      alert(`Failed to remove item from cart: ${error.message}`);
    } else {
      // Realtime subscription will update cartItems state
      console.log('Item removed from cart in Supabase.');
    }
  };
  
  const handleToggleWishlist = async (itemId: number) => {
    if (!user) {
      alert('Please log in to manage your wishlist.');
      return;
    }

    if (wishlist.has(itemId)) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId);

      if (error) {
        console.error('Error removing item from wishlist:', error);
        alert(`Failed to remove item from wishlist: ${error.message}`);
      } else {
        // Realtime subscription will update wishlist state
        console.log('Item removed from wishlist in Supabase.');
      }
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, item_id: itemId })
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation, item already in wishlist
          alert('Item is already in your wishlist!');
        } else {
          console.error('Error adding item to wishlist:', error);
          alert(`Failed to add item to wishlist: ${error.message}`);
        }
      } else if (data) {
        // Realtime subscription will update wishlist state
        console.log('Item added to wishlist in Supabase:', data);
      }
    }
  };

  const handleSendInquiry = async () => {
    if (!user) return;

    // Clear the cart in Supabase
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart after inquiry:', error);
      alert(`Failed to clear cart: ${error.message}`);
    } else {
      // Realtime subscription will update cartItems state
      setCartItems([]); // Clear locally immediately for better UX
      setCurrentView('catalog');
    }
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
      alert(`Failed to update item: ${error.message}`);
    } else if (data && data.length > 0) {
      // Realtime subscription will handle updating 'items' state.
      // No need to manually update cartItems here, as the cart_items table
      // only stores item_id and user_id, and the fetchCartItems function
      // joins with craft_items to get the latest details.
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
              alert(`Failed to delete item: ${error.message}`);
            } else {
              // Realtime subscriptions will handle updating 'items', 'wishlist', and 'cartItems' states.
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
      alert(`Failed to add item: ${error.message}`);
    } else if (data && data.length > 0) {
      // Realtime subscription will handle updating 'items' state.
      setAddItemModalOpen(false);
      alert('Item added successfully!');
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

            // Realtime subscription will handle updating 'items' state.
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
            {theme === 'vibrant' ? (
              <img src="https://i.ibb.co/Q811111/crafty-spinx-logo.png" alt="Crafty Spinx Logo" className="h-12 md:h-16 mx-auto mb-2" />
            ) : (
              <h1 className="text-3xl md:text-4xl font-display text-brand-accent">Crafty Spinx</h1>
            )}
            <p className="text-sm text-gray-500">Huggables</p>
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