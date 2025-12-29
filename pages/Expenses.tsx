
import React, { useState, useEffect } from 'react';
import { Plus, Filter, ArrowUpRight, ArrowDownRight, MoreVertical, Trash2, Edit2, Calendar, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Calculator, Sigma, X } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { Transaction, ExpenseType } from '../types';
import { formatCurrency } from '../translations';

const Expenses: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<ExpenseType>('fixed');
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Geral',
    sub_type: 'fixed' as ExpenseType,
    status: 'pending' as 'paid' | 'pending',
    payment_method: 'Dinheiro'
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'expense');
    if (data) setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const filteredExpenses = expenses.filter(e => {
    const eDate = new Date(e.date);
    const matchesMonth = eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
    
    if (activeTab === 'fixed') {
      return e.sub_type === 'fixed' && matchesMonth;
    } else {
      return (e.sub_type === 'variable' || e.payment_method === 'Cartão') && matchesMonth;
    }
  });

  const allMonthlyExpenses = expenses.filter(e => {
    const eDate = new Date(e.date);
    return eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
  });

  const stats = {
    totalCombined: allMonthlyExpenses.reduce((acc, e) => acc + e.amount, 0),
    fixedTotal: allMonthlyExpenses.filter(e => e.sub_type === 'fixed').reduce((acc, e) => acc + e.amount, 0),
    variableTotal: allMonthlyExpenses.filter(e => e.sub_type === 'variable' || e.payment_method === 'Cartão').reduce((acc, e) => acc + e.amount, 0),
    tabPaid: filteredExpenses.filter(e => e.status === 'paid').reduce((acc, e) => acc + e.amount, 0),
    tabPending: filteredExpenses.filter(e => e.status === 'pending').reduce((acc, e) => acc + e.amount, 0),
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      type: 'expense',
      user_id: user.id
    };
    await supabase.from('transactions').insert(newTransaction);
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta despesa?')) {
      await supabase.from('transactions').delete().eq('id', id);
      fetchData();
    }
  };

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Planejamento de Saídas</h1>
          <p className="text-slate-500 dark:text-aura-seafoam/50 text-base italic">Visualize e projete seu custo de vida mês a mês.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-aura-gold text-aura-deep px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-aura-textL hover:text-white transition-all text-xs uppercase tracking-widest"
        >
          <Plus size={22} /> Novo Lançamento
        </button>
      </div>

      <div className="premium-card p-6 bg-white dark:bg-aura-deep flex items-center justify-between border-aura-gold/20 shadow-lg">
        <button onClick={handlePrevMonth} className="p-3 hover:bg-aura-gold/10 rounded-xl text-aura-gold transition-all"><ChevronLeft size={24}/></button>
        <div className="text-center">
          <p className="text-2xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">{meses[currentMonth]}</p>
          <p className="text-[12px] font-black text-aura-gold tracking-[0.4em]">{currentYear}</p>
        </div>
        <button onClick={handleNextMonth} className="p-3 hover:bg-aura-gold/10 rounded-xl text-aura-gold transition-all"><ChevronRight size={24}/></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="premium-card bg-white p-10 shadow-2xl border-slate-100 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-aura-gold/20"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Projetado</p>
          <p className="text-3xl font-black text-aura-deep tracking-tighter">{formatCurrency(stats.totalCombined, profile?.country)}</p>
          <div className="mt-4 flex items-center gap-2 text-aura-gold">
            <Sigma size={16}/> <span className="text-[10px] font-bold uppercase tracking-widest">Soma Integral</span>
          </div>
        </div>

        <div className={`premium-card p-10 shadow-2xl border-aura-teal/30 group transition-all duration-500 ${activeTab === 'fixed' ? 'bg-aura-teal/5 ring-2 ring-aura-teal/40 gold-glow' : 'bg-white'}`}>
          <p className="text-aura-teal text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <CheckCircle size={18}/> Custos Fixos
          </p>
          <p className="text-3xl font-black text-aura-deep tracking-tighter">{formatCurrency(stats.fixedTotal, profile?.country)}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Compromissos Recorrentes</p>
        </div>

        <div className={`premium-card p-10 shadow-2xl border-aura-gold/30 group transition-all duration-500 ${activeTab === 'variable' ? 'bg-aura-gold/5 ring-2 ring-aura-gold/40 gold-glow scale-[1.02]' : 'bg-white'}`}>
          <p className="text-aura-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <AlertCircle size={18}/> Total Variável
          </p>
          <p className="text-3xl font-black text-aura-deep tracking-tighter">{formatCurrency(stats.variableTotal, profile?.country)}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Gastos do Ciclo</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex bg-white dark:bg-aura-deep p-2 rounded-[2.5rem] w-full sm:w-fit border border-slate-200 dark:border-white/5 shadow-xl">
          <button 
            onClick={() => setActiveTab('fixed')}
            className={`flex-1 sm:flex-none px-12 py-4 rounded-[2.2rem] text-[11px] font-black tracking-widest uppercase transition-all ${activeTab === 'fixed' ? 'bg-aura-gold text-aura-deep shadow-lg' : 'text-slate-400 hover:text-aura-textL dark:hover:text-white'}`}
          >
            Compromissos Fixos
          </button>
          <button 
            onClick={() => setActiveTab('variable')}
            className={`flex-1 sm:flex-none px-12 py-4 rounded-[2.2rem] text-[11px] font-black tracking-widest uppercase transition-all ${activeTab === 'variable' ? 'bg-aura-gold text-aura-deep shadow-lg' : 'text-slate-400 hover:text-aura-textL dark:hover:text-white'}`}
          >
            Variáveis & Cartões
          </button>
        </div>

        <div className="bg-aura-deep text-white px-10 py-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-aura-gold/20 animate-in slide-in-from-top-4">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-aura-gold">
                 <Sigma size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Fluxo da Aba: {activeTab === 'fixed' ? 'Fixos' : 'Variáveis'}</p>
                 <p className="text-xl font-black uppercase tracking-tighter">{formatCurrency(stats.tabPaid + stats.tabPending, profile?.country)}</p>
              </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center sm:text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-aura-emerald mb-1 flex items-center gap-2 justify-center sm:justify-end">
                    <CheckCircle size={10} /> Liquidado
                 </p>
                 <p className="text-lg font-black text-white">{formatCurrency(stats.tabPaid, profile?.country)}</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10 hidden sm:block"></div>
              <div className="text-center sm:text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1 flex items-center gap-2 justify-center sm:justify-end">
                    <AlertCircle size={10} /> Falta Pagar
                 </p>
                 <p className="text-lg font-black text-white">{formatCurrency(stats.tabPending, profile?.country)}</p>
              </div>
           </div>
        </div>

        <div className="premium-card bg-white dark:bg-aura-deep overflow-hidden shadow-2xl border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-aura-bgDark/50 text-slate-500 dark:text-aura-seafoam/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  <th className="px-12 py-8">Dia</th>
                  <th className="px-12 py-8">Descrição</th>
                  <th className="px-12 py-8">Categoria</th>
                  <th className="px-12 py-8">Valor</th>
                  <th className="px-12 py-8">Status</th>
                  <th className="px-12 py-8 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-aura-gold/5 transition-colors group">
                    <td className="px-12 py-8 text-[12px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(expense.date).getDate()}
                    </td>
                    <td className="px-12 py-8">
                      <p className="text-base font-black text-aura-textL dark:text-white group-hover:text-aura-gold transition-colors">{expense.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">{expense.payment_method}</p>
                    </td>
                    <td className="px-12 py-8">
                      <span className="px-5 py-2 bg-aura-teal/10 border border-aura-teal/20 rounded-full text-[10px] font-black text-aura-teal uppercase tracking-widest">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-12 py-8 text-base font-black text-aura-textL dark:text-white">
                      {formatCurrency(expense.amount, profile?.country)}
                    </td>
                    <td className="px-12 py-8">
                      <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border ${expense.status === 'paid' ? 'bg-aura-emerald/10 text-aura-emerald border-aura-emerald/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                        {expense.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                      </span>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-aura-gold rounded-2xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(expense.id)} className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-aura-bgDark/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white dark:bg-aura-deep w-full max-w-2xl rounded-[4rem] p-10 md:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-aura-gold/20 overflow-y-auto max-h-[95vh] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button X */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 p-2 text-slate-400 hover:text-aura-gold transition-all"
            >
              <X size={28} />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter leading-none mb-2">Novo Compromisso</h2>
              <p className="text-[10px] font-black text-aura-gold uppercase tracking-[0.4em] italic">Gestão de Custos AuraFin</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="space-y-3">
                <label className="exp-label">Identificação do Compromisso</label>
                <input required type="text" className="exp-input"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Aluguel Central, Internet Fibra..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div className="space-y-3">
                  <label className="exp-label">Montante Financeiro</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-aura-gold uppercase">R$</span>
                    <input required type="number" step="0.01" className="exp-input pl-14"
                      value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0,00" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="exp-label">Data de Vencimento</label>
                  <input required type="date" className="exp-input"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div className="space-y-3">
                  <label className="exp-label">Natureza da Despesa</label>
                  <select className="exp-input cursor-pointer" value={formData.sub_type} onChange={e => setFormData({...formData, sub_type: e.target.value as ExpenseType})} >
                    <option value="fixed">Gasto Fixo Recorrente</option>
                    <option value="variable">Gasto Variável do Ciclo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="exp-label">Estado Atual</label>
                  <select className="exp-input cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="pending">Aguardando Pagamento</option>
                    <option value="paid">Confirmado / Liquidado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-12">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-6 text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] hover:text-aura-textL dark:hover:text-white transition-all"
                >
                  Descartar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-aura-gold text-aura-deep py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_20px_50px_rgba(230,182,92,0.2)] hover:bg-aura-textL hover:text-white transition-all transform active:scale-95"
                >
                  Confirmar Compromisso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .exp-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #2FAE9E;
          margin-left: 1rem;
        }
        .dark .exp-label {
          color: rgba(217, 243, 239, 0.5);
        }
        .exp-input {
          width: 100%;
          background-color: #F8FBFA;
          border: 1px solid rgba(46, 174, 158, 0.2);
          border-radius: 1.75rem;
          padding: 1.35rem 1.75rem;
          font-size: 0.9rem;
          color: #1F2D2D;
          font-weight: 700;
          outline: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dark .exp-input {
          background-color: #032525;
          border-color: rgba(230, 182, 92, 0.15);
          color: white;
        }
        .exp-input:focus {
          border-color: #E6B65C;
          box-shadow: 0 0 0 5px rgba(230, 182, 92, 0.1);
          background-color: white;
        }
        .dark .exp-input:focus {
          background-color: #043131;
        }
      `}</style>
    </div>
  );
};

export default Expenses;
