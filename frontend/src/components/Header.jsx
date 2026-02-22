import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Suchen..."
            className="input-field pl-9 py-2 w-64 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          CR
        </div>
      </div>
    </header>
  );
}
