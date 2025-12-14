import { API_BASE_URL, USE_MOCK_SERVICE } from '../constants';
import { MithaiItem, NewItemPayload, AuthResult } from '../types';
import { INITIAL_INVENTORY, DEMO_USERS } from './mockData';

// --- Local Helpers ---

let authToken: string | null = null;

export const setAuthToken = (key: string | null) => {
  authToken = key;
};

// Simple delay to fake network
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

// Local Storage Wrappers
const loadLocalData = (): MithaiItem[] => {
  try {
    const data = localStorage.getItem('mw_inventory');
    return data ? JSON.parse(data) : INITIAL_INVENTORY;
  } catch (e) {
    return INITIAL_INVENTORY;
  }
};

const persistData = (items: MithaiItem[]) => {
  localStorage.setItem('mw_inventory', JSON.stringify(items));
};

// --- API Functions ---

export const authenticate = async (email: string, pass: string, isNew: boolean = false): Promise<AuthResult> => {
  if (USE_MOCK_SERVICE) {
    await wait(700); // fake loading
    
    if (isNew) {
      // Register logic
      return {
        profile: { id: Date.now().toString(), username: email.split('@')[0], email, role: 'user' },
        key: 'demo-key-' + Date.now()
      };
    }

    // Login logic
    const foundUser = DEMO_USERS.find(u => u.email === email);
    if (foundUser) {
      return { profile: foundUser, key: 'demo-key-123' };
    }
    
    // Default guest fallback for testing
    return {
      profile: { id: '999', username: 'Guest', email, role: 'user' },
      key: 'guest-key'
    };
  }

  // Real backend call
  const endpoint = isNew ? '/auth/register' : '/auth/login';
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }) // backend expects 'password'
  });

  if (!response.ok) throw new Error('Auth Error');
  return response.json();
};

export const fetchInventory = async (): Promise<MithaiItem[]> => {
  if (USE_MOCK_SERVICE) {
    await wait(400);
    return loadLocalData();
  }

  const res = await fetch(`${API_BASE_URL}/sweets`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const addItem = async (details: NewItemPayload): Promise<MithaiItem> => {
  if (USE_MOCK_SERVICE) {
    await wait(500);
    const currentList = loadLocalData();
    const newItem: MithaiItem = { 
      ...details, 
      id: Math.random().toString(36).substring(7) 
    };
    persistData([...currentList, newItem]);
    return newItem;
  }

  const res = await fetch(`${API_BASE_URL}/sweets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify(details)
  });
  return res.json();
};

export const editItem = async (id: string, updates: Partial<NewItemPayload>): Promise<void> => {
  if (USE_MOCK_SERVICE) {
    await wait(300);
    const list = loadLocalData();
    const idx = list.findIndex(x => x.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      persistData(list);
    }
    return;
  }

  await fetch(`${API_BASE_URL}/sweets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify(updates)
  });
};

export const removeItem = async (id: string): Promise<void> => {
  if (USE_MOCK_SERVICE) {
    await wait(300);
    const list = loadLocalData();
    persistData(list.filter(x => x.id !== id));
    return;
  }

  await fetch(`${API_BASE_URL}/sweets/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
};

export const orderItem = async (id: string, isRestock: boolean = false, qty: number = 1): Promise<void> => {
  if (USE_MOCK_SERVICE) {
    await wait(200);
    const list = loadLocalData();
    const item = list.find(x => x.id === id);
    if (item) {
      if (isRestock) {
        item.stock += qty;
      } else {
        if (item.stock > 0) item.stock -= 1;
        else throw new Error("OOS");
      }
      persistData(list);
    }
    return;
  }

  const action = isRestock ? 'restock' : 'purchase';
  await fetch(`${API_BASE_URL}/sweets/${id}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: isRestock ? JSON.stringify({ amount: qty }) : undefined
  });
};