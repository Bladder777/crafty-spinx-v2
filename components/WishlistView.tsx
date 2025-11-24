import * as React from 'react';
import { CraftItem } from '../types';
import ItemCard from './ItemCard';

interface WishlistViewProps {
  wishlistItems: CraftItem[];
  onToggleWishlist: (itemId: number) => void;
  onAddToCart: (item: CraftItem) => void;
  cartItemIds: Set<number>;
  onEditItem: (item: CraftItem) => void;
  onDeleteItem: (itemId: number) => void;
  isAdminMode: boolean;
}

const WishlistView: React.FC<WishlistViewProps> = ({ wishlistItems, onToggleWishlist, onAddToCart, cartItemIds, onEditItem, onDeleteItem, isAdminMode }) => {
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center p-8 bg-brand-white-ish rounded-2xl shadow-lg max-w-lg mx-auto animate-fade-in">
        <div className="text-5xl mb-4">🤍</div>
        <h2 className="text-3xl font-display text-brand-accent mb-2">Your Wishlist is Empty</h2>
        <p className="text-brand-text">Looks like you haven't added any favorites yet. Browse the catalog to find items you love!</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-16">
      <h2 className="text-3xl font-display text-brand-accent mb-6 text-center border-b-2 border-brand-primary pb-4">Your Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistItems.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onAddToCart={() => onAddToCart(item)}
            isInCart={cartItemIds.has(item.id)}
            isInWishlist={true}
            onToggleWishlist={() => onToggleWishlist(item.id)}
            onEdit={onEditItem}
            onDeleteItem={onDeleteItem}
            isAdminMode={isAdminMode}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistView;