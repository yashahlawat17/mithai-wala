import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, onLogout, hasAccess, isAdmin } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const doLogout = () => {
    onLogout();
    nav('/login');
  };

  const isActive = (path: string) => loc.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5]">
      <header className="bg-white border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-orange-500 rounded-lg p-2 transition-transform group-hover:scale-105">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">Mithai<span className="text-orange-500">Wala</span></span>
            </Link>
            
            <nav className="hidden sm:flex gap-6">
              <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>
                Menu
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`text-sm font-medium transition-colors ${isActive('/admin') ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div>
            {hasAccess ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 flex items-center">
                  {isAdmin ? <Shield className="w-3 h-3 mr-1 text-orange-500" /> : <UserIcon className="w-3 h-3 mr-1" />}
                  {profile?.username}
                </span>
                <button onClick={doLogout} className="text-slate-400 hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"><Button variant="outline" className="text-xs">Login</Button></Link>
                <Link to="/register"><Button className="text-xs">Sign Up</Button></Link>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="bg-orange-50 border-t border-orange-100 py-8">
        <div className="text-center text-slate-400 text-sm">
          <p>© 2024 Mithai Wala. Made with fresh ingredients.</p>
        </div>
      </footer>
    </div>
  );
};