// Types for the frontend
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  sessionKey?: string; // changed from token to sessionKey
}

export interface MithaiItem {
  id: string;
  name: string;
  type: string; // changed from category
  priceInr: number; // changed from price
  stock: number; // changed from quantity
  desc: string;
  photoUrl?: string;
}

export interface AuthResult {
  profile: UserProfile;
  key: string;
}

export type NewItemPayload = Omit<MithaiItem, 'id'>;

export interface SearchParams {
  query: string;
  typeFilter: string;
  budgetCap: number;
}