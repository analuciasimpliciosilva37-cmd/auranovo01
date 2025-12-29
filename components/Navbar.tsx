
import React, { useState } from 'react';
import { Bell, Settings, Menu, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { profile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.nickname || 'User'}&background=063A3A&color=E6B65C`;

  const openWhatsAppIA = () => {
    const phoneNumber = "5511999999999"; // Exemplo
    const text = encodeURIComponent("Olá Aura IA, gostaria de registrar um novo gasto.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <header className="h-24 bg-transparent px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-6">
        <button onClick={toggleSidebar} className="md:hidden p-3 text-aura-teal hover:bg-aura-teal/10 rounded-2xl">
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center bg-white dark:bg-aura-bgDark/40 border border-slate-200 dark:border-aura-gold/10 px-5 py-3 rounded-[1.5rem] w-80 shadow-sm transition-all focus-within:ring-2 ring-aura-gold/50">
          <Search size={18} className="text-slate-400 dark:text-aura-seafoam/30" />
          <input 
            type="text" 
            placeholder="Encontrar algo..." 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm ml-3 w-full text-aura-textL dark:text-white placeholder:text-slate-400 dark:placeholder:text-aura-seafoam/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* WhatsApp Integration Button */}
        <button 
          onClick={openWhatsAppIA}
          className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all group relative"
          title="Falar com Aura no WhatsApp"
        >
          <MessageCircle size={20} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 text-slate-500 dark:text-aura-seafoam/40 hover:text-aura-gold hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all relative group"
          >
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-aura-gold rounded-full border-2 border-white dark:border-aura-bgDark shadow-sm"></span>
          </button>
        </div>

        <Link to="/settings" className="p-3 text-slate-500 dark:text-aura-seafoam/40 hover:text-aura-gold hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all">
          <Settings size={20} />
        </Link>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5 mx-2 hidden sm:block"></div>

        <Link to="/profile" className="flex items-center gap-4 pl-2 group">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-black text-aura-textL dark:text-white group-hover:text-aura-gold transition-colors tracking-tight uppercase tracking-widest text-[10px]">{profile?.nickname}</p>
            <p className="text-[10px] text-aura-teal font-black uppercase tracking-widest opacity-60">Elite</p>
          </div>
          <div className="w-12 h-12 rounded-2xl border-2 border-aura-gold/20 group-hover:border-aura-gold transition-all overflow-hidden shadow-lg bg-aura-deep">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
