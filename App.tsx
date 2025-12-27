
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ShoppingCart, User, ClipboardList, MapPin, Star, Clock, 
  AlertTriangle, ArrowLeft, Trash2, CheckCircle, Users, 
  Plus, Minus, DownloadCloud, Search, Mic, Scan, ChevronDown, 
  Filter, Heart, Zap, PlayCircle 
} from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { RESTAURANTS, MENU_ITEMS } from './constants';
import { Restaurant, MenuItem, CartItem, Order, OrderStatus } from './types';
import { getFoodRecommendation, getRushAnalysis } from './services/geminiService';

// --- Components ---

const Navbar: React.FC<{ cartCount: number, onExport: () => void }> = ({ cartCount, onExport }) => (
  <nav className="bg-white border-b sticky top-0 z-50 shadow-sm py-2">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter hidden sm:block">RUSH<span className="text-blue-600">FREE</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-2 group cursor-pointer border-l pl-6">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold border-b border-black pb-0.5 group-hover:text-blue-600 group-hover:border-blue-600 transition-all">Downtown, San Francisco</span>
          <ChevronDown className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        <button 
          onClick={onExport}
          className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Export</span>
        </button>
        <Link to="/orders" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-sm">
          <ClipboardList className="w-4 h-4" />
          <span className="hidden sm:inline">Orders</span>
        </Link>
        <Link to="/cart" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-sm group">
          <div className="relative">
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <div className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold text-sm cursor-pointer">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </div>
      </div>
    </div>
  </nav>
);

