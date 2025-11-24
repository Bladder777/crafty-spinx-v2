import * as React from 'react';
import { CraftItem } from '../types';
import { WishlistHeartIcon, PencilIcon, TrashIcon } from './Icons';

interface ItemCardProps {
  item: CraftItem;
  onAddToCart: () => void;
  isInCart: boolean;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  onEdit: (item: CraftItem) => void;
  onDeleteItem: (itemId: number) => void;
  isAdminMode: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, isInCart, isInWishlist, onToggleWishlist, onEdit, onDeleteItem, isAdminMode }) => {
  
  return (
    <div className="bg-brand-white-ish rounded-xl shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105">
      <div 
        className="relative overflow-hidden"
      >
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation(); 
                    onToggleWishlist();
                }}
                className="p-1.5 bg-brand-white-ish/70 rounded-full text-brand-accent hover:scale-110 transition-transform"
                aria-label="Toggle Wishlist"
            >
                <WishlistHeartIcon filled={isInWishlist} className="w-5 h-5" />
            </button>
            {isAdminMode && (
              <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                    }}
                    className="p-1.5 bg-brand-white-ish/70 rounded-full text-brand-text hover:text-brand-accent hover:scale-110 transition-transform"
                    aria-label="Edit Item"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                    }}
                    className="p-1.5 bg-brand-white-ish/70 rounded-full text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
                    aria-label="Delete Item"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
              </>
            )}
        </div>
        <div >
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-40 md:h-48 object-cover transition-all duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-brand-accent text-brand-white-ish font-bold text-sm px-2 py-1 rounded-full">
            R {item.price.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-display text-brand-text">{item.name}</h3>
        <p className="text-xs text-gray-600 mt-1 flex-grow">{item.description}</p>
        <button
          onClick={onAddToCart}
          disabled={isInCart}
          className="mt-3 w-full bg-brand-secondary text-brand-white-ish font-bold py-2 px-3 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;