
import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, ShieldCheck, Sigma, PieChart, Info } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { formatCurrency } from '../translations';

const IncomeTax: React.FC = () => {
  const { user, profile } = useAuth();
  const [data, setData] = useState<{ incomes: any[], expenses: any[] }>({ incomes: [], expenses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: trans } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      if (trans) {
        setData({
          incomes: trans.filter(t => t.type === 'income'),
          expenses: trans.filter(t => t.type === 'expense')
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  const categoriesIncome = Array.from(new Set(data.incomes.map(i => i.income_category || i.category || 'Outros')));
  const categoriesExpense = Array.from(new Set(data.expenses.map(e => e.category || 'Geral')));

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Bússola Fiscal</h1>
          <p className="text-slate-600 dark:text-aura-seafoam/60 text-lg italic font-bold mt-1">Sua declaração anual consolidada com máxima transparência.</p>
        </div>
        <button onClick={() => window.print()} className="bg-aura-gold text-aura-deep px-12 py-5 rounded-[2.5rem] font-black flex items-center gap-3 shadow-2xl uppercase tracking-widest text-[12px] hover:bg-aura-textL hover:text-white transition-all transform hover:-translate-y-1">
          <Printer size={22} /> Exportar Dossiê
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Rendimentos - Visibilidade Máxima */}
        <div className="premium-card p-12 bg-white dark:bg-aura-deep shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-aura-emerald/30 space-y-12 ring-2 ring-aura-emerald/5">
           <h3 className="text-3xl font-black text-aura-emerald uppercase tracking-tighter flex items-center gap-5">
             <div className="p-4 bg-aura-emerald/10 rounded-3xl shadow-inner"><Sigma size={32} /></div> Rendimentos
           </h3>
           <div className="space-y-8">
              {categoriesIncome.map(cat => {
                const total = data.incomes.filter(i => (i.income_category || i.category || 'Outros') === cat).reduce((acc, i) => acc + i.amount, 0);
                return (
                  <div key={cat} className="flex justify-between items-end py-6 border-b-2 border-slate-100 dark:border-white/10 last:border-0 hover:translate-x-3 transition-transform cursor-default group">
                    <span className="text-base font-black text-slate-500 dark:text-white/80 uppercase tracking-widest group-hover:text-aura-emerald transition-colors">{cat}</span>
                    <span className="text-2xl font-black text-aura-textL dark:text-white">{formatCurrency(total, profile?.country)}</span>
                  </div>
                )
              })}
              {categoriesIncome.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-black uppercase tracking-widest">Nenhum rendimento capturado.</p>
                </div>
              )}
           </div>
        </div>

        {/* Despesas - Visibilidade Máxima */}
        <div className="premium-card p-12 bg-white dark:bg-aura-deep shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-aura-gold/30 space-y-12 ring-2 ring-aura-gold/5">
           <h3 className="text-3xl font-black text-aura-gold uppercase tracking-tighter flex items-center gap-5">
             <div className="p-4 bg-aura-gold/10 rounded-3xl shadow-inner"><PieChart size={32} /></div> Deduções
           </h3>
           <div className="space-y-8">
              {categoriesExpense.map(cat => {
                const total = data.expenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0);
                return (
                  <div key={cat} className="flex justify-between items-end py-6 border-b-2 border-slate-100 dark:border-white/10 last:border-0 hover:translate-x-3 transition-transform cursor-default group">
                    <span className="text-base font-black text-slate-500 dark:text-white/80 uppercase tracking-widest group-hover:text-aura-gold transition-colors">{cat}</span>
                    <span className="text-2xl font-black text-aura-textL dark:text-white">{formatCurrency(total, profile?.country)}</span>
                  </div>
                )
              })}
              {categoriesExpense.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-black uppercase tracking-widest">Nenhuma despesa capturada.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Nota Legal - Visibilidade Máxima */}
      <div className="premium-card p-12 bg-aura-deep text-white border-4 border-aura-gold/40 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-aura-gold/5 pointer-events-none"></div>
        <div className="w-28 h-28 bg-white/10 rounded-[3rem] flex items-center justify-center text-aura-gold shrink-0 shadow-2xl border-2 border-aura-gold/20 animate-pulse">
           <ShieldCheck size={56} />
        </div>
        <div className="relative z-10">
           <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Integridade das Informações</h4>
           <p className="text-aura-seafoam/80 text-xl leading-relaxed italic font-semibold">"Este relatório é uma consolidação estratégica de seus registros no AuraFin. Para conformidade tributária total, utilize este documento como guia complementar aos seus informes bancários e fiscais oficiais."</p>
        </div>
      </div>
    </div>
  );
};

export default IncomeTax;
