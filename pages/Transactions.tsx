
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit2, ArrowUpRight, ArrowDownRight, X, Printer, CheckCircle, Clock, Calendar } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { Transaction, TransactionType, ExpenseType, IncomeCategory } from '../types';
import { formatCurrency } from '../translations';

const Transactions: React.FC = () => {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    sub_type: 'variable' as ExpenseType,
    income_category: 'salary' as IncomeCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Geral',
    status: 'paid' as any,
    payment_method: 'Dinheiro'
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      user_id: user.id
    };
    
    if (editingId) {
      await supabase.from('transactions').update(payload).eq('id', editingId);
    } else {
      await supabase.from('transactions').insert(payload);
    }
    
    setShowModal(false);
    setEditingId(null);
    fetchData();
    setFormData({
      type: 'expense', sub_type: 'variable', income_category: 'salary',
      description: '', amount: '', date: new Date().toISOString().split('T')[0],
      category: 'Geral', status: 'paid', payment_method: 'Dinheiro'
    });
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({
      type: t.type,
      sub_type: t.sub_type || 'variable',
      income_category: t.income_category || 'salary',
      description: t.description,
      amount: t.amount.toString(),
      date: t.date,
      category: t.category,
      status: t.status,
      payment_method: t.payment_method
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este registro permanentemente?')) {
      await supabase.from('transactions').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesPayment = filterPayment === 'all' || t.payment_method === filterPayment;
    const matchesDate = filterDate === '' || t.date === filterDate;
    return matchesSearch && matchesType && matchesCategory && matchesPayment && matchesDate;
  });

  const categories = formData.type === 'income' 
    ? ['Salário', 'Freelancer', 'Investimento', 'Venda', 'Presente', 'Outros']
    : ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Tecnologia', 'Outros'];

  const allKnownCategories = Array.from(new Set(transactions.map(t => t.category))).sort();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Fluxo de Transações</h1>
          <p className="text-slate-500 dark:text-aura-seafoam/50 text-base italic">Registro integral da sua atividade patrimonial.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-white dark:bg-aura-deep border border-slate-200 dark:border-aura-gold/10 px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-sm"
          >
            <Printer size={18} /> Exportar
          </button>
          <button 
            onClick={() => { setEditingId(null); setShowModal(true); }}
            className="bg-aura-gold text-aura-deep px-6 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-aura-textL hover:text-white transition-all text-xs uppercase tracking-widest"
          >
            <Plus size={18} /> Novo Registro
          </button>
        </div>
      </div>

      <div className="premium-card p-6 flex flex-col gap-6 bg-white/50 dark:bg-aura-deep/20 backdrop-blur-sm shadow-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Filtrar por descrição..." 
            className="w-full bg-white dark:bg-aura-bgDark border-none rounded-[1.25rem] pl-14 pr-6 py-4 text-sm font-medium focus:ring-2 ring-aura-gold shadow-inner"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select 
            className="filter-select"
            value={filterType} onChange={e => setFilterType(e.target.value)}
          >
            <option value="all">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          <select 
            className="filter-select"
            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas Categorias</option>
            {allKnownCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="filter-select"
            value={filterPayment} onChange={e => setFilterPayment(e.target.value)}
          >
            <option value="all">Meios de Pagamento</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
            <option value="Pix">Pix</option>
            <option value="Boleto">Boleto</option>
          </select>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="date" 
              className="filter-select pl-12"
              value={filterDate} onChange={e => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="premium-card overflow-hidden bg-white dark:bg-aura-deep/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-aura-bgDark/50 text-slate-500 dark:text-aura-seafoam/30 text-[9px] font-black uppercase tracking-[0.3em]">
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6">Descrição</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6 text-right">Valor</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-aura-gold/5">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-aura-gold/5 transition-all group">
                  <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-aura-textL dark:text-white group-hover:text-aura-gold transition-colors">{t.description}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t.payment_method}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-aura-teal/10 text-aura-teal px-3 py-1 rounded-lg border border-aura-teal/10">
                      {t.category || 'Geral'}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-right text-sm font-black ${t.type === 'income' ? 'text-aura-emerald' : 'text-aura-textL dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, profile?.country)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 w-fit ${t.status === 'paid' ? 'bg-aura-emerald/10 text-aura-emerald' : 'bg-amber-500/10 text-amber-500'}`}>
                      {t.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {t.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(t)} className="p-2 text-aura-teal hover:bg-aura-teal/10 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-bgDark/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => { setShowModal(false); setEditingId(null); }}
        >
          <div 
            className="bg-white dark:bg-aura-deep w-full max-w-2xl rounded-[4rem] p-10 md:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-aura-gold/20 overflow-y-auto max-h-[95vh] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Botão de Fechar X */}
            <button 
              onClick={() => { setShowModal(false); setEditingId(null); }}
              className="absolute top-10 right-10 p-2 text-slate-400 hover:text-aura-gold transition-all hover:rotate-90 duration-300"
            >
              <X size={28} />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-aura-textL dark:text-white uppercase tracking-tighter leading-none mb-3">
                {editingId ? 'Refinar Registro' : 'Novo Lançamento'}
              </h2>
              <p className="text-[11px] font-black text-aura-gold uppercase tracking-[0.4em] italic">Inteligência Financeira AuraFin</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Type Switcher - Suave e Elegante */}
              <div className="flex bg-slate-50 dark:bg-aura-bgDark/50 p-2 rounded-[2rem] border border-slate-200 dark:border-white/5">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'expense'})} 
                  className={`flex-1 py-4 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${formData.type === 'expense' ? 'bg-aura-deep dark:bg-aura-gold text-white dark:text-aura-deep shadow-xl' : 'text-slate-400 hover:text-aura-textL dark:hover:text-white'}`}
                >
                  Gasto / Despesa
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'income'})} 
                  className={`flex-1 py-4 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${formData.type === 'income' ? 'bg-aura-teal text-white shadow-xl' : 'text-slate-400 hover:text-aura-textL dark:hover:text-white'}`}
                >
                  Entrada / Receita
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="md:col-span-2 space-y-3">
                  <label className="trans-label">Descrição da Atividade</label>
                  <input required className="trans-input" placeholder="O que esta transação representa?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                <div className="space-y-3">
                  <label className="trans-label">Montante Financeiro</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[11px] font-black text-aura-gold uppercase">R$</span>
                    <input required type="number" step="0.01" className="trans-input pl-14" placeholder="0,00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="trans-label">Data de Registro</label>
                  <input required type="date" className="trans-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div className="space-y-3">
                  <label className="trans-label">Categoria de Fluxo</label>
                  <select className="trans-input cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="trans-label">Natureza do Custo</label>
                  <select className="trans-input cursor-pointer" value={formData.sub_type} onChange={e => setFormData({...formData, sub_type: e.target.value as any})}>
                    <option value="fixed">Gasto Fixo</option>
                    <option value="variable">Gasto Variável</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="trans-label">Canal de Transação</label>
                  <select className="trans-input cursor-pointer" value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})}>
                    <option value="Dinheiro">Dinheiro vivo</option>
                    <option value="Cartão">Cartão de Crédito</option>
                    <option value="Pix">Transferência Pix</option>
                    <option value="Boleto">Boleto bancário</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="trans-label">Status da Operação</label>
                  <select className="trans-input cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="paid">Confirmado / Liquidado</option>
                    <option value="pending">Em Aberto / Agendado</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-12">
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); setEditingId(null); }} 
                  className="flex-1 py-6 text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] hover:text-aura-textL dark:hover:text-white transition-all"
                >
                  Descartar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-aura-gold text-aura-deep py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_20px_50px_rgba(230,182,92,0.2)] hover:bg-aura-textL hover:text-white transition-all transform active:scale-95"
                >
                  {editingId ? 'Salvar Alteração' : 'Efetivar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .trans-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #2FAE9E;
          margin-left: 1rem;
        }
        .dark .trans-label {
          color: rgba(217, 243, 239, 0.5);
        }
        .trans-input {
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
        .dark .trans-input {
          background-color: #032525;
          border-color: rgba(230, 182, 92, 0.15);
          color: white;
        }
        .trans-input:focus {
          border-color: #E6B65C;
          box-shadow: 0 0 0 5px rgba(230, 182, 92, 0.1);
          background-color: white;
        }
        .dark .trans-input:focus {
          background-color: #043131;
        }
        .filter-select {
          width: 100%;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 1rem;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          outline: none;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.04);
        }
        .dark .filter-select {
          background-color: #063A3A;
          border: none;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Transactions;
