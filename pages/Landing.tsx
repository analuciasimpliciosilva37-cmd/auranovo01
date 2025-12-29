
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Globe, Target, Heart, Eye } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#063A3A] text-white overflow-x-hidden transition-colors selection:bg-aura-gold/30">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1.5 h-8">
            <div className="w-2 h-4 bg-white/10 rounded-full"></div>
            <div className="w-2 h-6 bg-aura-teal rounded-full shadow-[0_0_10px_rgba(46,174,158,0.3)]"></div>
            <div className="w-2 h-8 bg-aura-gold rounded-full shadow-[0_0_15px_rgba(230,182,92,0.4)]"></div>
          </div>
          <span className="text-2xl font-extrabold tracking-tighter">AURAFIN</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-sm font-semibold text-aura-seafoam/60 hover:text-white transition-colors">Entrar</Link>
          <Link to="/register" className="bg-aura-gold text-aura-deep px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-all shadow-xl">Começar</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="relative inline-block mb-12 animate-in fade-in zoom-in duration-700">
            <div className="flex items-end gap-3 h-24 mb-10 justify-center">
                <div className="w-3.5 h-12 bg-white/5 rounded-full"></div>
                <div className="w-3.5 h-18 bg-aura-teal rounded-full shadow-[0_0_30px_rgba(46,174,158,0.2)]"></div>
                <div className="w-3.5 h-24 bg-aura-gold rounded-full shadow-[0_0_35px_rgba(230,182,92,0.3)]"></div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 leading-none uppercase">AURAFIN</h1>
            <p className="text-xl md:text-3xl text-aura-seafoam/60 font-light tracking-wide italic leading-relaxed">
              "Inteligência financeira que você sente."
            </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <p className="text-lg md:text-2xl text-aura-seafoam/40 font-light leading-relaxed">
            Organize sua vida financeira com a sofisticação que ela merece. 
            Uma plataforma global, segura e intuitiva feita para quem busca abundância.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link to="/register" className="w-full sm:w-auto bg-aura-gold text-aura-deep px-12 py-5 rounded-2xl text-xl font-black hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl">
              Abra sua Conta <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </main>

      {/* MVV Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm group hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-aura-gold rounded-2xl flex items-center justify-center text-aura-deep mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Nossa Missão</h3>
            <p className="text-aura-seafoam/50 font-medium leading-relaxed italic">
              "Democratizar a alta gestão financeira com elegância e tecnologia, trazendo paz e prosperidade para cada decisão."
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm group hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-aura-teal rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <Eye size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Nossa Visão</h3>
            <p className="text-aura-seafoam/50 font-medium leading-relaxed italic">
              "Ser a referência global em bem-estar financeiro, onde a inteligência artificial serve ao propósito humano de liberdade."
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm group hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-aura-gold mb-8 group-hover:scale-110 transition-transform">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Nossos Valores</h3>
            <p className="text-aura-seafoam/50 font-medium leading-relaxed italic">
              "Transparência absoluta, estética impecável, segurança inabalável e o cliente como o centro de cada inovação."
            </p>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 text-center bg-black/10">
        <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">AURAFIN • GESTÃO GLOBAL • 2025</p>
      </footer>
    </div>
  );
};

export default Landing;
