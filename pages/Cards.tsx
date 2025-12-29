
import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Calendar, Shield, Trash2, ArrowRight, Receipt, ChevronDown, ChevronUp, Edit3, CheckCircle, Clock, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { Card, Transaction } from '../types';
import { formatCurrency } from '../translations';

const Cards: React.FC = () => {
  const { user, profile } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [cardTransactions, setCardTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [viewingCard, setViewingCard] = useState<Card | null>(null);
  
  const [viewDate, setViewDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '', institution: '', last_digits: '', total_limit: '',
    due_day: '10', closing_day: '3', color: '#063A3A'
  });

  const [purchaseData, setPurchaseData] = useState({
    description: '', amount: '', date: new Date().toISOString().split('T')[0],
    installments: '1', category: 'Geral'
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: cardsData } = await supabase.from('cards').select('*').eq('user_id', user.id);
    const { data: transactionsData } = await supabase.from('transactions').select('*').eq('user_id', user.id).eq('payment_method', 'Cartão');
    if (cardsData) {
      setCards(cardsData);
      if (cardsData.length > 0 && !viewingCard) setViewingCard(cardsData[0]);
    }
    if (transactionsData) setCardTransactions(transactionsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      total_limit: parseFloat(formData.total_limit),
      due_day: parseInt(formData.due_day),
      closing_day: parseInt(formData.closing_day),
      user_id: user.id
    };
    
    if (selectedCardId) {
      await supabase.from('cards').update(payload).eq('id', selectedCardId);
    } else {
      await supabase.from('cards').insert(payload);
    }
    
    setShowModal(false);
    setSelectedCardId(null);
    fetchData();
  };

  const handleEditCard = (card: Card) => {
    setSelectedCardId(card.id);
    setFormData({
      name: card.name,
      institution: card.institution,
      last_digits: card.last_digits,
      total_limit: card.total_limit.toString(),
      due_day: card.due_day.toString(),
      closing_day: card.closing_day.toString(),
      color: card.color || '#063A3A'
    });
    setShowModal(true);
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingCard) return;

    const totalAmount = parseFloat(purchaseData.amount);
    const installments = parseInt(purchaseData.installments);
    const installmentAmount = totalAmount / installments;

    for (let i = 0; i < installments; i++) {
      const pDate = new Date(purchaseData.date);
      pDate.setMonth(pDate.getMonth() + i);
      
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'expense',
        sub_type: 'variable',
        description: installments > 1 ? `${purchaseData.description} (${i+1}/${installments})` : purchaseData.description,
        amount: installmentAmount,
        date: pDate.toISOString().split('T')[0],
        category: purchaseData.category,
        status: 'pending',
        payment_method: 'Cartão',
        card_id: viewingCard.id
      });
    }

    setShowPurchaseModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este cartão e todo seu histórico?')) {
      await supabase.from('cards').delete().eq('id', id);
      setViewingCard(null);
      fetchData();
    }
  };

  const changeMonth = (offset: number) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + offset);
    setViewDate(d);
  };

  const filteredInvoiceTransactions = cardTransactions.filter(t => {
    if (!viewingCard) return false;
    const tDate = new Date(t.date);
    return t.card_id === viewingCard.id && 
           tDate.getMonth() === viewDate.getMonth() && 
           tDate.getFullYear() === viewDate.getFullYear();
  });

  const invoiceTotal = filteredInvoiceTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  const totalBlocked = cardTransactions
    .filter(t => t.card_id === (viewingCard?.id || ''))
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Bóveda de Crédito</h1>
          <p className="text-slate-500 dark:text-aura-seafoam/50 text-base italic">Gerencie limites e faturas com precisão absoluta.</p>
        </div>
        <button 
          onClick={() => { setSelectedCardId(null); setFormData({name:'', institution:'', last_digits:'', total_limit:'', due_day:'10', closing_day:'3', color:'#063A3A'}); setShowModal(true); }}
          className="bg-aura-gold text-aura-deep px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-aura-textL hover:text-white transition-all text-xs uppercase tracking-widest"
        >
          <Plus size={20} /> Novo Cartão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-aura-gold px-2">Suas Unidades</h3>
          {cards.map(card => (
            <div 
              key={card.id} 
              onClick={() => setViewingCard(card)}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 ${viewingCard?.id === card.id ? 'border-aura-gold scale-[1.02] shadow-2xl' : 'border-transparent shadow-lg'}`}
              style={{ backgroundColor: card.color || '#063A3A' }}
            >
              <div className="p-8 text-white min-h-[240px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">{card.institution}</p>
                    <h4 className="text-xl font-black tracking-tight mt-1">{card.name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleEditCard(card); }} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Edit3 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }} className="p-2 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 my-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <Calendar size={12} className="text-aura-gold" /> Vencimento: Dia {card.due_day}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <Lock size={12} className="text-aura-gold" /> Fechamento: Dia {card.closing_day}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                   <p className="text-lg font-black tracking-[0.4em]">•••• {card.last_digits}</p>
                   <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-aura-teal/40 backdrop-blur-sm"></div>
                      <div className="w-10 h-10 rounded-full bg-aura-gold/40 backdrop-blur-sm"></div>
                   </div>
                </div>
              </div>
              {viewingCard?.id !== card.id && <div className="absolute inset-0 bg-black/20"></div>}
            </div>
          ))}
        </div>

        <div className="lg:col-span-7">
          {viewingCard ? (
            <div className="premium-card bg-white dark:bg-aura-deep/40 h-full flex flex-col shadow-2xl overflow-hidden border-aura-gold/20">
              <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-aura-bgDark/20">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Status da Fatura</h3>
                      <p className="text-xs font-bold text-slate-400 dark:text-aura-seafoam/40 mt-1">Limite Disponível: <span className="text-aura-emerald">{formatCurrency(viewingCard.total_limit - totalBlocked, profile?.country)}</span></p>
                    </div>
                    <button onClick={() => setShowPurchaseModal(true)} className="bg-aura-deep dark:bg-aura-gold text-white dark:text-aura-deep px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Lançar Compra</button>
                 </div>

                 <div className="flex items-center justify-center gap-8 mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-aura-gold hover:bg-aura-gold/10 rounded-full transition-all"><ChevronLeft /></button>
                    <div className="text-center w-40">
                       <p className="text-sm font-black text-aura-textL dark:text-white uppercase tracking-widest">
                          {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                       </p>
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 text-aura-gold hover:bg-aura-gold/10 rounded-full transition-all"><ChevronRight /></button>
                 </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto space-y-8">
                <div className="flex justify-between items-center bg-aura-gold/5 p-6 rounded-3xl border border-aura-gold/10">
                   <div>
                      <p className="text-[10px] font-black text-aura-gold uppercase tracking-widest mb-1">Total da Fatura</p>
                      <p className="text-3xl font-black text-aura-textL dark:text-white">{formatCurrency(invoiceTotal, profile?.country)}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button className="bg-aura-gold text-aura-deep px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-aura-textL hover:text-white transition-all">Pagar Total</button>
                      <button className="text-aura-gold text-[10px] font-black uppercase tracking-widest hover:underline">Pagamento Parcial</button>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Detalhamento de Gastos</h4>
                   {filteredInvoiceTransactions.length > 0 ? (
                     <div className="space-y-4">
                        {filteredInvoiceTransactions.map(t => (
                          <div key={t.id} className="flex justify-between items-center group p-2 hover:bg-white/5 rounded-2xl transition-all">
                             <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-100 dark:bg-aura-bgDark rounded-xl text-slate-400 group-hover:text-aura-gold transition-colors">
                                   <Clock size={16} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-aura-textL dark:text-white uppercase truncate w-32 md:w-auto">{t.description}</p>
                                   <p className="text-[10px] text-slate-400 font-bold">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <p className="text-sm font-black text-aura-textL dark:text-white">{formatCurrency(t.amount, profile?.country)}</p>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="text-center py-20">
                        <Receipt size={48} className="mx-auto text-slate-200 dark:text-white/5 mb-4" />
                        <p className="text-slate-400 italic font-medium">Nenhuma compra faturada para este período.</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card p-20 flex flex-col items-center justify-center text-center text-slate-400 h-full border-dashed border-2">
              <CreditCard size={64} className="mb-6 opacity-20" />
              <p className="text-xl font-black uppercase tracking-tighter">Selecione um cartão para ver a fatura.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-bgDark/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-aura-deep w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-aura-gold/10">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase text-white">{selectedCardId ? 'Redefinir Unidade' : 'Nova Unidade'}</h2>
            <form onSubmit={handleSaveCard} className="space-y-5">
              <input required type="text" placeholder="Nome do Cartão" className="card-input"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="text" placeholder="Banco Emissor" className="card-input"
                value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
              <div className="grid grid-cols-2 gap-5">
                <input required type="text" maxLength={4} placeholder="Finais (4 dígitos)" className="card-input"
                  value={formData.last_digits} onChange={e => setFormData({...formData, last_digits: e.target.value})} />
                <input required type="number" placeholder="Limite Total" className="card-input"
                  value={formData.total_limit} onChange={e => setFormData({...formData, total_limit: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Dia Vencimento</label>
                  <input required type="number" min={1} max={31} className="card-input mt-1.5"
                    value={formData.due_day} onChange={e => setFormData({...formData, due_day: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Dia Fechamento</label>
                  <input required type="number" min={1} max={31} className="card-input mt-1.5"
                    value={formData.closing_day} onChange={e => setFormData({...formData, closing_day: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Cor do Cartão</label>
                <input type="color" className="w-full h-14 rounded-2xl mt-1.5 cursor-pointer bg-transparent border-none"
                  value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-slate-400 font-black uppercase text-xs tracking-widest">Cancelar</button>
                 <button type="submit" className="flex-1 bg-aura-gold text-aura-deep py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aura-bgDark/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-aura-deep w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl border border-aura-gold/10">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase text-white">Nova Compra</h2>
            <form onSubmit={handleAddPurchase} className="space-y-5">
              <input required type="text" placeholder="O que você comprou?" className="card-input"
                value={purchaseData.description} onChange={e => setPurchaseData({...purchaseData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-5">
                <input required type="number" step="0.01" placeholder="Valor Total" className="card-input"
                  value={purchaseData.amount} onChange={e => setPurchaseData({...purchaseData, amount: e.target.value})} />
                <input required type="number" min={1} max={48} placeholder="Parcelas" className="card-input"
                  value={purchaseData.installments} onChange={e => setPurchaseData({...purchaseData, installments: e.target.value})} />
              </div>
              <input required type="date" className="card-input"
                value={purchaseData.date} onChange={e => setPurchaseData({...purchaseData, date: e.target.value})} />
              
              <div className="flex gap-4 pt-8">
                 <button type="button" onClick={() => setShowPurchaseModal(false)} className="flex-1 py-5 text-slate-400 font-black uppercase text-xs tracking-widest">Cancelar</button>
                 <button type="submit" className="flex-1 bg-aura-gold text-aura-deep py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Lançar na Fatura</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .card-input {
          width: 100%;
          background-color: rgba(247, 250, 249, 1);
          border: 1px solid rgba(46, 174, 158, 0.1);
          border-radius: 1.25rem;
          padding: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          outline: none;
          transition: all 0.2s;
        }
        .dark .card-input {
          background-color: #021F1F;
          border-color: rgba(230, 182, 92, 0.1);
          color: white;
        }
        .card-input:focus {
          border-color: #E6B65C;
          box-shadow: 0 0 0 4px rgba(230, 182, 92, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Cards;
