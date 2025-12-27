
import { Restaurant, MenuItem } from './types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'The Golden Fork',
    cuisine: 'Modern Italian',
    rating: 4.8,
    image: 'https://picsum.photos/seed/fork/800/600',
    address: '123 Gourmet Ave, Food City',
    description: 'Authentic Italian recipes with a modern twist. Known for our handmade pasta and artisan pizzas.'
  },
  {
    id: 'r2',
    name: 'Sakura Zen',
    cuisine: 'Japanese Fusion',
    rating: 4.9,
    image: 'https://picsum.photos/seed/sakura/800/600',
    address: '456 Blossom Lane, East District',
    description: 'Experience the serenity of Japan with our fresh sushi rolls and premium ramen bowls.'
  },
  {
    id: 'r3',
    name: 'Urban Grill & Smoke',
    cuisine: 'American BBQ',
    rating: 4.7,
    image: 'https://picsum.photos/seed/grill/800/600',
    address: '789 Hickory Street, Downtown',
    description: 'Slow-smoked meats and locally sourced ingredients. The best ribs in the city.'
  },
  {
    id: 'r4',
    name: 'Green Leaf Bistro',
    cuisine: 'Vegan & Organic',
    rating: 4.6,
    image: 'https://picsum.photos/seed/green/800/600',
    address: '321 Nature Blvd, Eco Park',
    description: 'Farm-to-table fresh salads and creative plant-based entrees for the health-conscious diner.'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // The Golden Fork
  { id: 'm1', restaurantId: 'r1', name: 'Truffle Tagliatelle', price: 24.99, description: 'Hand-cut pasta with shaved black truffles and parmesan cream.', image: 'https://picsum.photos/seed/pasta1/400/300', category: 'Main' },
  { id: 'm2', restaurantId: 'r1', name: 'Margherita Burrata', price: 18.50, description: 'Sourdough pizza topped with creamy burrata cheese and fresh basil.', image: 'https://picsum.photos/seed/pizza1/400/300', category: 'Main' },
  { id: 'm3', restaurantId: 'r1', name: 'Tiramisu Classico', price: 9.99, description: 'Traditional Italian dessert with espresso-soaked ladyfingers.', image: 'https://picsum.photos/seed/cake1/400/300', category: 'Dessert' },
  
  // Sakura Zen
  { id: 'm4', restaurantId: 'r2', name: 'Dragon Roll', price: 16.99, description: 'Shrimp tempura and cucumber topped with avocado and eel sauce.', image: 'https://picsum.photos/seed/sushi1/400/300', category: 'Sushi' },
  { id: 'm5', restaurantId: 'r2', name: 'Tonkotsu Ramen', price: 15.50, description: 'Rich pork broth with chashu pork, bamboo shoots, and soft egg.', image: 'https://picsum.photos/seed/ramen1/400/300', category: 'Mains' },
  { id: 'm6', restaurantId: 'r2', name: 'Mochi Ice Cream', price: 7.50, description: 'Selection of three seasonal mochi flavors.', image: 'https://picsum.photos/seed/mochi1/400/300', category: 'Dessert' },

  // Urban Grill
  { id: 'm7', restaurantId: 'r3', name: 'St. Louis Ribs', price: 28.00, description: 'Full rack of dry-rubbed ribs smoked for 12 hours.', image: 'https://picsum.photos/seed/ribs1/400/300', category: 'Mains' },
  { id: 'm8', restaurantId: 'r3', name: 'Angus Smash Burger', price: 14.99, description: 'Double beef patty with aged cheddar and caramelized onions.', image: 'https://picsum.photos/seed/burger1/400/300', category: 'Mains' },
  { id: 'm9', restaurantId: 'r3', name: 'Truffle Fries', price: 6.99, description: 'Crispy fries tossed in truffle oil and parmesan.', image: 'https://picsum.photos/seed/fries1/400/300', category: 'Sides' },

  // Green Leaf
  { id: 'm10', restaurantId: 'r4', name: 'Buddha Bowl', price: 15.99, description: 'Quinoa, roasted chickpeas, kale, and avocado with tahini dressing.', image: 'https://picsum.photos/seed/bowl1/400/300', category: 'Mains' },
  { id: 'm11', restaurantId: 'r4', name: 'Cauliflower Wings', price: 12.50, description: 'Crispy cauliflower bites with spicy buffalo sauce.', image: 'https://picsum.photos/seed/cauliflower1/400/300', category: 'Starters' },
  { id: 'm12', restaurantId: 'r4', name: 'Zucchini Noodles', price: 14.99, description: 'Fresh zoodles with basil pesto and cherry tomatoes.', image: 'https://picsum.photos/seed/zoodles1/400/300', category: 'Mains' },
];
