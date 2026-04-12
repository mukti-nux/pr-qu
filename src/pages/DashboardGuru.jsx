import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { PRTable } from '../components/PRTable';
import { PRModal, WAPreviewModal } from '../components/PRModal';
import { Toast } from '../components/Modal';
import { getKelas, getMapel, getPRAllKelas, createPR, updatePR, deletePR, kirimWA } from '../services/api';
import { Button } from '../components/Button';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { Plus, LayoutGrid, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDate } from '../utils/dateHelper';

const DashboardGuru = () => {
  const session = JSON.parse(localStorage.getItem('user_session') || '{}');
  const [loading, setLoading] = useState(true);
  const [prList, setPrList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [toast, setToast] = useState(null);
  
  // Modal States
  const [isPRModalOpen, setPRModalOpen] = useState(false);
  const [isWAPreviewOpen, setWAPreviewOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [pendingWA, setPendingWA] = useState(null);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      const [k, m, p] = await Promise.all([
        getKelas(session.instansi_id),
        getMapel(session.instansi_id),
        getPRAllKelas(session.instansi_id)
      ]);
      setKelasList(k);
      setMapelList(m);
      setPrList(p);
    } catch (err) {
      setToast({ message: 'Gagal memuat data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPR = (prList || []).filter(item => {
    if (!item) return false;
    const judul = item.judul || '';
    const deskripsi = item.deskripsi || '';
    const matchesSearch = judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKelas = selectedKelas ? item.kelas === selectedKelas : true;
    return matchesSearch && matchesKelas;
  });

  const handleSavePR = async (payload) => {
    try {
      if (editData) {
        await updatePR({ 
          id: editData.id,
          judul: payload.judul,
          deskripsi: payload.deskripsi,
          deadline: payload.deadline,
          instansi_id: session.instansi_id 
        });
        setToast({ message: 'PR berhasil diperbarui', type: 'success' });
        setPRModalOpen(false);
        initData();
      } else {
        const result = await createPR({ 
          ...payload, 
          guru_id: session.id,
          nama_guru: session.nama,
          instansi_id: session.instansi_id 
        });
        if (payload.kirim_wa) {
          const waPayload = {
            kelas: payload.kelas,
            instansi_id: session.instansi_id,
            pr_id: result.data.id,
            judul: payload.judul,
            pesan: `📚 *PR BARU — ${payload.kelas}*\n\nMapel     : ${payload.mapel}\nJudul     : ${payload.judul}\nDeskripsi : ${payload.deskripsi}\nDeadline  : ${formatDate(payload.deadline)} ⏰\nDari Guru : ${session.nama}\n\nSegera dikerjakan ya! 💪\n— MumuTask`
          };
          setPendingWA(waPayload);
          setWAPreviewOpen(true);
        } else {
          setToast({ message: 'PR berhasil dibuat', type: 'success' });
        }
        setPRModalOpen(false);
        initData();
      }
    } catch (err) {
      setToast({ message: 'Gagal menyimpan PR', type: 'error' });
    }
  };

  const handleConfirmWA = async () => {
    try {
      await kirimWA(pendingWA);
      setToast({ message: 'Notifikasi WA dikirim ke grup kelas', type: 'success' });
      setWAPreviewOpen(false);
      setPendingWA(null);
      initData();
    } catch (err) {
      setToast({ message: 'Gagal mengirim WA', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus PR ini?')) {
      try {
        await deletePR(id, session.instansi_id);
        setToast({ message: 'PR berhasil dihapus', type: 'success' });
        initData();
      } catch (err) {
        setToast({ message: 'Gagal menghapus', type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Halo, {session.nama} 👋</h1>
            <p className="text-slate-500 font-medium">Panel Manajemen Pekerjaan Rumah — {session.instansi}</p>
          </div>
          <Button 
            className="flex items-center gap-2 py-3 px-6 rounded-2xl shadow-lg shadow-primary-dark/20"
            onClick={() => { setEditData(null); setPRModalOpen(true); }}
          >
            <Plus size={20} /> Tambah PR Baru
          </Button>
        </div>

        {/* Stats / Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-primary-dark p-6 rounded-[2rem] text-white shadow-xl flex items-center gap-5">
            <div className="bg-white/10 p-4 rounded-2xl"><LayoutGrid className="w-8 h-8 text-accent-yellow" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total PR</p>
              <h4 className="text-3xl font-black">{prList?.length || 0}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-2xl"><Info className="w-8 h-8 text-primary-light" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Tampilan Saat Ini</p>
              <h4 className="text-xl font-bold text-slate-800">
                {selectedKelas || 'Semua Kelas'}
              </h4>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <FilterBar 
            kelasList={kelasList}
            selectedKelas={selectedKelas}
            setSelectedKelas={setSelectedKelas}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={initData}
          />
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="bg-white p-8 rounded-2xl"><TableSkeleton rows={6} cols={7} /></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PRTable 
              data={filteredPR} 
              onEdit={(item) => { setEditData(item); setPRModalOpen(true); }}
              onDelete={handleDelete}
            />
            <p className="mt-4 text-sm text-slate-500 font-medium">
              Menampilkan {filteredPR?.length || 0} PR
              {selectedKelas && ` untuk kelas ${selectedKelas}`}
            </p>
          </motion.div>
        )}
      </main>

      <PRModal 
        isOpen={isPRModalOpen}
        onClose={() => setPRModalOpen(false)}
        onSave={handleSavePR}
        editData={editData}
        mapelList={mapelList}
        kelasList={kelasList}
      />

      <WAPreviewModal 
        isOpen={isWAPreviewOpen}
        onClose={() => setWAPreviewOpen(false)}
        onConfirm={handleConfirmWA}
        payload={pendingWA}
      />

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default DashboardGuru;
