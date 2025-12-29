
import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, BrainCircuit, ShieldCheck, ArrowRight, HelpCircle, CheckCircle, AlertCircle, TrendingUp, HandCoins, Info } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { getAuraMentorship } from '../gemini';
import { formatCurrency } from '../translations';

const AuraStrategy: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchStrategy = async () => {
    setLoading(true);
    setError('');
    try {
      // Busca dados necessários para a análise
      const { data: transactions } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      const { data: cards } = await supabase.from('cards').select('*').eq('user_id', user.id);
      
      const scenario = {
        balance: transactions?.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0),
        debts: transactions?.filter(t => t.type === 'expense' && t.status === 'pending'),
        cards: cards?.map(c => ({ name: c.name, limit: c.total_limit, due_day: c.due_day })),
        total_invested: profile?.total_invested_base || 0
      };

      const result = await getAuraMentorship(scenario);
      if (result) {
        setStrategy(result);
      } else {
        setError('Não foi possível gerar sua mentoria no momento. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar seu cenário.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, [user.id]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Header Mentoria */}
      <section className="text-center space-y-6 pt-10">
        <div className="w-24 h-24 bg-aura-gold/10 rounded-[2.5rem] flex items-center justify-center text-aura-gold mx-auto shadow-xl border border-aura-gold/20 mb-6">
          <BrainCircuit size={48} className="animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Mentoria de Abundância</h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-aura-seafoam/50 max-w-2xl mx-auto italic font-medium">
          A Aura IA analisa seu cenário integral para projetar sua paz financeira. Receba orientações estratégicas sobre suas dívidas, gastos e o momento certo para decidir.
        </p>
        <button 
          onClick={fetchStrategy}
          disabled={loading}
          className="bg-aura-gold text-aura-deep px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-aura-textL hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Consultando a Aura...' : 'Recalcular Estratégia'}
        </button>
      </section>

      {strategy ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Prioridade de Pagamento */}
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-card p-10 bg-white dark:bg-aura-deep shadow-2xl border-aura-teal/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-aura-teal/10 rounded-2xl text-aura-teal">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-aura-textL dark:text-white">Fila de Prioridade</h3>
              </div>
              <ul className="space-y-6">
                {strategy.priority_list.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-5 group">
                    <div className="w-8 h-8 rounded-full bg-aura-gold/10 flex items-center justify-center text-aura-gold font-black text-xs shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <p className="text-lg text-slate-600 dark:text-aura-seafoam/70 font-medium italic leading-relaxed group-hover:text-aura-gold transition-colors">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plano de Ação */}
              <div className="premium-card p-10 bg-aura-teal/5 border-aura-teal/20 shadow-xl">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-aura-teal">
                  <Sparkles size={22} /> Próximos Passos
                </h4>
                <ul className="space-y-5">
                  {strategy.action_plan.map((step: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-white/60">
                      <div className="w-1.5 h-1.5 bg-aura-teal rounded-full"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dicas Comportamentais */}
              <div className="premium-card p-10 bg-aura-gold/5 border-aura-gold/20 shadow-xl">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-aura-gold">
                  <HandCoins size={22} /> Mente Próspera
                </h4>
                <ul className="space-y-5">
                  {strategy.behavioral_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm font-bold text-slate-500 dark:text-white/60 italic leading-relaxed">
                      "{tip}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mentoria e Empréstimos */}
          <div className="space-y-8">
            <div className="premium-card p-10 bg-aura-deep text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-aura-gold/10 blur-3xl rounded-full"></div>
              <h4 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-aura-gold">
                <AlertCircle size={22} /> Veredito: Empréstimo
              </h4>
              <p className="text-aura-seafoam/60 text-lg leading-relaxed italic font-medium">{strategy.loan_advice}</p>
            </div>

            <div className="premium-card p-10 bg-white dark:bg-aura-deep border-aura-gold/30 shadow-2xl">
              <div className="w-16 h-16 bg-aura-gold rounded-2xl flex items-center justify-center text-aura-deep mb-6 shadow-lg">
                <Lightbulb size={32} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter text-aura-textL dark:text-white mb-4">Nota da Mentora</h4>
              <p className="text-slate-500 dark:text-aura-seafoam/50 text-base italic leading-snug">"{strategy.mentorship_note}"</p>
            </div>
          </div>
        </div>
      ) : !loading && (
        <div className="text-center py-20 opacity-50">
          <Info size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-xl font-black uppercase tracking-widest text-slate-400">Pronta para analisar seu futuro.</p>
        </div>
      )}

      {/* Seção de Perguntas e Ajuda */}
      <section className="space-y-8 pt-10">
        <div className="flex items-center gap-4 mb-8">
           <HelpCircle className="text-aura-gold" size={32} />
           <h2 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Orientação & FAQ</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { q: "Qual dívida pagar primeiro?", a: "Priorize sempre as de juros mais altos (como cartão e cheque especial) e as que possuem bens como garantia." },
             { q: "Quando é seguro pegar empréstimo?", a: "Somente quando os juros do empréstimo forem menores que os juros da dívida atual ou se for para um investimento com retorno garantido." },
             { q: "Como a Aura prioriza minhas contas?", a: "Analisamos o vencimento próximo aliado ao custo financeiro (juros/multas) de cada pendência." },
             { q: "Posso confiar 100% na IA?", a: "A Aura fornece orientações estratégicas baseadas em lógica matemática, mas a decisão final e a conferência com gerentes bancários é essencial." }
           ].map((faq, i) => (
             <div key={i} className="premium-card p-8 bg-white dark:bg-white/5 border-white/5 hover:border-aura-gold/20 transition-all">
                <h5 className="text-lg font-black text-aura-textL dark:text-white uppercase tracking-tight mb-3 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-aura-gold rounded-full"></div> {faq.q}
                </h5>
                <p className="text-slate-500 dark:text-aura-seafoam/40 text-sm font-medium italic leading-relaxed">{faq.a}</p>
             </div>
           ))}
        </div>
      </section>

      <div className="premium-card p-12 bg-aura-gold/5 border-2 border-aura-gold/30 flex flex-col md:flex-row items-center gap-10 shadow-xl">
        <div className="w-24 h-24 bg-aura-deep rounded-[2.5rem] flex items-center justify-center text-aura-gold shrink-0 shadow-2xl border-2 border-aura-gold/20">
           <ShieldCheck size={48} />
        </div>
        <div>
           <h4 className="text-2xl font-black text-aura-textL dark:text-white uppercase tracking-tighter mb-2">Compromisso Ético</h4>
           <p className="text-slate-600 dark:text-aura-seafoam/70 text-lg leading-relaxed italic font-medium">"A mentoria da Aura é uma ferramenta de suporte à decisão. Nosso objetivo é educar e organizar, promovendo uma relação consciente e saudável com seu patrimônio."</p>
        </div>
      </div>
    </div>
  );
};

export default AuraStrategy;
