
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-aurafin-deep p-6 text-center overflow-hidden">
      {/* 3-Bar Logo Animation */}
      <div className="relative mb-20">
        <div className="absolute inset-0 bg-yellow-500/10 blur-[80px] animate-pulse rounded-full"></div>
        <div className="relative flex items-end gap-3 h-28">
            <div className="w-4.5 h-12 bg-teal-900/40 rounded-full animate-in slide-in-from-bottom duration-500 fill-mode-both"></div>
            <div className="w-4.5 h-18 bg-teal-600 rounded-full shadow-[0_0_20px_rgba(13,148,136,0.3)] animate-in slide-in-from-bottom duration-700 delay-200 fill-mode-both"></div>
            <div className="w-4.5 h-28 bg-yellow-500 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-in slide-in-from-bottom duration-1000 delay-500 fill-mode-both"></div>
        </div>
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both">
        <h1 className="text-6xl font-black text-white tracking-tighter">
          AURAFIN
        </h1>
        <div className="space-y-1">
          <p className="text-yellow-500 font-black tracking-[0.3em] uppercase text-xs">
            Bem-vindo, {profile?.nickname || 'Investidor'}
          </p>
          <p className="text-teal-100/20 text-lg font-light italic mt-6">
            "Inteligência financeira que você sente."
          </p>
        </div>
      </div>

      {/* Progress Line */}
      <div className="mt-20 w-64 h-[2px] bg-teal-950 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-500 animate-loading-bar shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 4s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
