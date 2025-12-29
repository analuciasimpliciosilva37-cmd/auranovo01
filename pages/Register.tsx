
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';

interface RegisterProps {
  onRegister: (user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    nickname: '',
    cpf: '',
    phone: '',
    country: 'Brasil',
    language: 'pt',
    recovery_phrase: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Falha ao criar usuário.');

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: formData.email,
        full_name: formData.full_name,
        nickname: formData.nickname,
        cpf: formData.cpf,
        phone: formData.phone,
        country: formData.country,
        language: formData.language,
        recovery_phrase: formData.recovery_phrase,
        is_premium: false
      });

      if (profileError) throw profileError;

      onRegister(data.user);
      navigate('/welcome');
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurafin-deep flex flex-col items-center justify-center p-6 py-12">
      <Link to="/" className="flex items-center gap-3 mb-12 group">
        <div className="flex items-end gap-1.5 h-8">
          <div className="w-1.5 h-4 bg-teal-900/50 rounded-full"></div>
          <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"></div>
        </div>
        <span className="text-2xl font-black text-white tracking-tighter">AURAFIN</span>
      </Link>

      <div className="w-full max-w-2xl bg-teal-950/40 p-12 rounded-[3.5rem] border border-teal-800/30 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-3">Nova Jornada</h1>
          <p className="text-teal-100/40 text-sm italic">"Inteligência financeira que você sente."</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold mb-8 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">Nome Completo</label>
            <input required type="text" className="reg-input" placeholder="Seu nome" 
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">Nickname</label>
            <input required type="text" className="reg-input" placeholder="Apelido" 
              value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">E-mail</label>
            <input required type="email" className="reg-input" placeholder="email@exemplo.com" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">Senha</label>
            <input required type="password" className="reg-input" placeholder="********" 
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">CPF</label>
            <input required type="text" className="reg-input" placeholder="000.000.000-00" 
              value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">Telefone</label>
            <input required type="text" className="reg-input" placeholder="(00) 00000-0000" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="md:col-span-2 pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-white text-teal-950 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-yellow-500/10"
            >
              {loading ? 'Criando...' : (
                <>Criar minha conta <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-teal-100/30">
            Já tem conta? <Link to="/login" className="text-yellow-500 font-black hover:underline ml-1">Entrar</Link>
          </p>
        </div>
      </div>

      <style>{`
        .reg-input {
          width: 100%;
          background-color: rgba(13, 148, 136, 0.1);
          border: 1px solid rgba(13, 148, 136, 0.2);
          border-radius: 1.25rem;
          padding: 1.1rem 1.25rem;
          font-size: 0.875rem;
          color: white;
          transition: all 0.2s;
        }
        .reg-input:focus {
          border-color: #eab308;
          outline: none;
          background-color: rgba(13, 148, 136, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Register;
