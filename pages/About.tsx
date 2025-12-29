
import React from 'react';
import { Target, Heart, CheckCircle, Globe, Shield, Sparkles, Award, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-24 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-10">
        <div className="flex items-end gap-3 h-24 mb-12 justify-center">
            <div className="w-3.5 h-12 bg-aura-deep/20 dark:bg-white/10 rounded-full"></div>
            <div className="w-3.5 h-18 bg-aura-teal rounded-full shadow-[0_0_20px_rgba(46,174,158,0.3)]"></div>
            <div className="w-3.5 h-24 bg-aura-gold rounded-full shadow-[0_0_30px_rgba(230,182,92,0.4)]"></div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-aura-textL dark:text-white tracking-tighter uppercase leading-none">AURAFIN</h1>
        <p className="text-2xl md:text-3xl text-aura-gold font-light italic tracking-wide">"Inteligência financeira que você sente."</p>
        
        <div className="max-w-3xl mx-auto pt-6">
          <p className="text-lg md:text-xl text-slate-500 dark:text-aura-seafoam/40 font-medium leading-relaxed">
            A AuraFin nasceu do desejo de transformar a complexidade dos números em clareza emocional. 
            Somos mais que um app de controle: somos sua base para uma vida de abundância e decisões sábias.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="premium-card p-12 bg-white dark:bg-aura-deep border-aura-teal/10 shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-aura-teal/10 rounded-[1.5rem] flex items-center justify-center text-aura-teal shadow-inner">
            <Target size={32} />
          </div>
          <h2 className="text-3xl font-black text-aura-textL dark:text-white tracking-tighter uppercase">Nossa Missão</h2>
          <p className="text-lg text-slate-500 dark:text-aura-seafoam/60 leading-relaxed font-medium italic">
            “Ajudar pessoas a organizarem sua vida financeira com clareza, consciência e tranquilidade, transformando a relação com o dinheiro em uma experiência saudável e positiva.”
          </p>
        </div>
        
        <div className="premium-card p-12 bg-white dark:bg-aura-deep border-aura-gold/10 shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-aura-gold/10 rounded-[1.5rem] flex items-center justify-center text-aura-gold shadow-inner">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl font-black text-aura-textL dark:text-white tracking-tighter uppercase">Nossa Visão</h2>
          <p className="text-lg text-slate-500 dark:text-aura-seafoam/60 leading-relaxed font-medium italic">
            “Ser uma plataforma global de educação e organização financeira, reconhecida por unir tecnologia, orientação inteligente e experiência emocional positiva.”
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Nossos Valores</h2>
          <p className="text-aura-gold font-bold tracking-[0.2em] text-xs uppercase">O que nos guia todos os dias</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Clareza Financeira', icon: Zap, desc: 'Informação pura e direta para decidir melhor.' },
            { title: 'Educação Contínua', icon: Award, desc: 'Aprender a investir é aprender a prosperar.' },
            { title: 'Consciência e Equilíbrio', icon: Shield, desc: 'Dinheiro a serviço da sua paz mental.' },
            { title: 'Abundância Real', icon: Sparkles, desc: 'Prosperidade com estratégia e responsabilidade.' },
            { title: 'Tecnologia Humana', icon: Globe, desc: 'IA que entende seu contexto e seu momento.' },
            { title: 'Segurança Absoluta', icon: CheckCircle, desc: 'Seus dados e seu futuro em boas mãos.' }
          ].map((v, i) => (
            <div key={i} className="premium-card p-8 bg-aura-gold/5 dark:bg-white/5 hover:bg-aura-gold/10 transition-colors border-white/5 space-y-4">
              <v.icon className="text-aura-gold" size={24} />
              <h4 className="text-lg font-black text-aura-textL dark:text-white uppercase tracking-tight">{v.title}</h4>
              <p className="text-sm text-slate-500 dark:text-aura-seafoam/40 font-medium italic">"{v.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="premium-card p-12 bg-aura-deep text-white border-aura-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-aura-gold/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">O que nos torna diferentes?</h2>
            <p className="text-aura-seafoam/50 text-lg font-medium">A AuraFin remove a ansiedade do controle financeiro tradicional e entrega uma bússola estratégica.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="space-y-2">
              <h5 className="text-aura-gold font-black uppercase text-sm tracking-widest">Sem Ansiedade</h5>
              <p className="text-aura-seafoam/70 text-base leading-relaxed italic">Organização fluida que não te sobrecarrega emocionalmente.</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-aura-gold font-black uppercase text-sm tracking-widest">Inteligência Real</h5>
              <p className="text-aura-seafoam/70 text-base leading-relaxed italic">Aura IA analisa seu fluxo para sugerir os melhores caminhos.</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-aura-gold font-black uppercase text-sm tracking-widest">Estratégia Integral</h5>
              <p className="text-aura-seafoam/70 text-base leading-relaxed italic">Integração entre controle, educação e metas de longo prazo.</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-aura-gold font-black uppercase text-sm tracking-widest">Respeito Individual</h5>
              <p className="text-aura-seafoam/70 text-base leading-relaxed italic">Adaptamos a plataforma ao seu estilo e realidade financeira.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section className="text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Experiência Global</h2>
          <p className="text-aura-teal font-bold tracking-[0.3em] text-xs uppercase">Feita para o mundo inteiro</p>
        </div>
        <div className="max-w-xl mx-auto">
          <p className="text-lg text-slate-500 dark:text-aura-seafoam/50 leading-relaxed font-medium">
            Multimoeda, multilíngue e multiregional. A AuraFin se adapta às regras fiscais e realidades econômicas de onde quer que você esteja. 
            Onde houver um sonho de liberdade financeira, a AuraFin estará presente.
          </p>
        </div>
      </section>

      <div className="pt-10 flex flex-col items-center gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-aura-gold to-transparent opacity-50"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-aura-gold">AuraFin • 2025 • Gestão com Propósito</p>
      </div>
    </div>
  );
};

export default About;
