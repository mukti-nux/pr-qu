import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SuperAdminLayout } from '../components/SuperAdminLayout';
import { Toast, Modal } from '../components/Modal';
import { Button } from '../components/Button';
import Badge from '../components/Badge';
import { 
  getInstansi, addInstansi, updateInstansi, deleteInstansi,
  getUsers, addGuru, updateGuru, deleteUser,
  getKelas, addKelas, deleteKelas,
  getMapel, addMapel, deleteMapel,
  getWAGroups, updateWAGroup,
  getWALogs, getPRAllKelas, deletePR
} from '../services/api';
import { 
  Search, Plus, Edit2, Trash2, Building2, Send, 
  MessageSquare, FileText, CheckCircle, XCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('instansi');
  const [instansiList, setInstansiList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedInstansi, setSelectedInstansi] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Modal states
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({});

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '') || 'instansi';
    setActiveTab(hash);
    setSearchQuery('');
    fetchBaseData();
  }, [location.hash]);

  useEffect(() => {
    if (activeTab !== 'instansi' && selectedInstansi) {
      fetchTabData();
    } else if (activeTab === 'instansi') {
      fetchTabData();
    }
  }, [activeTab, selectedInstansi]);

  const fetchBaseData = async () => {
    try {
      const list = await getInstansi();
      setInstansiList(list);
      if (list?.length > 0 && !selectedInstansi) {
        setSelectedInstansi(list[0].id);
      }
    } catch (err) {
      setToast({ message: 'Gagal memuat list instansi', type: 'error' });
    }
  };

  const fetchKelasList = async (instansi_id) => {
    try {
      const list = await getKelas(instansi_id);
      setKelasList(list);
    } catch (err) {
      setToast({ message: 'Gagal memuat list kelas', type: 'error' });
    }
  };

  const fetchTabData = async () => {
    setLoading(true);
    try {
      let result = [];
      switch (activeTab) {
        case 'instansi': result = await getInstansi(); break;
        case 'guru': result = await getUsers(selectedInstansi, 'guru'); break;
        case 'siswa': result = await getUsers(selectedInstansi, 'siswa'); break;
        case 'kelas': result = await getKelas(selectedInstansi); break;
        case 'mapel': result = await getMapel(selectedInstansi); break;
        case 'wa-groups': result = await getWAGroups(selectedInstansi); break;
        case 'wa-logs': result = await getWALogs(selectedInstansi); break;
        case 'monitor-pr': result = await getPRAllKelas(selectedInstansi); break;
      }
      setData(result);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'instansi') {
        if (editData) await updateInstansi({ ...formData, id: editData.id });
        else await addInstansi(formData);
        fetchBaseData();
      } else if (activeTab === 'guru') {
        if (editData) await updateGuru({ ...formData, id: editData.id });
        else await addGuru({ ...formData, instansi_id: selectedInstansi });
      } else if (activeTab === 'kelas') {
        await addKelas(formData.nama, selectedInstansi);
      } else if (activeTab === 'mapel') {
        await addMapel(formData.nama, selectedInstansi);
      } else if (activeTab === 'wa-groups') {
        if (!formData.group_id || formData.group_id.toUpperCase() === 'PENDING') {
          return setToast({ message: 'Group ID tidak boleh kosong atau PENDING', type: 'error' });
        }
        await updateWAGroup({ ...formData, instansi_id: selectedInstansi });
      }
      
      setToast({ message: `Data ${editData ? 'diperbarui' : 'ditambahkan'}`, type: 'success' });
      setModalOpen(false);
      fetchTabData();
    } catch (err) {
      setToast({ message: 'Gagal melakukan aksi', type: 'error' });
    }
  };

  const handleDelete = async (id, extra = null) => {
    if (window.confirm('Hapus data ini?')) {
      try {
        switch (activeTab) {
          case 'instansi': await deleteInstansi(id); fetchBaseData(); break;
          case 'guru':
          case 'siswa': await deleteUser(id); break;
          case 'kelas': await deleteKelas(id, selectedInstansi); break;
          case 'mapel': await deleteMapel(id, selectedInstansi); break;
          case 'monitor-pr': await deletePR(id); break;
        }
        setToast({ message: 'Data berhasil dihapus', type: 'success' });
        fetchTabData();
      } catch (err) {
        setToast({ message: 'Gagal menghapus', type: 'error' });
      }
    }
  };

  const filteredData = (data || []).filter(item => {
    if (!item) return false;
    const s = searchQuery.toLowerCase();
    
    // Safety check for properties
    const nama = item.nama?.toLowerCase() || '';
    const kode = item.kode?.toLowerCase() || '';
    const judul = item.judul?.toLowerCase() || '';
    const mapel = item.mapel?.toLowerCase() || '';
    const kelas = item.kelas?.toLowerCase() || '';

    if (activeTab === 'instansi') return nama.includes(s) || kode.includes(s);
    if (activeTab === 'guru') return nama.includes(s);
    if (activeTab === 'siswa') return nama.includes(s) || kelas.includes(s);
    if (activeTab === 'monitor-pr') return judul.includes(s) || mapel.includes(s);
    return nama.includes(s) || kelas.includes(s);
  });

  return (
    <SuperAdminLayout>
       {/* Global Filter Instansi (Except for Instansi Tab) */}
       {activeTab !== 'instansi' && (
         <div className="mb-10 flex flex-col md:flex-row gap-6 items-end">
            <div className="w-full md:w-1/3">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Pilih Instansi</label>
               <select 
                 className="w-full bg-[#1e293b] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold"
                 value={selectedInstansi}
                 onChange={(e) => setSelectedInstansi(e.target.value)}
               >
                 {instansiList?.map(i => <option key={i.id} value={i.id}>{i.nama}</option>)}
               </select>
            </div>
            <div className="flex-1 w-full relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Cari data..."
                 className="w-full bg-[#1e293b] border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold placeholder:text-slate-600"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            {['instansi', 'guru', 'kelas', 'mapel', 'wa-groups'].includes(activeTab) && (
              <Button 
                className="bg-purple-600 hover:bg-purple-500 rounded-2xl h-[60px] px-8 flex items-center gap-2 shadow-lg shadow-purple-600/20"
                onClick={() => { 
                  setEditData(null); 
                  setFormData({}); 
                  setModalOpen(true); 
                  if (activeTab === 'wa-groups') fetchKelasList(selectedInstansi);
                }}
              >
                <Plus size={20} /> Tambah
              </Button>
            )}
         </div>
       )}

       {activeTab === 'instansi' && (
         <div className="mb-10 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Cari instansi..."
                 className="w-full bg-[#1e293b] border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold placeholder:text-slate-600"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-500 rounded-2xl h-[60px] px-8 flex items-center gap-2 shadow-lg shadow-purple-600/20"
              onClick={() => { setEditData(null); setFormData({}); setModalOpen(true); }}
            >
              <Plus size={20} /> Tambah Instansi
            </Button>
         </div>
       )}

       <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Listing Data</h4>
             <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
               {filteredData?.length || 0} TOTAL
             </span>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-white/5">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">No</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Informasi Utama</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {loading ? (
                     <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-500 animate-pulse font-bold tracking-widest uppercase">Loading Matrix...</td></tr>
                   ) : (filteredData?.length || 0) === 0 ? (
                     <tr><td colSpan="4" className="px-10 py-20 text-center text-slate-600 italic">Data tidak ditemukan dalam database.</td></tr>
                   ) : filteredData?.map((item, i) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-10 py-6">
                            <span className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-lg text-xs font-black text-slate-600 group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-all">
                               {i + 1}
                            </span>
                         </td>
                         <td className="px-10 py-6">
                            {activeTab === 'instansi' && (
                               <div className="flex flex-col">
                                  <span className="text-white font-black text-lg tracking-tight uppercase">{item.nama}</span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.kode}</span>
                               </div>
                            )}
                            {(activeTab === 'guru' || activeTab === 'siswa') && (
                               <div className="flex flex-col">
                                  <span className="text-white font-black text-lg tracking-tight uppercase">{item.nama}</span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.username || item.id}</span>
                               </div>
                            )}
                            {(activeTab === 'kelas' || activeTab === 'mapel') && (
                               <span className="text-white font-black text-lg tracking-tight uppercase">{item.nama}</span>
                            )}
                            {activeTab === 'monitor-pr' && (
                               <div className="flex flex-col">
                                  <span className="text-white font-black text-lg tracking-tight uppercase">{item.judul}</span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.mapel} — {item.kelas}</span>
                               </div>
                            )}
                            {activeTab === 'wa-groups' && (
                               <div className="flex flex-col">
                                  <span className="text-white font-black text-lg tracking-tight uppercase">{item.kelas}</span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Group ID: {item.group_id}</span>
                               </div>
                            )}
                            {activeTab === 'wa-logs' && (
                               <div className="flex flex-col">
                                  <span className="text-white font-black text-sm uppercase tracking-tight">{item.judul_pr}</span>
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.kelas} — {new Date(item.created_at).toLocaleString()}</span>
                               </div>
                            )}
                         </td>
                         <td className="px-10 py-6">
                            {activeTab === 'instansi' && <span className="text-slate-400 text-sm font-medium">{item.alamat}</span>}
                            {activeTab === 'guru' && <Badge color="purple">{item.kode_unik}</Badge>}
                            {activeTab === 'siswa' && <Badge color="blue">{item.kelas}</Badge>}
                            {activeTab === 'wa-groups' && (
                               item.group_id !== 'PENDING' ? <Badge color="green">AKTIF</Badge> : <Badge color="red">PENDING</Badge>
                            )}
                            {activeTab === 'wa-logs' && (
                               item.status === 'success' ? <Badge color="green">SUCCESS</Badge> : <Badge color="red">FAILED</Badge>
                            )}
                            {activeTab === 'monitor-pr' && <span className="text-slate-500 text-xs font-bold">{item.deadline}</span>}
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex justify-center gap-3">
                               {['instansi', 'guru', 'wa-groups'].includes(activeTab) && (
                                 <button 
                                   onClick={() => { setEditData(item); setFormData(item); setModalOpen(true); }}
                                   className="p-3 bg-slate-800 text-slate-400 hover:bg-purple-600 hover:text-white rounded-2xl transition-all"
                                 >
                                   <Edit2 size={16} />
                                 </button>
                               )}
                               {activeTab !== 'wa-groups' && activeTab !== 'wa-logs' && (
                                 <button 
                                   onClick={() => handleDelete(item.id)}
                                   className="p-3 bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Super Admin Actions Modal */}
       <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`${editData ? 'Perbarui' : 'Tambah'} ${activeTab}`}>
          <form onSubmit={handleAction} className="space-y-6">
             {activeTab === 'instansi' && (
                <>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nama Instansi</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Kode Instansi</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.kode || ''} onChange={e => setFormData({...formData, kode: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Alamat</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold min-h-[100px]"
                        value={formData.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})}
                      />
                   </div>
                </>
             )}

             {activeTab === 'guru' && (
                <>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nama Lengkap Guru</label>
                      <input 
                        type="text" required 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Kode Unik / Password</label>
                      <input 
                        type="text" required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.kode_unik || ''} onChange={e => setFormData({...formData, kode_unik: e.target.value})}
                      />
                   </div>
                </>
             )}

             {(activeTab === 'kelas' || activeTab === 'mapel') && (
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nama {activeTab}</label>
                   <input 
                     type="text" required
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                     value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                   />
                </div>
             )}

             {activeTab === 'wa-groups' && (
                <>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Kelas</label>
                      {editData ? (
                        <input type="text" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-slate-500 font-bold opacity-70" value={formData.kelas || ''} />
                      ) : (
                        <select 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                          value={formData.kelas || ''}
                          onChange={e => setFormData({...formData, kelas: e.target.value})}
                        >
                          <option value="">-- Pilih Kelas --</option>
                          {kelasList?.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                        </select>
                      )}
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">WhatsApp Group ID</label>
                      <input 
                        type="text" required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.group_id || ''} onChange={e => setFormData({...formData, group_id: e.target.value})}
                        placeholder="Contoh: 120363028292839281@g.us"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Keterangan</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                        value={formData.keterangan || ''} onChange={e => setFormData({...formData, keterangan: e.target.value})}
                      />
                   </div>
                </>
             )}

             <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500">{editData ? 'Perbarui Data' : 'Tambah Database'}</Button>
             </div>
          </form>
       </Modal>

       <AnimatePresence>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
       </AnimatePresence>
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
