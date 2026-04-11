import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Toast } from '../components/Modal';
import { getKelas, addKelas, deleteKelas, getMapel, addMapel, deleteMapel } from '../services/api';
import { Users, Book, Plus, Trash2, LayoutGrid } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Manajemen = () => {
  const session = JSON.parse(localStorage.getItem('user_session') || '{}');
  const [activeTab, setActiveTab] = useState('kelas');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = activeTab === 'kelas' 
        ? await getKelas(session.instansi_id)
        : await getMapel(session.instansi_id);
      setData(result);
    } catch (err) {
      setToast({ message: 'Gagal mengambil data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    try {
      if (activeTab === 'kelas') {
        await addKelas(newItem, session.instansi_id);
      } else {
        await addMapel(newItem, session.instansi_id);
      }
      setToast({ message: 'Data berhasil ditambahkan', type: 'success' });
      setNewItem('');
      fetchData();
    } catch (err) {
      setToast({ message: 'Gagal menambah data', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus item ini?')) {
      try {
        if (activeTab === 'kelas') {
          await deleteKelas(id, session.instansi_id);
        } else {
          await deleteMapel(id, session.instansi_id);
        }
        setToast({ message: 'Data berhasil dihapus', type: 'success' });
        fetchData();
      } catch (err) {
        setToast({ message: 'Gagal menghapus', type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">Manajemen Sekolah</h1>
          <p className="text-slate-500 text-center font-medium">Atur daftar kelas dan mata pelajaran yang tersedia</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('kelas')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${activeTab === 'kelas' ? 'bg-primary-dark text-white shadow-lg shadow-primary-dark/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users size={18} /> KELAS
          </button>
          <button
            onClick={() => setActiveTab('mapel')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${activeTab === 'mapel' ? 'bg-primary-dark text-white shadow-lg shadow-primary-dark/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Book size={18} /> MATA PELAJARAN
          </button>
        </div>

        {/* Action Bar */}
        <form onSubmit={handleAdd} className="flex gap-3 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="relative flex-1">
            {activeTab === 'kelas' ? <Users className="absolute left-4 top-3.5 text-slate-400" /> : <Book className="absolute left-4 top-3.5 text-slate-400" />}
            <input
              type="text"
              placeholder={activeTab === 'kelas' ? "Contoh: X RPL 1" : "Contoh: Matematika"}
              className="input pl-12 bg-slate-50 border-slate-200"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="flex items-center gap-2 px-8 rounded-2xl">
            <Plus size={20} /> Tambah
          </Button>
        </form>

        {/* List Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Daftar {activeTab === 'kelas' ? 'Kelas' : 'Mapel'}
            </h4>
            <span className="text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {data?.length || 0} TOTAL
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-dark rounded-full animate-spin" />
                <p className="font-bold text-sm">Harap Tunggu...</p>
              </div>
            ) : (data?.length || 0) === 0 ? (
               <div className="p-12 text-center text-slate-400 italic">Belum ada data</div>
            ) : (
              data?.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-xs font-black text-slate-400">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-800 text-lg uppercase">{item.nama}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-red-100 group-hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Hapus"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Manajemen;
