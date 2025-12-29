
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  History, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../App';
import { getTranslation } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const lang = profile?.language || 'pt';

  const menuItems = [
    { name: getTranslation('dashboard', lang), icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Mentoria Aura', icon: Lightbulb, path: '/mentoria' },
    { name: getTranslation('investments', lang), icon: TrendingUp, path: '/investments' },
    { name: getTranslation('transactions', lang), icon: History, path: '/transactions' },
    { name: getTranslation('cards', lang), icon: CreditCard, path: '/cards' },
    { name: getTranslation('expenses', lang), icon: ArrowDownCircle, path: '/expenses' },
    { name: getTranslation('receipts', lang), icon: Receipt, path: '/receipts' },
    { name: getTranslation('incomeTax', lang), icon: FileText, path: '/income-tax' },
    { name: 'Sobre AuraFin', icon: Info, path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`bg-aura-deep border-r border-aura-gold/10 transition-all duration-300 flex flex-col ${isOpen ? 'w-72' : 'w-24'} relative overflow-hidden shadow-2xl z-40`}>
      <button 
        onClick={toggle} 
        className="absolute top-8 right-2 p-2 text-white/20 hover:text-aura-gold transition-colors z-50 bg-aura-deep/80 backdrop-blur rounded-full border border-white/5"
      >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aura-teal via-aura-gold to-aura-teal opacity-60"></div>
      
      <div className="p-8 flex items-center justify-between">
        <div className={`flex items-center gap-4 overflow-hidden ${!isOpen && 'justify-center w-full'}`}>
          <div className="flex items-end gap-2 shrink-0">
            <div className="w-2 h-5 bg-white/10 rounded-full"></div>
            <div className="w-2 h-8 bg-aura-teal rounded-full"></div>
            <div className="w-2 h-10 bg-aura-gold rounded-full shadow-[0_0_15px_rgba(230,182,92,0.7)]"></div>
          </div>
          {isOpen && <span className="text-2xl font-black text-white tracking-tighter uppercase">AURAFIN</span>}
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2.5">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-5 px-5 py-4 rounded-[1.5rem] transition-all group ${
              isActive(item.path) 
                ? 'bg-aura-gold text-aura-deep font-black shadow-xl shadow-aura-gold/20 scale-[1.02]' 
                : 'text-aura-seafoam/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={22} className={isActive(item.path) ? 'text-aura-deep' : 'group-hover:text-aura-gold transition-colors'} />
            {isOpen && <span className="text-[12px] font-black uppercase tracking-[0.15em] truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-8 border-t border-white/5 space-y-2">
        <Link 
          to="/profile"
          className={`flex items-center gap-5 px-5 py-4 rounded-2xl transition-all ${isActive('/profile') ? 'text-aura-gold bg-white/5 shadow-inner' : 'text-aura-seafoam/40 hover:text-white'}`}
        >
          <User size={22} />
          {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">Meu Perfil</span>}
        </Link>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/5 transition-all font-bold"
        >
          <LogOut size={22} />
          {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
