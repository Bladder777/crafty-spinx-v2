import * as React from 'react';
import { CraftItem } from '../types';

interface CartViewProps {
  cartItems: CraftItem[];
  onSendInquiry: () => void;
  onRemoveItem: (itemId: number) => void;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, onSendInquiry, onRemoveItem }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [pricePopKey, setPricePopKey] = React.useState(0);

  const totalPrice = React.useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  React.useEffect(() => {
    if (totalPrice > 0) {
      setPricePopKey(key => key + 1);
    }
  }, [totalPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsSubmitted(true);
      React.setTimeout(() => {
          onSendInquiry();
      }, 3000)
    }
  };
  
  if (isSubmitted) {
      return (
          <div className="text-center p-8 bg-brand-white-ish rounded-2xl shadow-lg max-w-lg mx-auto animate-fade-in">
              <div className="text-5xl mb-4">💌</div>
              <h2 className="text-3xl font-display text-brand-accent mb-2">Thank You!</h2>
              <p className="text-brand-text">Your inquiry has been sent. We'll be in touch with you at <span className="font-bold">{email}</span> shortly to finalize the details. Your new treasures are waiting!</p>
          </div>
      )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-8 bg-brand-white-ish rounded-2xl shadow-lg max-w-lg mx-auto animate-fade-in">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-3xl font-display text-brand-accent mb-2">Your Cart is Empty</h2>
        <p className="text-brand-text">You haven't picked any items yet. Go back to the catalog to find something you love!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-brand-white-ish rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-display text-brand-accent mb-6 border-b-2 border-brand-primary pb-4">Your Cart</h2>
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
          {cartItems.map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between bg-brand-background p-3 rounded-lg animate-item-in"
              style={{ animationDelay: `${index * 50}ms`}}
            >
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <h3 className="font-bold text-brand-text">{item.name}</h3>
                  <p className="text-sm text-gray-600">R {item.price.toFixed(2)}</p>
                </div>
              </div>
               <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
               </button>
            </div>
          ))}
        </div>
        
        <div className="text-right font-display text-2xl text-brand-text py-4 border-t-2 border-brand-primary">
          Total: <span key={pricePopKey} className="font-bold text-brand-accent inline-block animate-price-pop">R {totalPrice.toFixed(2)}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <h3 className="text-2xl font-display text-brand-text">Send Your Inquiry</h3>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Your Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-accent focus:border-brand-accent"
              placeholder="jane.doe@example.com"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-brand-accent text-brand-white-ish font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 text-lg"
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default CartView;