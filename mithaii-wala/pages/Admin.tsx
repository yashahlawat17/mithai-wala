import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { MithaiItem, NewItemPayload } from '../types';
import * as client from '../services/api';
import { Button } from '../components/Button';
import { CATEGORIES, PLACEHOLDER_IMAGES } from '../constants';
import { Plus, Edit2, Trash2, X, AlertTriangle, Package, Image as ImageIcon } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [list, setList] = useState<MithaiItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  
  // Stats
  const [stats, setStats] = useState({ total: 0, lowStock: 0, value: 0 });

  // Form State
  const [formData, setFormData] = useState<Partial<NewItemPayload>>({});

  const reload = async () => {
    const data = await client.fetchInventory();
    setList(data);
    
    // Calculate simple stats
    const low = data.filter(i => i.stock < 10).length;
    const val = data.reduce((acc, item) => acc + (item.priceInr * item.stock), 0);
    setStats({ total: data.length, lowStock: low, value: val });
  };

  useEffect(() => {
    reload();
  }, []);

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.name || !formData.priceInr) return;

    const payload: any = {
      name: formData.name,
      type: formData.type || 'Ghee Sweets',
      priceInr: Number(formData.priceInr),
      stock: Number(formData.stock) || 0,
      desc: formData.desc || '',
      photoUrl: formData.photoUrl || PLACEHOLDER_IMAGES[0]
    };

    try {
      if (editTarget) {
        await client.editItem(editTarget, payload);
      } else {
        await client.addItem(payload);
      }
      setShowModal(false);
      setEditTarget(null);
      setFormData({});
      reload();
    } catch (err) {
      alert("Failed to save item");
    }
  };

  const remove = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this sweet permanently?')) {
      await client.removeItem(id);
      reload();
    }
  };

  const restock = async (id: string) => {
    const val = prompt('Enter quantity to add to stock:');
    if (val && !isNaN(parseInt(val))) {
      await client.orderItem(id, true, parseInt(val));
      reload();
    }
  };

  const startEdit = (item: MithaiItem) => {
    setFormData(item);
    setEditTarget(item.id);
    setShowModal(true);
  };

  const startNew = () => {
    setFormData({ 
      type: 'Ghee Sweets', 
      photoUrl: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
      stock: 20
    });
    setEditTarget(null);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Overview and inventory management.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="w-4 h-4 mr-2" /> Add New Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Items</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Inventory Value</p>
            <p className="text-2xl font-bold text-slate-800">₹{stats.value.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <span className="text-xl font-bold">₹</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-red-600' : 'text-slate-800'}`}>{stats.lowStock}</p>
          </div>
          <div className={`p-3 rounded-lg ${stats.lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.photoUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">{item.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{item.type}</td>
                  <td className="p-4 font-medium text-slate-700">₹{item.priceInr}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold inline-block min-w-[30px] text-center ${item.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => restock(item.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 mr-4">
                      + Stock
                    </button>
                    <button onClick={() => startEdit(item)} className="inline-block p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                      <Edit2 className="w-4 h-4"/>
                    </button>
                    <button onClick={() => remove(item.id)} className="inline-block p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    Inventory is empty. Add some sweets!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{editTarget ? 'Edit Sweet' : 'Add New Sweet'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveItem} className="p-6 space-y-4">
              {/* Image Preview Area */}
              <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <div className="h-16 w-16 bg-white rounded border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-300">
                    {formData.photoUrl ? <img src={formData.photoUrl} className="w-full h-full object-cover" /> : <ImageIcon />}
                 </div>
                 <div className="flex-grow">
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Image URL</label>
                   <input 
                      className="w-full text-sm bg-white border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-orange-200 outline-none" 
                      placeholder="https://..."
                      value={formData.photoUrl || ''}
                      onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Name</label>
                  <input className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" required 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Type</label>
                  <select className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Price (INR)</label>
                  <input className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" type="number" required
                    value={formData.priceInr || ''}
                    onChange={e => setFormData({...formData, priceInr: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Stock Qty</label>
                  <input className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" type="number" required
                    value={formData.stock || ''}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description</label>
                <textarea className="w-full border border-slate-300 p-2 rounded-lg h-24 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                  value={formData.desc || ''}
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editTarget ? 'Save Changes' : 'Create Item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};