// --- Pages ---

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => setIsListening(false), 2000); // Mock listening
  };

  const categories = [
    { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200' },
    { name: 'Burger', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200' },
    { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200' },
    { name: 'Pasta', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=200' },
    { name: 'Salads', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=200' },
    { name: 'Steak', img: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?w=200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-2xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines or a dish" 
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
          />
          <button 
            onClick={startVoiceSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'bg-blue-600 text-white animate-pulse' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl">
            <Scan className="w-4 h-4" /> Scan Table
          </button>
        </div>
      </div>

      {/* Category Section */}
      <section className="mb-12">
        <h2 className="text-xl font-black text-slate-800 mb-6">What's on your mind?</h2>
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex-shrink-0 text-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-2 shadow-md group-hover:shadow-xl transition-all group-hover:scale-105 border-2 border-transparent group-hover:border-blue-600">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-blue-800 uppercase tracking-widest">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filters Section */}
      <div className="flex items-center gap-4 border-b pb-6 mb-8 overflow-x-auto hide-scrollbar">
        <Filter className="w-4 h-4 text-slate-400" />
        {['All', 'Ratings 4.0+', 'Offers', 'Dine-In Only', 'Pure Veg', 'Less than 30 mins'].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeFilter === f ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <h2 className="text-xl font-black text-slate-800 mb-6">Top Rated Places Near You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {RESTAURANTS.map(restaurant => (
          <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} className="group relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm mb-4">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl">
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span className="text-sm font-black text-slate-900">{restaurant.rating}</span>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Pre-Book Seats
                </div>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/90 backdrop-blur-md rounded-full transition-all group/heart">
                <Heart className="w-4 h-4 text-white group-hover/heart:text-red-500 group-hover/heart:fill-red-500" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{restaurant.name}</h3>
              <p className="text-sm font-bold text-slate-500 mb-1">{restaurant.cuisine}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600"><Clock className="w-3 h-3" /> 25-30 MINS</span>
                <span>•</span>
                <span>{restaurant.address.split(',')[0]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const RestaurantDetails: React.FC<{ onAddToCart: (item: MenuItem) => void }> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS.find(r => r.id === id);
  const [rushInfo, setRushInfo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [aiRec, setAiRec] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (restaurant) {
      getRushAnalysis(restaurant.name).then(setRushInfo);
    }
  }, [restaurant]);

  const handleSelectItem = async (item: MenuItem) => {
    setSelectedItem(item);
    setLoadingAi(true);
    const rec = await getFoodRecommendation(restaurant?.name || 'this restaurant', item.name);
    setAiRec(rec);
    setLoadingAi(false);
  };

  if (!restaurant) return <div>Restaurant not found</div>;

  const menu = MENU_ITEMS.filter(m => m.restaurantId === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition-colors font-bold uppercase text-xs tracking-widest">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <header className="mb-10 pb-8 border-b-2 border-dashed border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-2">{restaurant.name}</h1>
                <p className="text-slate-500 font-bold mb-4">{restaurant.cuisine} • Dine-in • 200 for two</p>
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2">
                     <div className="flex items-center gap-1 text-blue-600 font-black">
                       <Star className="w-4 h-4 fill-blue-600" /> {restaurant.rating}
                     </div>
                     <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">5K+ Ratings</span>
                   </div>
                   <div className="h-10 w-px bg-slate-100"></div>
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-400 uppercase">Preparation</span>
                     <span className="text-sm font-black text-slate-800 tracking-tight">25-35 MINS</span>
                   </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 text-white max-w-xs shadow-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Kitchen Status</span>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">Seats available for immediate pre-booking. Chef is ready!</p>
              </div>
            </div>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                Signature Menu
              </h2>
              <div className="space-y-6">
                {menu.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectItem(item)}
                    className={`group relative flex gap-6 p-6 rounded-3xl border transition-all cursor-pointer ${selectedItem?.id === item.id ? 'border-blue-600 bg-blue-50/20 shadow-xl' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-3 h-3 border border-emerald-500 flex items-center justify-center rounded-sm">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                         </div>
                         <span className="text-[10px] font-bold text-emerald-600 uppercase">Best Seller</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-1">{item.name}</h4>
                      <p className="text-sm font-bold text-slate-900 mb-3">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6">{item.description}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className="bg-white border-2 border-blue-600 text-blue-600 font-black px-8 py-2.5 rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-md group-hover:shadow-lg active:scale-95"
                      >
                        Add +
                      </button>
                    </div>
                    <div className="relative w-40 h-40 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-3xl shadow-xl border-4 border-white" />
                      <div className="absolute inset-0 bg-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            {selectedItem ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                <h3 className="text-xl font-black text-slate-800 mb-6">Chef's Spotlight</h3>
                <div className="relative h-56 mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-blue-600" /> PREP IN 15M
                  </div>
                </div>
                <h4 className="text-lg font-black text-slate-800 mb-2">{selectedItem.name}</h4>
                
                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 mb-8 relative">
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-tighter">AI RECOMMENDATION</div>
                  {loadingAi ? (
                    <div className="flex gap-2 py-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-900 italic font-medium leading-relaxed leading-snug">"{aiRec}"</p>
                  )}
                </div>

                <button 
                  onClick={() => onAddToCart(selectedItem)}
                  className="w-full blue-gradient text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-95 text-sm tracking-widest uppercase"
                >
                  Confirm Choice — ${selectedItem.price.toFixed(2)}
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Build your meal</h3>
                <p className="text-sm text-slate-500 font-medium">Select items from the menu to start your pre-booking process.</p>
              </div>
            )}
            
            {rushInfo && (
              <div className="mt-6 bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                   <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Peak Time Warning</h5>
                   <p className="text-xs font-medium leading-relaxed opacity-80">{rushInfo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<{ 
  cart: CartItem[], 
  onRemove: (id: string) => void,
  onUpdateQty: (id: string, delta: number) => void,
  onPlaceOrder: (time: string, guests: number) => void
}> = ({ cart, onRemove, onUpdateQty, onPlaceOrder }) => {
  const [time, setTime] = useState("12:00");
  const [guests, setGuests] = useState(2);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-blue-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShoppingCart className="w-12 h-12 text-blue-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">Your cart is empty</h2>
        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Skip the lines today! Add your favorite dishes from top restaurants to get started.</p>
        <Link to="/" className="inline-block blue-gradient text-white font-black px-12 py-4 rounded-2xl shadow-2xl shadow-blue-200 hover:scale-105 transition-transform uppercase text-sm tracking-widest">
          Find Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-slate-800 mb-10 tracking-tighter">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <section className="mb-12">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
              Review Selection
            </h2>
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-xl space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl shadow-md" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-800">{item.name}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mb-3">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border-2 border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden">
                        <button 
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="px-4 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black transition-colors"
                        >-</button>
                        <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="px-4 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black transition-colors"
                        >+</button>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
              Reservation Details
            </h2>
            <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-[2px] mb-4">Arrival Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white font-black text-lg focus:ring-2 focus:ring-blue-600 transition-all shadow-xl" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-[2px] mb-4">Party Size</label>
                  <div className="flex items-center gap-6 bg-slate-800 p-2 rounded-2xl shadow-xl border border-slate-700">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-all disabled:opacity-30"
                      disabled={guests <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xl font-black">{guests}</span>
                      <span className="text-[8px] font-black uppercase text-slate-500">Guests</span>
                    </div>
                    <button 
                      onClick={() => setGuests(Math.min(12, guests + 1))}
                      className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-slate-800 flex items-start gap-4">
                <div className="p-2 bg-blue-600/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Your table for {guests} will be ready by {time}. We maintain a strict 15-minute wait time policy to ensure fresh service for all guests.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 sticky top-24">
            <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Payment Details</h3>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Cart Subtotal</span>
                <span className="text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Dine-In Surcharge</span>
                <span className="text-emerald-600 font-black">WAIVED</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Safety Fee</span>
                <span className="text-slate-900">$1.99</span>
              </div>
              <div className="h-px bg-slate-100 w-full"></div>
              <div className="flex justify-between items-center text-2xl font-black text-slate-900">
                <span className="tracking-tighter">Total Bill</span>
                <span className="text-blue-600 font-black">${(total + 1.99).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8 flex items-center gap-4 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-100">
                <Mic className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-blue-900 leading-snug">
                Say "Confirm Order" or click below to finalize your pre-booking and seat reservation.
              </p>
            </div>

            <button 
              onClick={() => onPlaceOrder(time, guests)}
              className="w-full blue-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-95 text-base uppercase tracking-widest"
            >
              Confirm & Pay Securely
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-50 grayscale">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersPage: React.FC<{ orders: Order[], onCancel: (id: string) => void }> = ({ orders, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-slate-800 mb-10 tracking-tighter">Your Table & Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[40px] p-20 text-center shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ClipboardList className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800 mb-2">No active reservations</p>
          <p className="text-slate-500 font-bold mb-10">Hungry? Pre-book a table and your favorite meal now.</p>
          <Link to="/" className="inline-block blue-gradient text-white font-black px-12 py-4 rounded-2xl shadow-2xl shadow-blue-200">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-2xl relative">
              <div className="bg-slate-900 p-8 flex flex-wrap justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{order.restaurantName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-2 bg-slate-800 text-blue-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700">
                      <Clock className="w-3.5 h-3.5" /> Arrive @ {order.reservationTime}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-700">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> {order.guestsCount} Guests
                    </span>
                    <span className="text-[10px] text-slate-500 font-black tracking-widest">ORDER #{order.id.slice(0,8)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    order.status === OrderStatus.CONFIRMED ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                    order.status === OrderStatus.CANCELLED ? 'bg-red-500 text-white shadow-red-100' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>

              {order.status === OrderStatus.CONFIRMED && (
                <div className="bg-blue-50/50 px-8 py-6 border-b border-blue-100">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-blue-800 uppercase tracking-widest">Real-time Prep Status</span>
                      <span className="text-[10px] font-black text-blue-600 animate-pulse-soft">LIVE TRACKING</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-white rounded-full p-0.5 border border-blue-100 shadow-inner">
                         <div className="h-full bg-blue-600 rounded-full w-2/3 shadow-md shadow-blue-100 relative">
                            <div className="absolute -right-2 -top-1 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-lg"></div>
                         </div>
                      </div>
                      <span className="text-xs font-black text-blue-900 italic uppercase">Chef Cooking...</span>
                   </div>
                </div>
              )}

              <div className="p-8">
                <div className="space-y-5 mb-10 pb-8 border-b-2 border-dashed border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Pre-ordered Selection</h4>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                        <div>
                           <p className="font-black text-slate-800 leading-none mb-1">{item.name}</p>
                           <p className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Paid Via RushFree</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                    {order.refundAmount && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                        <Trash2 className="w-3 h-3" /> Refunded: ${order.refundAmount.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {order.status === OrderStatus.CONFIRMED && (
                      <>
                        <button className="flex-1 md:flex-none bg-slate-100 text-slate-800 font-black px-8 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
                           <Scan className="w-4 h-4 inline mr-2" /> Scan Table QR
                        </button>
                        <button 
                          onClick={() => onCancel(order.id)}
                          className="flex-1 md:flex-none bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black px-8 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest border border-red-100 transition-all"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === OrderStatus.CANCELLED && (
                      <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest italic py-4">
                        <CheckCircle className="w-5 h-5" /> Refund Initiated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const placeOrder = (reservationTime: string, guestsCount: number) => {
    if (cart.length === 0) return;

    const restaurant = RESTAURANTS.find(r => r.id === cart[0].restaurantId);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      restaurantId: cart[0].restaurantId,
      restaurantName: restaurant?.name || 'Restaurant',
      items: [...cart],
      totalAmount: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
      status: OrderStatus.CONFIRMED,
      orderDate: new Date().toISOString(),
      reservationTime,
      guestsCount,
      paymentMethod: 'Credit Card'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.status === OrderStatus.CONFIRMED) {
        return {
          ...o,
          status: OrderStatus.CANCELLED,
          refundAmount: o.totalAmount * 0.5
        };
      }
      return o;
    }));
  };

  const handleExport = async () => {
    const zip = new JSZip();
    const filePaths = [
      'index.html',
      'index.tsx',
      'App.tsx',
      'types.ts',
      'constants.ts',
      'metadata.json',
      'services/geminiService.ts'
    ];

    try {
      for (const path of filePaths) {
        const response = await fetch(`./${path}`);
        if (response.ok) {
          const content = await response.text();
          zip.file(path, content);
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'RushFree-Swiggy-Project.zip');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Could not export project. Check console for details.');
    }
  };

  return (
    <Router>
      <div className="min-h-screen pb-20 bg-white">
        <Navbar 
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onExport={handleExport}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails onAddToCart={addToCart} />} />
          <Route path="/cart" element={
            <CartPage 
              cart={cart} 
              onRemove={removeFromCart} 
              onUpdateQty={updateQuantity} 
              onPlaceOrder={placeOrder} 
            />
          } />
          <Route path="/orders" element={<OrdersPage orders={orders} onCancel={cancelOrder} />} />
        </Routes>

        {/* Global Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform scale-100 border-b-8 border-blue-600">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">Seats Booked!</h2>
              <p className="text-slate-500 font-bold mb-10 text-sm">Your table is being prepared. Track your meal prep live.</p>
              <div className="space-y-3">
                <Link 
                  to="/orders" 
                  onClick={() => setShowSuccessModal(false)}
                  className="block w-full blue-gradient text-white font-black py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-100 uppercase text-xs tracking-widest"
                >
                  Track Table Status
                </Link>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="block w-full bg-slate-50 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-100 transition-colors uppercase text-[10px] tracking-widest"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
