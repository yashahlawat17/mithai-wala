import { MithaiItem, UserProfile } from '../types';

export const DEMO_USERS: UserProfile[] = [
  { id: 'u1', username: 'admin', email: 'admin@mithaiwala.com', role: 'admin' },
  { id: 'u2', username: 'vikram', email: 'vikram@test.com', role: 'user' },
];

export const INITIAL_INVENTORY: MithaiItem[] = [
  {
    id: 'm1',
    name: 'Gulab Jamun (1kg)',
    type: 'Ghee Sweets',
    priceInr: 350,
    stock: 40,
    desc: 'Classic milk-solid balls dipped in rose sugar syrup. Best served warm.',
    photoUrl: 'https://placehold.co/400x300/8B4513/FFF?text=Gulab+Jamun'
  },
  {
    id: 'm2',
    name: 'Kaju Katli (500g)',
    type: 'Dry Fruit Sweets',
    priceInr: 450,
    stock: 60,
    desc: 'Premium cashew fudge with silver varq. A Diwali favorite.',
    photoUrl: 'https://placehold.co/400x300/E0E0E0/333?text=Kaju+Katli'
  },
  {
    id: 'm3',
    name: 'Rasgulla (1kg)',
    type: 'Bengali Sweets',
    priceInr: 280,
    stock: 25,
    desc: 'Spongy cottage cheese balls in light syrup.',
    photoUrl: 'https://placehold.co/400x300/FFF/333?text=Rasgulla'
  },
  {
    id: 'm4',
    name: 'Motichoor Laddu',
    type: 'Festive Specials',
    priceInr: 320,
    stock: 80,
    desc: 'Tiny gram flour pearls fried in ghee.',
    photoUrl: 'https://placehold.co/400x300/FFA500/FFF?text=Motichoor+Laddu'
  },
  {
    id: 'm5',
    name: 'Mysore Pak',
    type: 'Ghee Sweets',
    priceInr: 380,
    stock: 15,
    desc: 'Melt in mouth ghee sweet from the south.',
    photoUrl: 'https://placehold.co/400x300/D2691E/FFF?text=Mysore+Pak'
  },
  {
    id: 'm6',
    name: 'Rasmalai (6pc)',
    type: 'Bengali Sweets',
    priceInr: 220,
    stock: 0,
    desc: 'Creamy milk dessert with saffron and pistachios.',
    photoUrl: 'https://placehold.co/400x300/FFFACD/333?text=Rasmalai'
  },
  {
    id: 'm7',
    name: 'Soan Papdi',
    type: 'Ghee Sweets',
    priceInr: 180,
    stock: 100,
    desc: 'Flaky, crispy, and sweet.',
    photoUrl: 'https://placehold.co/400x300/F5DEB3/333?text=Soan+Papdi'
  }
];