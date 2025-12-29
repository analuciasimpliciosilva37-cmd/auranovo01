
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, FileText, CheckCircle, AlertCircle, Trash2, Search, X, Folder, ChevronLeft } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../App';
import { parseReceipt } from '../gemini';

const Receipts: React.FC = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [viewingPath, setViewingPath] = useState<string | null>(null); // null = anos, "2024" = meses, "2024/05" = receipts
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReceipts = async () => {
    const { data } = await supabase.from('receipts').select('*').eq('user_id', user.id).order('date', { ascending: false });
    if (data) setReceipts(data);
  };

  useEffect(() => {
    fetchReceipts();
  }, [user.id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await parseReceipt(base64String);
        
        const date = result?.date ? new Date(result.date) : new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const folderPath = `${user.id}/${year}/${month}`;
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${folderPath}/${fileName}`;

        await supabase.storage.from('receipts').upload(filePath, file);
        const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(filePath);

        await supabase.from('receipts').insert({
          user_id: user.id,
          name: result?.merchant || file.name,
          amount: result?.amount || 0,
          date: result?.date || new Date().toISOString().split('T')[0],
          category: result?.category || 'Outros',
          file_url: publicUrl,
          folder: `${year}/${month}`
        });

        fetchReceipts();
        setScanning(false);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setScanning(false);
    }
  };

  // Agrupamento para navegação por pastas
  const years = Array.from(new Set(receipts.map(r => r.folder?.split('/')[0]))).filter(Boolean);
  const monthsInYear = (year: string) => Array.from(new Set(receipts.filter(r => r.folder?.startsWith(year)).map(r => r.folder?.split('/')[1]))).filter(Boolean);
  const itemsInPath = (path: string) => receipts.filter(r => r.folder === path);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-aura-textL dark:text-white uppercase tracking-tighter">Cofre de Comprovantes</h1>
          <p className="text-slate-500 dark:text-aura-seafoam/50 text-base italic">Seu arquivo digital organizado automaticamente.</p>
        </div>
        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-aura-gold text-aura-deep px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl uppercase tracking-widest text-[10px]">
            <Camera size={18} /> Digitalizar
          </button>
        </div>
      </div>

      <nav className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-aura-gold">
         <button onClick={() => setViewingPath(null)} className="hover:underline">Início</button>
         {viewingPath && (
           <>
             <span>/</span>
             <button onClick={() => setViewingPath(viewingPath.split('/')[0])} className="hover:underline">{viewingPath.split('/')[0]}</button>
           </>
         )}
         {viewingPath?.includes('/') && (
           <>
             <span>/</span>
             <span className="text-white">{viewingPath.split('/')[1]}</span>
           </>
         )}
      </nav>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {/* Visualização de Anos */}
        {!viewingPath && years.map(y => (
           <div key={y} onClick={() => setViewingPath(y)} className="premium-card p-8 flex flex-col items-center justify-center gap-4 bg-white dark:bg-aura-deep cursor-pointer hover:scale-105 transition-all border-aura-gold/20">
              <Folder size={48} className="text-aura-gold" />
              <span className="font-black text-white">{y}</span>
           </div>
        ))}

        {/* Visualização de Meses */}
        {viewingPath && !viewingPath.includes('/') && monthsInYear(viewingPath).map(m => (
           <div key={m} onClick={() => setViewingPath(`${viewingPath}/${m}`)} className="premium-card p-8 flex flex-col items-center justify-center gap-4 bg-white dark:bg-aura-deep cursor-pointer hover:scale-105 transition-all border-aura-teal/20">
              <Folder size={48} className="text-aura-teal" />
              <span className="font-black text-white">Mês {m}</span>
           </div>
        ))}

        {/* Visualização de Comprovantes */}
        {viewingPath?.includes('/') && itemsInPath(viewingPath).map(r => (
           <div key={r.id} className="premium-card bg-white dark:bg-aura-deep overflow-hidden group">
              <div className="h-32 bg-slate-100 relative">
                 <img src={r.file_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
              </div>
              <div className="p-4">
                 <p className="text-[9px] font-black text-white uppercase truncate">{r.name}</p>
                 <p className="text-[10px] font-bold text-aura-gold">R$ {r.amount.toFixed(2)}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default Receipts;
