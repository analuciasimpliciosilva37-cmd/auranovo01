
import React, { useState } from 'react';
import { Sparkles, TrendingUp, Info, Shield, Target, ArrowRight, ExternalLink, Wallet, CheckCircle } from 'lucide-react';
import { getInvestmentRecommendations } from '../gemini';
import { useAuth } from '../App';
import { supabase } from '../supabase';

const Investments: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingBase, setSavingBase] = useState(false);
  
  // Campo para patrimônio já investido
  const [investedBase, setInvestedBase] = useState(profile?.total_invested_base?.toString() || '0');

  const handleAskAura = async () => {
    if (!amount) return;
    setLoading(true);
    const recs = await getInvestmentRecommendations(parseFloat(amount));
    const recsWithLinks = recs.map(r => {
      let link = "https://www.tesourodireto.com.br/";
      if (r.name.toLowerCase().includes('cdb') || r.name.toLowerCase().includes('banco')) link = "https://www.itau.com.br/investimentos";
      if (r.name.toLowerCase().includes('fii') || r.name.toLowerCase().includes('bolsa')) link = "https://www.nuinvest.com.br/";
      return { ...r, link };
    });
    setRecommendations(recsWithLinks);
    setLoading(false);
  };

  const saveInvestedBase = async () => {
    setSavingBase(true);
    await supabase.from('profiles').update({ total_invested_base: parseFloat(investedBase) }).eq('id', profile?.id);
    await refreshProfile();
    setSavingBase(false);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tighter text-aura-textL dark:text-white uppercase">Caminho da Riqueza</h1>
        <p className="text-slate-500 dark:text-aura-seafoam/50 text-lg max-w-2xl mx-auto italic font-medium">Investir é mais simples do que parece. Diga-nos quanto quer guardar e a Aura IA mostrará onde seu dinheiro cresce mais rápido.</p>
      </div>

      {/* CARD DE PATRIMÔNIO: Ajuste de Contraste e Visibilidade Realçado */}
      <div className="premium-card p-10 bg-white dark:bg-aura-deep border-aura-gold shadow-2xl animate-in fade-in slide-in-from-top-4 border-2">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-aura-gold/20 rounded-[2rem] text-aura-gold shadow-inner">
                  <Wallet size={32} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-aura-textL dark:text-white">Patrimônio já investido</h3>
                  <p className="text-slate-600 dark:text-aura-seafoam/60 text-xs font-bold italic">Quanto você já possui aplicado fora do AuraFin?</p>
               </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-48">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-gold font-black text-lg">R$</span>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-aura-textL dark:text-white font-black text-xl focus:ring-4 ring-aura-gold/20 outline-none transition-all"
                    value={investedBase}
                    onChange={e => setInvestedBase(e.target.value)}
                  />
               </div>
               <button 
                onClick={saveInvestedBase}
                disabled={savingBase}
                className="bg-aura-gold text-aura-deep px-8 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-aura-deep hover:text-white dark:hover:bg-white dark:hover:text-aura-deep transition-all shadow-xl disabled:opacity-50 flex items-center justify-center min-w-[64px]"
               >
                 {savingBase ? (
                   <div className="w-5 h-5 border-2 border-aura-deep border-t-transparent animate-spin rounded-full"></div>
                 ) : (
                   <CheckCircle size={24} />
                 )}
               </button>
            </div>
         </div>
      </div>

      <div className="premium-card p-12 max-w-2xl mx-auto bg-white dark:bg-aura-deep/40 border-slate-100 dark:border-white/5 shadow-2xl">
        <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-aura-textL dark:text-white uppercase tracking-tighter justify-center">
          <Target className="text-aura-gold" size={28} /> Quanto você deseja investir hoje?
        </h2>
        
        <div className="relative mb-8">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-aura-gold">R$</span>
          <input 
            type="number" 
            className="w-full bg-slate-50 dark:bg-aura-bgDark border-2 border-slate-200 dark:border-transparent focus:border-aura-gold rounded-[2rem] pl-16 pr-8 py-6 text-4xl font-black focus:ring-4 ring-aura-gold/10 transition-all outline-none text-aura-textL dark:text-white"
            placeholder="0,00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <button 
          onClick={handleAskAura}
          disabled={loading || !amount}
          className="w-full bg-aura-deep dark:bg-aura-gold text-white dark:text-aura-deep hover:bg-aura-teal dark:hover:bg-white disabled:opacity-50 py-6 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all shadow-2xl uppercase tracking-widest text-sm"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles size={22} /> Obter Guia de Investimento
            </>
          )}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          {recommendations.map((rec, i) => (
            <div key={i} className="premium-card p-8 flex flex-col justify-between group bg-white dark:bg-aura-deep/40 border-slate-100 dark:border-white/5">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-aura-gold/10 text-aura-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-xl font-black mb-3 text-aura-textL dark:text-white uppercase tracking-tighter">{rec.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[9px] font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-aura-bgDark text-slate-500 uppercase tracking-widest">{rec.risk} Risco</span>
                  <span className="text-[9px] font-black px-3 py-1 rounded-full bg-aura-emerald/10 text-aura-emerald uppercase tracking-widest">{rec.expectedReturn} Retorno</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-aura-seafoam/60 leading-relaxed mb-8 italic font-medium">"{rec.description}"</p>
              </div>
              <a 
                href={rec.link} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-aura-gold/10 text-aura-gold text-[10px] font-black uppercase tracking-widest hover:bg-aura-gold hover:text-aura-deep transition-all flex items-center justify-center gap-2"
              >
                Começar agora <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="premium-card p-10 bg-aura-gold/5 border-aura-gold/20 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-white dark:bg-aura-deep rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl text-aura-gold border border-aura-gold/10">
          <Shield size={40} />
        </div>
        <div>
          <h3 className="text-xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Sua Segurança é Primeiro Lugar</h3>
          <p className="text-slate-500 dark:text-aura-seafoam/60 text-base leading-relaxed mt-1 font-medium">A Aura IA sugere apenas ativos regulados pelo Banco Central e CVM. Lembre-se: o melhor investimento hoje é começar cedo, mesmo que com pouco.</p>
        </div>
      </div>
    </div>
  );
};

export default Investments;
