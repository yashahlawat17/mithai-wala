import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as client from '../services/api';
import { Button } from '../components/Button';
import { ShoppingBag } from 'lucide-react';
import { USE_MOCK_SERVICE } from '../constants';

export const Login: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [username, setName] = useState(''); // Only for register
  
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  
  const { onLogin } = useAuth();
  const nav = useNavigate();

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');

    try {
      const res = await client.authenticate(email, password, isRegister);
      // We might need to attach the username if registering, but for now mock returns it
      if (isRegister) {
        res.profile.username = username; 
      }
      
      onLogin(res.key, res.profile);
      nav('/');
    } catch (err) {
      setMsg('Invalid credentials. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
        
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 rounded-xl p-3 shadow-lg shadow-orange-200">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-center text-2xl font-bold text-slate-800 mb-2">
          {isRegister ? 'Join the Family' : 'Welcome Back'}
        </h2>
        
        <form className="space-y-4 mt-8" onSubmit={submitForm}>
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
              <input
                type="text"
                required
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {msg && (
            <div className="text-center text-red-500 text-sm bg-red-50 p-2 rounded">
              {msg}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={busy}>
            {isRegister ? 'Sign Up' : 'Log In'}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-4">
            {isRegister ? 'Have an account?' : 'New here?'}
            <Link to={isRegister ? '/login' : '/register'} className="ml-1 text-orange-600 font-semibold">
              {isRegister ? 'Login' : 'Create Account'}
            </Link>
          </div>

          {USE_MOCK_SERVICE && !isRegister && (
             <div className="mt-6 p-3 bg-slate-50 rounded text-xs text-slate-400 text-center">
               Tip: use <b>admin@mithaiwala.com</b> for admin features
             </div>
          )}
        </form>
      </div>
    </div>
  );
};