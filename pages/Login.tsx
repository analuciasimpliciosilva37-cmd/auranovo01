
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurafin-deep flex flex-col items-center justify-center p-6">
      <Link to="/" className="flex items-center gap-3 mb-12 group">
        <div className="flex items-end gap-1.5 h-10">
          <div className="w-2 h-5 bg-teal-900/50 rounded-full"></div>
          <div className="w-2 h-7 bg-teal-500 rounded-full"></div>
          <div className="w-2 h-10 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"></div>
        </div>
        <span className="text-3xl font-black text-white tracking-tighter">AURAFIN</span>
      </Link>

      <div className="w-full max-w-md bg-teal-950/40 p-10 rounded-[3rem] border border-teal-800/30 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-3">Bem-vindo</h1>
          <p className="text-teal-100/40 text-sm">Acesse sua inteligência financeira.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-800" size={18} />
              <input 
                required
                type="email" 
                className="w-full bg-teal-900/20 border border-teal-800/50 rounded-2xl pl-14 pr-4 py-5 text-sm focus:ring-2 ring-yellow-500 transition-all text-white placeholder:text-teal-900"
                placeholder="exemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-teal-100/30 uppercase tracking-[0.2em] ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-800" size={18} />
              <input 
                required
                type={showPassword ? 'text' : 'password'} 
                className="w-full bg-teal-900/20 border border-teal-800/50 rounded-2xl pl-14 pr-14 py-5 text-sm focus:ring-2 ring-yellow-500 transition-all text-white placeholder:text-teal-900"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-800 hover:text-yellow-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-white text-teal-950 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-yellow-500/10 disabled:opacity-50 mt-4"
          >
            {loading ? 'Processando...' : (
              <>Entrar <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-teal-100/30">
            Não tem uma conta? <Link to="/register" className="text-yellow-500 font-black hover:underline ml-1">Criar agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
