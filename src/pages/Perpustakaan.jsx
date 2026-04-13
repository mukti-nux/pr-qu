import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Toast } from '../components/Modal';
import { Button } from '../components/Button';
import { BukuCard } from '../components/BukuCard';
import { BukuModal } from '../components/BukuModal';
import { BukuFormModal } from '../components/BukuFormModal';
import { 
  getBuku, getBukuKelas, addBuku, updateBuku, 
  deleteBuku, notifBuku, getMapel, getKelas 
} from '../services/api';
import { Search, Plus, Library, Filter, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Perpustakaan = () => {
  const [session] = useState(JSON.parse(localStorage.getItem('user_session') || '{}'));
  const [bukuList, setBukuList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua Kelas');
  const [filterMapel, setFilterMapel] = useState('Semua Mapel');
  const [filterKategori, setFilterKategori] = useState('Semua Kategori');

  // Modal states
  const [isViewOpen, setViewOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState(null);

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (session.role === 'guru') {
        data = await getBuku(session.instansi_id);
      } else {
        data = await getBukuKelas(session.kelas, session.instansi_id);
      }
      setBukuList(data || []);
    } catch (err) {
      setToast({ message: 'Gagal memuat perpustakaan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [m, k] = await Promise.all([
        getMapel(session.instansi_id),
        getKelas(session.instansi_id)
      ]);
      setMapelList(m || []);
      setKelasList(k || []);
    } catch (err) {}
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        instansi_id: session.instansi_id,
        uploaded_by: session.id
      };

      if (formData.id) {
        await updateBuku(payload);
      } else {
        await addBuku(payload);
        if (formData.kirim_wa) {
          await notifBuku({
            ...payload,
            instansi_id: session.instansi_id
          });
        }
      }

      setToast({ message: `Buku berhasil ${formData.id ? 'diperbarui' : 'diunggah'}!`, type: 'success' });
      setFormOpen(false);
      fetchData();
    } catch (err) {
      setToast({ message: 'Gagal menyimpan data buku', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus buku ini dari perpustakaan?')) {
      try {
        await deleteBuku(id, session.instansi_id);
        setToast({ message: 'Buku berhasil dihapus', type: 'success' });
        fetchData();
      } catch (err) {
        setToast({ message: 'Gagal menghapus buku', type: 'error' });
      }
    }
  };

  const handleNotif = async (buku) => {
    try {
      await notifBuku({
        ...buku,
        instansi_id: session.instansi_id
      });
      setToast({ message: 'Notifikasi WhatsApp terkirim!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Gagal mengirim notifikasi', type: 'error' });
    }
  };

  const filteredBuku = bukuList.filter(b => {
    const s = searchQuery.toLowerCase();
    const matchSearch = b.judul.toLowerCase().includes(s) || (b.penulis || '').toLowerCase().includes(s);
    const matchKelas = filterKelas === 'Semua Kelas' || b.kelas === filterKelas || b.kelas === 'Semua Kelas';
    const matchMapel = filterMapel === 'Semua Mapel' || b.mapel === filterMapel;
    const matchKategori = filterKategori === 'Semua Kategori' || b.kategori === filterKategori;
    return matchSearch && matchKelas && matchMapel && matchKategori;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-primary-dark rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-dark/20 ring-8 ring-primary-dark/5">
                <Library className="text-accent-yellow w-8 h-8" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">MuMuLib</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Perpustakaan Digital — {session.instansi}</p>
             </div>
          </div>
          
          {session.role === 'guru' && (
            <Button 
              className="bg-primary-dark text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary-dark/20 transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => { setSelectedBuku(null); setFormOpen(true); }}
            >
              <Plus className="mr-2" size={20} /> Upload Buku Baru
            </Button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-10 border border-white flex flex-col lg:flex-row gap-6 items-center">
           <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari judul buku atau penulis..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:w-48 relative">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <select 
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-dark/5"
                   value={filterKelas} onChange={e => setFilterKelas(e.target.value)}
                 >
                   <option value="Semua Kelas">Semua Kelas</option>
                   {kelasList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                 </select>
              </div>
              <div className="flex-1 lg:w-48 relative">
                 <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <select 
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-dark/5"
                   value={filterMapel} onChange={e => setFilterMapel(e.target.value)}
                 >
                   <option value="Semua Mapel">Semua Mapel</option>
                   {mapelList.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
                 </select>
              </div>
              <div className="flex-1 lg:w-48">
                 <select 
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-dark/5"
                   value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
                 >
                   <option value="Semua Kategori">Semua Kategori</option>
                   <option value="Buku Pelajaran">Buku Pelajaran</option>
                   <option value="Referensi">Referensi</option>
                   <option value="LKS & Modul">LKS & Modul</option>
                   <option value="Fiksi">Fiksi</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="mb-6 flex justify-between items-center px-4">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              MENAMPILKAN {filteredBuku.length} BUKU TERDAFTAR
           </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[1,2,3,4,5].map(n => <LoadingSkeleton key={n} className="aspect-[3/4] rounded-3xl" />)}
          </div>
        ) : filteredBuku.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-inner">
             <Library size={64} className="mx-auto text-slate-200 mb-6" />
             <h3 className="text-xl font-bold text-slate-400 italic">Belum ada buku untuk kategori ini.</h3>
             <p className="text-sm text-slate-300 mt-2">Coba ganti filter atau cari kata kunci lain.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
          >
            <AnimatePresence>
               {filteredBuku.map(buku => (
                 <motion.div 
                   key={buku.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                 >
                    <BukuCard 
                      buku={buku} 
                      role={session.role}
                      onEdit={(b) => { setSelectedBuku(b); setFormOpen(true); }}
                      onDelete={handleDelete}
                      onNotif={handleNotif}
                      onClick={(b) => { setSelectedBuku(b); setViewOpen(true); }}
                    />
                 </motion.div>
               ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <BukuModal 
        buku={selectedBuku} 
        isOpen={isViewOpen} 
        onClose={() => setViewOpen(false)} 
      />

      <BukuFormModal 
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={selectedBuku}
        mapelList={mapelList}
        kelasList={kelasList}
      />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Perpustakaan;
