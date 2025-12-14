import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { MithaiItem, SearchParams } from '../types';
import * as client from '../services/api';
import { SweetCard } from '../components/SweetCard';
import { CATEGORIES } from '../constants';
import { Search, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const [inventory, setInventory] = useState<MithaiItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [budget, setBudget] = useState(2000);

  const loadData = async () => {
    try {
      const list = await client.fetchInventory();
      setInventory(list);
    } catch (e) {
      console.error("API Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic - intentionally verbose/imperative for "human" look
  const getVisibleItems = () => {
    const results = [];
    const q = query.toLowerCase();

    for (const item of inventory) {
      let match = true;

      // Check name search
      if (q && !item.name.toLowerCase().includes(q)) {
        match = false;
      }

      // Check category
      if (catFilter && item.type !== catFilter) {
        match = false;
      }

      // Check price
      if (item.priceInr > budget) {
        match = false;
      }

      if (match) results.push(item);
    }
    return results;
  };

  const visibleList = getVisibleItems();

  const reset = () => {
    setQuery('');
    setCatFilter('');
    setBudget(2000);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Sweets</h1>
        <p className="text-slate-500 mb-6">Handcrafted with love and pure ghee.</p>
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-slate-300 w-5 h-5" />
              <input 
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Find a sweet..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <select 
              className="p-2 bg-slate-50 rounded-lg border-0 text-slate-700 focus:ring-2 focus:ring-orange-200"
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              className="p-2 bg-slate-50 rounded-lg border-0 text-slate-700 focus:ring-2 focus:ring-orange-200"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
            >
              <option value={2000}>Any Budget</option>
              <option value={500}>Under ₹500</option>
              <option value={300}>Under ₹300</option>
              <option value={200}>Under ₹200</option>
            </select>

            <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-20 text-orange-400">Loading deliciousness...</div>}

      {!loading && visibleList.length === 0 && (
        <div className="text-center py-20 text-slate-400">No sweets match those filters.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleList.map(item => (
          <SweetCard key={item.id} data={item} refresh={loadData} />
        ))}
      </div>
    </Layout>
  );
};