
import React, { useState, useRef, useEffect } from 'react';
import { User, CheckCircle, Save, Crown, Globe, Shield, Camera, Upload, IdCard } from 'lucide-react';
import { useAuth } from '../App';
import { supabase } from '../supabase';
import { getDDI, getDocumentLabel } from '../translations';

const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    nickname: profile?.nickname || '',
    phone: profile?.phone || '',
    country: profile?.country || 'Brasil',
    language: profile?.language || 'pt',
    cpf: profile?.cpf || ''
  });

  useEffect(() => {
    // Quando o país muda, o telefone deve atualizar o DDI se estiver vazio ou com DDI antigo
    const ddi = getDDI(formData.country);
    if (!formData.phone || formData.phone.length < 5) {
      setFormData(prev => ({ ...prev, phone: ddi + ' ' }));
    }
  }, [formData.country]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile?.id);
    
    if (!error) {
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    setLoading(true);
    const path = `avatars/${profile.id}_${Date.now()}`;
    const { data } = await supabase.storage.from('receipts').upload(path, file);
    
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      await refreshProfile();
    }
    setLoading(false);
  };

  const countries = [
    'Brasil', 'EUA', 'Portugal', 'Spain', 'United Kingdom', 'Germany', 
    'France', 'Japan', 'China', 'Argentina', 'Chile', 'Uruguay', 'Mexico', 'Canada'
  ];
  
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.nickname || 'User'}&background=063A3A&color=E6B65C&size=256`;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*" />
      
      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row items-center gap-10 p-12 bg-aura-seafoam dark:bg-aura-deep/60 rounded-[4rem] border border-aura-teal/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-aura-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-[3rem] bg-white dark:bg-aura-deep flex items-center justify-center border-4 border-aura-gold shadow-2xl overflow-hidden shrink-0 transform group-hover:rotate-2 transition-all">
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="text-white" size={32} />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-aura-gold text-aura-deep p-3 rounded-2xl shadow-lg border-2 border-aura-deep">
            <Crown size={20} />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black text-aura-textL dark:text-white tracking-tighter leading-none mb-4 uppercase">{profile?.full_name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <span className="px-6 py-2 bg-aura-deep text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">
              {profile?.is_premium ? 'Membro Elite' : 'Standard'}
            </span>
            <span className="flex items-center gap-2 text-aura-teal dark:text-aura-seafoam/60 text-sm font-bold italic">
              <Shield size={16} /> Verificado em {formData.country}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleUpdate} className="lg:col-span-2 bg-white dark:bg-aura-deep/40 p-12 rounded-[3.5rem] border border-aura-teal/10 shadow-xl space-y-10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-4 text-aura-textL dark:text-white uppercase tracking-tighter">
              <User className="text-aura-gold" size={28} /> Dossiê de Identidade
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-aura-teal dark:text-aura-seafoam/40 uppercase tracking-[0.3em] ml-3">Nome Legal</label>
              <input required className="prof-input" value={formData.full_name} 
                onChange={e => setFormData({...formData, full_name: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-aura-teal dark:text-aura-seafoam/40 uppercase tracking-[0.3em] ml-3">Nome de Tratamento</label>
              <input required className="prof-input" value={formData.nickname} 
                onChange={e => setFormData({...formData, nickname: e.target.value})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-aura-teal dark:text-aura-seafoam/40 uppercase tracking-[0.3em] ml-3">Contato Móvel</label>
              <input className="prof-input" value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+55 00 00000-0000" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-aura-teal dark:text-aura-seafoam/40 uppercase tracking-[0.3em] ml-3">Nacionalidade / Base</label>
              <div className="relative">
                <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-aura-teal opacity-50" />
                <select className="prof-input pl-14" value={formData.country} 
                  onChange={e => setFormData({...formData, country: e.target.value})}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-aura-teal dark:text-aura-seafoam/40 uppercase tracking-[0.3em] ml-3">{getDocumentLabel(formData.country)}</label>
              <div className="relative">
                <IdCard size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-aura-teal opacity-50" />
                <input required className="prof-input pl-14" value={formData.cpf} 
                  onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="Número do documento oficial" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-aura-gold text-aura-deep hover:bg-aura-textL hover:text-white py-6 rounded-3xl font-black flex items-center justify-center gap-4 transition-all shadow-xl uppercase tracking-widest text-sm">
            {loading ? 'Salvando...' : (success ? <><CheckCircle size={24} /> Perfil Blindado</> : <><Save size={24} /> Confirmar Alterações</>)}
          </button>
        </form>

        <div className="bg-aura-deep p-12 rounded-[4rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-aura-gold/10 rounded-full blur-3xl"></div>
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-4 bg-aura-gold/20 rounded-3xl text-aura-gold">
                <Crown size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Benefícios Elite</h3>
            </div>
            <ul className="space-y-6 text-sm font-bold text-aura-seafoam/60 italic">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-aura-gold rounded-full mt-1.5"></div>
                Relatórios globais multi-moeda.
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-aura-gold rounded-full mt-1.5"></div>
                Inteligência preditiva de caixa.
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 bg-aura-gold rounded-full mt-1.5"></div>
                Suporte humano prioritário.
              </li>
            </ul>
          </div>
          <button className="mt-16 w-full bg-white text-aura-deep py-6 rounded-3xl font-black hover:bg-aura-gold transition-all shadow-xl uppercase tracking-widest text-[10px]">
            Verificar Plano
          </button>
        </div>
      </div>

      <style>{`
        .prof-input {
          width: 100%;
          background-color: rgba(6, 58, 58, 0.05);
          border: 1px solid rgba(46, 174, 158, 0.15);
          border-radius: 1.5rem;
          padding: 1.25rem 1.5rem;
          font-size: 0.95rem;
          color: inherit;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dark .prof-input {
          background-color: rgba(255, 255, 255, 0.03);
          border-color: rgba(217, 243, 239, 0.1);
          color: white;
        }
        .prof-input:focus {
          border-color: #E6B65C;
          outline: none;
          box-shadow: 0 0 0 4px rgba(230, 182, 92, 0.1);
          background-color: white;
        }
        .dark .prof-input:focus {
          background-color: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
