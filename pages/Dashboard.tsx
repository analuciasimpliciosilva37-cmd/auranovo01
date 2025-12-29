
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Sparkles, BarChart3, ArrowRight, ShieldCheck, Heart, Shield, PiggyBank, HandCoins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { Transaction } from '../types';
import { getAuraSuggestion } from '../gemini';
import { getTranslation, formatCurrency } from '../translations';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [auraTip, setAuraTip] = useState<string>("Buscando sua frequência de abundância...");
  const lang = profile?.language || 'pt';

  const metrics = {
    balance: transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0),
    income: transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    expenses: transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    investments: (transactions.filter(t => t.income_category === 'investment' || t.category === 'Investimento').reduce((acc, t) => acc + t.amount, 0)) + (profile?.total_invested_base || 0)
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      if (data) setTransactions(data);
      
      const tip = await getAuraSuggestion(metrics.balance, metrics.expenses);
      setAuraTip(tip);
      setLoading(false);
    };
    fetchData();
  }, [user.id, profile?.total_invested_base]);

  const MetricCard = ({ title, value, icon: Icon, isGold = false }: any) => (
    <div className={`premium-card p-8 flex flex-col justify-between h-full group ${isGold ? 'ring-1 ring-aura-gold/30 gold-glow' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura-teal dark:text-aura-seafoam/50 mb-1 block">{title}</span>
          <h2 className="text-2xl font-black tracking-tighter text-aura-textL dark:text-aura-textD">
            {formatCurrency(value, profile?.country)}
          </h2>
        </div>
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${isGold ? 'bg-aura-gold text-aura-deep' : 'bg-aura-seafoam/10 text-aura-gold'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${value >= 0 ? 'bg-aura-emerald' : 'bg-rose-500'}`}></div>
        <span className="text-[9px] font-bold text-slate-400 dark:text-aura-seafoam/30 uppercase tracking-widest">Monitorado</span>
      </div>
    </div>
  );

  const thermometerData = [
    { label: getTranslation('essential', lang), val: 60, icon: Shield, color: 'text-aura-teal', bg: 'bg-aura-teal/10' },
    { label: getTranslation('paySelf', lang), val: 5, icon: HandCoins, color: 'text-aura-gold', bg: 'bg-aura-gold/10' },
    { label: getTranslation('savings', lang), val: 10, icon: PiggyBank, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: getTranslation('invest', lang), val: 15, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: getTranslation('abound', lang), val: 10, icon: Sparkles, color: 'text-amber-300', bg: 'bg-amber-300/10' },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20 overflow-hidden">
      {/* Header Abundância */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-aura-textL dark:text-aura-textD leading-tight">
            Seu Horizonte, <span className="text-aura-gold">{profile?.nickname}</span>
          </h1>
          <p className="text-slate-500 dark:text-aura-seafoam/50 text-base font-medium mt-1 italic flex items-center gap-2">
            <ShieldCheck size={18} className="text-aura-gold" /> "Inteligência financeira que você sente."
          </p>
        </div>
        <div className="premium-card px-6 py-3 bg-aura-gold/5 border-aura-gold/20 flex items-center gap-3">
          <div className="w-2 h-2 bg-aura-gold rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-aura-gold uppercase tracking-[0.2em]">Fluxo Estável</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={getTranslation('balance', lang)} value={metrics.balance} icon={Wallet} isGold={true} />
        <MetricCard title={getTranslation('income', lang)} value={metrics.income} icon={TrendingUp} />
        <MetricCard title={getTranslation('investments', lang)} value={metrics.investments} icon={BarChart3} />
        <MetricCard title={getTranslation('expenses', lang)} value={metrics.expenses} icon={TrendingDown} />
      </div>

      {/* Termômetro Financeiro - Cards Separados */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-aura-textL dark:text-white tracking-tighter uppercase">{getTranslation('thermometer', lang)}</h3>
          <span className="text-[10px] font-bold text-aura-gold uppercase tracking-[0.2em]">Distribuição Sugerida</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {thermometerData.map((item, idx) => {
            const distributedValue = (metrics.income * item.val) / 100;
            return (
              <div key={idx} className="premium-card p-6 flex flex-col justify-between hover:scale-105 transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-2xl ${item.bg} ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black text-aura-gold bg-aura-gold/10 px-2 py-0.5 rounded-full">{item.val}%</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 dark:text-aura-seafoam/40 uppercase tracking-widest mb-1 truncate">{item.label}</p>
                  <p className="text-lg font-black text-aura-textL dark:text-aura-textD truncate">
                    {formatCurrency(distributedValue, profile?.country)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-10 flex flex-col justify-between h-full bg-gradient-to-b from-transparent to-aura-gold/5 overflow-hidden">
          <h3 className="text-xl font-black text-aura-textL dark:text-aura-textD mb-8 uppercase tracking-tighter">Fluxo Recente</h3>
          <div className="space-y-6 flex-1">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-aura-emerald/10 text-aura-emerald' : 'bg-slate-100 dark:bg-aura-bgDark text-slate-400'}`}>
                    {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-aura-textL dark:text-white truncate w-32 group-hover:text-aura-gold transition-colors">{t.description}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(t.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')}</p>
                  </div>
                </div>
                <p className={`text-sm font-black ${t.type === 'income' ? 'text-aura-emerald' : 'text-aura-textL dark:text-white'}`}>
                   {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, profile?.country)}
                </p>
              </div>
            ))}
          </div>
          <Link to="/transactions" className="mt-8 py-4 bg-aura-gold/10 text-aura-gold text-center rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.4em] hover:bg-aura-gold hover:text-aura-deep transition-all border border-aura-gold/20">
            Explorar Atividades
          </Link>
        </div>

        <div className="premium-card p-10 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-aura-deep to-aura-bgDark border-aura-gold/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-aura-gold/5 blur-[80px] rounded-full"></div>
          <div className="w-20 h-20 bg-aura-gold rounded-3xl flex items-center justify-center text-aura-deep shrink-0 shadow-2xl rotate-3">
            <Sparkles size={40} />
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Aura de Sabedoria</h3>
            <p className="text-aura-seafoam/70 text-base font-medium italic leading-snug">"{auraTip}"</p>
          </div>
          <Link to="/investments" className="bg-white text-aura-deep px-8 py-4 rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-aura-gold transition-all shadow-xl hover:scale-105 shrink-0">
            Expandir Patrimônio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;