import * as React from 'react';
import { View } from '../types';
import { CatalogNavIcon, WishlistNavIcon, OrderIcon } from './Icons';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  itemCount: number;
  wishlistCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, itemCount, wishlistCount }) => {
  const navItems = [
    { view: 'catalog', label: 'Catalog', icon: <CatalogNavIcon /> },
    { view: 'wishlist', label: 'Wishlist', icon: <WishlistNavIcon /> },
    { view: 'cart', label: 'Cart', icon: <OrderIcon /> },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-brand-white-ish/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex justify-around max-w-md">
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view as View)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 ${isActive ? 'text-brand-accent' : 'text-gray-400 hover:text-brand-accent'}`}
            >
              <div className="relative">
                {item.icon}
                {item.view === 'cart' && itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-brand-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                 {item.view === 'wishlist' && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-brand-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold mt-1 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;