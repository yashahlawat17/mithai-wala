import React, { useState } from 'react';
import { MithaiItem } from '../types';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';
import * as client from '../services/api';

interface Props {
  data: MithaiItem;
  refresh?: () => void;
}

export const SweetCard: React.FC<Props> = ({ data, refresh }) => {
  const { hasAccess } = useAuth();
  const [isBusy, setIsBusy] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const buyItem = async () => {
    if (!hasAccess) return;
    
    setIsBusy(true);
    try {
      await client.orderItem(data.id, false); // false = purchase
      setOrdered(true);
      if (refresh) refresh();
      
      // Reset success state after a bit
      setTimeout(() => setOrdered(false), 1500);
    } catch (e) {
      alert("Could not buy item");
    } finally {
      setIsBusy(false);
    }
  };

  const empty = data.stock <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100/50 hover:border-orange-200 transition-all flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-orange-50">
        <img 
          src={data.photoUrl} 
          alt={data.name} 
          loading="lazy"
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-orange-800">
          {data.type}
        </span>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800">{data.name}</h3>
          <span className="text-orange-600 font-bold">₹{data.priceInr}</span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{data.desc}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>Availability</span>
          <span className={data.stock < 10 ? 'text-red-500 font-medium' : 'text-slate-600'}>
            {empty ? 'Sold Out' : `${data.stock} left`}
          </span>
        </div>

        {hasAccess ? (
          <Button 
            onClick={buyItem} 
            disabled={empty || isBusy}
            isLoading={isBusy}
            className={`w-full ${ordered ? '!bg-green-600' : ''}`}
          >
            {ordered ? <span className="flex items-center"><Check className="w-4 h-4 mr-2"/> Added</span> : (empty ? 'Out of Stock' : 'Add to Box')}
          </Button>
        ) : (
          <div className="text-center text-xs text-orange-400 bg-orange-50 py-2 rounded">
            Login to order
          </div>
        )}
      </div>
    </div>
  );
};