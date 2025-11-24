import React, { useState, useMemo } from 'react';
import { CraftItem, Category } from '../types';
import ItemCard from './ItemCard';

interface CatalogViewProps {
  items: CraftItem[];
  onAddToCart: (item: CraftItem) => void;
  cartItemIds: Set<number>;
  wishlist: Set<number>;
  onToggleWishlist: (itemId: number) => void;
  onEditItem: (item: CraftItem) => void;
  onDeleteItem: (itemId: number) => void;
  isAdminMode: boolean;
}

const CATEGORIES: (Category | 'All')[] = ['All', 'Crochet', 'Decor', 'Random'];

const CatalogView: React.FC<CatalogViewProps> = ({ items, onAddToCart, cartItemIds, wishlist, onToggleWishlist, onEditItem, onDeleteItem, isAdminMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return items;
    }
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="animate-fade-in pb-16">
      <div className="mb-6 flex items-center justify-center flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-brand-accent text-brand-white-ish'
                : 'bg-brand-white-ish/60 text-brand-text hover:bg-brand-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id}
              item={item}
              onAddToCart={() => onAddToCart(item)}
              isInCart={cartItemIds.has(item.id)}
              isInWishlist={wishlist.has(item.id)}
              onToggleWishlist={() => onToggleWishlist(item.id)}
              onEdit={onEditItem}
              onDeleteItem={onDeleteItem}
              isAdminMode={isAdminMode}
            />
          ))}
        </div>
      ) : (
         <div className="text-center p-8 mt-10 bg-brand-white-ish rounded-2xl shadow-lg max-w-lg mx-auto">
            <div className="text-5xl mb-4">🤷‍♀️</div>
            <h2 className="text-3xl font-display text-brand-accent mb-2">Nothing here!</h2>
            <p className="text-brand-text">We couldn't find any items in the "{selectedCategory}" category. Try another one!</p>
         </div>
      )}
    </div>
  );
};

export default CatalogView;