
import React, { useState } from 'react';
import { Moon, Sun, Globe, Trash2, AlertTriangle, ShieldCheck, ChevronRight, Languages } from 'lucide-react';
import { useAuth } from '../App';
import { supabase } from '../supabase';
import { getTranslation } from '../translations';

const Settings: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const lang = profile?.language || 'pt';

  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    if (newDarkState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  };

  const handleLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    await supabase.from('profiles').update({ language: newLang }).eq('id', user.id);
    await refreshProfile();
  };

  const handleResetData = async () => {
    if (confirm('Atenção! Esta ação é definitiva. Deseja prosseguir?')) {
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('cards').delete().eq('user_id', user.id);
      await supabase.from('receipts').delete().eq('user_id', user.id);
      alert('Dados resetados.');
    }
  };

  const handleDeleteAccount = async () => {
    await handleResetData();
    await supabase.from('profiles').delete().eq('id', user.id);
    signOut();
  };

  const SettingRow = ({ icon: Icon, title, desc, action }: any) => (
    <div className="p-10 flex items-center justify-between hover:bg-white/5 transition-all cursor-default group border-b border-white/5 last:border-0">
      <div className="flex items-center gap-8">
        <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-aura-gold shadow-sm group-hover:bg-aura-gold group-hover:text-aura-deep transition-all duration-300">
          <Icon size={24} />
        </div>
        <div>
          <p className="font-black text-aura-textL dark:text-aura-textD uppercase tracking-widest text-[11px] mb-1">{title}</p>
          <p className="text-sm text-slate-500 dark:text-aura-seafoam/40 font-medium italic">{desc}</p>
        </div>
      </div>
      <div className="flex items-center">
        {action}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <div>
        <h1 className="text-4xl font-black text-aura-textL dark:text-white tracking-tighter uppercase">{getTranslation('settings', lang)}</h1>
        <p className="text-slate-500 dark:text-aura-seafoam/50 text-lg font-medium mt-2">Personalize sua interface de abundância.</p>
      </div>

      <div className="space-y-10">
        <div className="premium-card overflow-hidden">
          <div className="px-12 py-8 bg-aura-gold/5 border-b border-white/5">
            <h3 className="font-black text-aura-gold text-[10px] uppercase tracking-[0.4em]">{getTranslation('appearance', lang)}</h3>
          </div>
          <div>
            <SettingRow 
              icon={isDark ? Moon : Sun} 
              title="Modo Visual" 
              desc={isDark ? "Foco noturno ativado" : "Máxima claridade ativada"} 
              action={
                <button 
                  onClick={toggleDarkMode}
                  className={`w-16 h-8 rounded-full transition-all relative border-2 ${isDark ? 'bg-aura-gold border-aura-gold' : 'bg-slate-200 border-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${isDark ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>
              } 
            />
            
            <SettingRow 
              icon={Languages} 
              title={getTranslation('language', lang)} 
              desc="Defina seu idioma global" 
              action={
                <select value={lang} onChange={handleLangChange} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-xs font-black text-aura-gold focus:ring-2 ring-aura-gold uppercase tracking-widest outline-none">
                  <option value="pt" className="text-black">Português</option>
                  <option value="en" className="text-black">English</option>
                  <option value="es" className="text-black">Español</option>
                </select>
              } 
            />
          </div>
        </div>

        <div className="premium-card overflow-hidden border-rose-500/10">
          <div className="px-12 py-8 bg-rose-500/5 border-b border-white/5">
            <h3 className="font-black text-rose-500/70 text-[10px] uppercase tracking-[0.4em]">Controle de Dados</h3>
          </div>
          <div>
            <button onClick={handleResetData} className="w-full text-left">
              <SettingRow 
                icon={AlertTriangle} 
                title="Resetar Fluxo" 
                desc="Apagar todas as transações, cartões e recibos" 
                action={<ChevronRight className="text-slate-300" />} 
              />
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="w-full text-left">
              <SettingRow 
                icon={Trash2} 
                title="Remover Identidade" 
                desc="Excluir conta permanentemente" 
                action={<ChevronRight className="text-rose-400" />} 
              />
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-aura-bgDark/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="premium-card w-full max-w-lg p-12 text-center border-rose-500/30">
             <div className="w-24 h-24 bg-rose-500/10 mx-auto rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-10">
                <ShieldCheck size={48} />
             </div>
             <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Encerrar Jornada?</h2>
             <p className="text-aura-seafoam/40 text-lg font-medium mb-12 italic">Todos os seus registros de abundância serão apagados.</p>
             <div className="flex flex-col gap-5">
                <button onClick={handleDeleteAccount} className="w-full bg-rose-600 text-white py-6 rounded-2xl font-black text-sm shadow-xl hover:bg-rose-700 transition-all uppercase tracking-[0.2em]">Excluir Conta</button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 text-slate-400 font-black text-sm uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
