import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PRCard } from '../components/PRCard';
import { getPR } from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Sparkles, LayoutGrid, Info, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardSiswa = () => {
  const session = JSON.parse(localStorage.getItem('user_session') || '{}');
  const [prList, setPrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finishedIds, setFinishedIds] = useState([]);

  useEffect(() => {
    fetchPR();
    loadLocalStatus();
  }, []);

  const fetchPR = async () => {
    setLoading(true);
    try {
      const data = await getPR(session.kelas, session.instansi_id);
      setPrList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalStatus = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`pr_status_`) && k.endsWith(`_${session.id}`));
    const finished = keys.filter(k => localStorage.getItem(k) === 'selesai').map(k => k.split('_')[2]);
    setFinishedIds(finished);
  };

  const handleToggleStatus = (prId) => {
    const key = `pr_status_${prId}_${session.id}`;
    const current = localStorage.getItem(key);
    const newVal = current === 'selesai' ? 'belum' : 'selesai';
    localStorage.setItem(key, newVal);
    
    if (newVal === 'selesai') {
      setFinishedIds([...finishedIds, String(prId)]);
    } else {
      setFinishedIds(finishedIds.filter(id => id !== String(prId)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-primary-dark rounded-[2.5rem] p-8 md:p-12 mb-10 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl text-white"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10"
                >
                  <Sparkles size={16} className="text-accent-yellow" />
                  <span className="text-xs font-black uppercase tracking-widest">{session.instansi}</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Halo, {session.nama}! 👋</h1>
                <p className="text-slate-400 text-lg font-medium">Ada <span className="text-accent-yellow">{prList?.length || 0} Tugas Baru</span> di kelas {session.kelas} hari ini.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Terselesaikan</p>
                    <h4 className="text-3xl font-black text-accent-yellow">{finishedIds?.length || 0} / {prList?.length || 0}</h4>
                 </div>
                 <div className="h-12 w-1 bg-white/10 rounded-full"></div>
                 <div className="p-3 bg-accent-yellow rounded-2xl">
                    <LayoutGrid className="w-8 h-8 text-primary-dark" />
                 </div>
              </div>
           </div>
        </div>

        {/* Info WhatsApp */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-2xl mb-8">
          <div className="bg-accent-wa p-2 rounded-xl text-white">
            <MessageSquare size={20} />
          </div>
          <p className="text-sm text-green-800 font-bold">
            Info: Setiap PR baru akan otomatis dikirimkan ke grup WhatsApp kelas Anda untuk pengingat.
          </p>
        </div>

        {/* PR List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(prList?.length || 0) === 0 ? (
              <div className="col-span-full py-20 bg-white rounded-[2rem] border border-dashed border-slate-300 flex flex-col items-center">
                 <div className="bg-slate-100 p-6 rounded-3xl mb-4 text-slate-400">
                    <Info size={48} />
                 </div>
                 <h4 className="text-xl font-bold text-slate-800">Tidak Ada PR Aktif</h4>
                 <p className="text-slate-500">Nikmati waktu istirahatmu atau periksa kembali nanti!</p>
              </div>
            ) : (
              prList?.map(item => (
                <PRCard 
                  key={item.id} 
                  item={item} 
                  isFinished={finishedIds?.includes(String(item.id))}
                  onToggleStatus={handleToggleStatus}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardSiswa;
