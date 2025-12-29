
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from './supabase';
import { Profile } from './types';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Investments from './pages/Investments';
import Receipts from './pages/Receipts';
import ProfilePage from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Welcome from './pages/Welcome';
import IncomeTax from './pages/IncomeTax';
import AuraStrategy from './pages/AuraStrategy';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Auth Context
interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Layout Component
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    // Busca o profile existente. Não criamos mais aqui via front-end.
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
    } else {
      // Fallback de segurança apenas para evitar quebra de UI caso o trigger falhe no mock
      console.warn("Profile não encontrado. O backend deve criar automaticamente.");
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-aura-deep">
        <div className="text-white text-2xl font-bold animate-pulse">AuraFin</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut: handleSignOut }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={(u) => setUser(u)} />} />
          <Route path="/register" element={user ? <Navigate to="/welcome" /> : <Register onRegister={(u) => setUser(u)} />} />
          <Route path="/welcome" element={user ? <Welcome /> : <Navigate to="/login" />} />
          
          <Route path="/dashboard" element={user ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/expenses" element={user ? <AuthenticatedLayout><Expenses /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/transactions" element={user ? <AuthenticatedLayout><Transactions /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/cards" element={user ? <AuthenticatedLayout><Cards /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/investments" element={user ? <AuthenticatedLayout><Investments /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/receipts" element={user ? <AuthenticatedLayout><Receipts /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <AuthenticatedLayout><ProfilePage /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <AuthenticatedLayout><Settings /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/about" element={user ? <AuthenticatedLayout><About /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/income-tax" element={user ? <AuthenticatedLayout><IncomeTax /></AuthenticatedLayout> : <Navigate to="/login" />} />
          <Route path="/mentoria" element={user ? <AuthenticatedLayout><AuraStrategy /></AuthenticatedLayout> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
