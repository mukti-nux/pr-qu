import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { getWALogs } from '../services/api';
import { formatDate } from '../utils/dateHelper';
import Badge from '../components/Badge';
import { MessageSquare, Search, Filter, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotifikasiWA = () => {
  const session = JSON.parse(localStorage.getItem('user_session') || '{}');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getWALogs(session.instansi_id);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.judul_pr?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.pesan?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' ? true : 
                         filterStatus === 'Terkirim' ? log.status === 'success' : log.status !== 'success';
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Notifikasi WA</h1>
            <p className="text-slate-500 font-medium">Log pengiriman pesan otomatis ke grup kelas</p>
          </div>
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Segarkan Log
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan judul PR atau isi pesan..."
                className="input pl-12 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="relative w-full md:w-48">
              <Filter className="absolute left-4 top-3 text-slate-400" size={18} />
              <select 
                className="input pl-12 bg-slate-50 border-slate-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Terkirim">Terkirim</option>
                <option value="Gagal">Gagal</option>
              </select>
           </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Judul PR</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pesan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-light rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold">Memuat Log...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">Belum ada riwayat notifikasi</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">{log.kelas}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{log.judul_pr}</td>
                    <td className="px-6 py-4 text-center">
                       {log.status === 'success' ? (
                         <Badge color="green" className="flex items-center gap-1 mx-auto w-fit">
                           <CheckCircle size={12} /> TERKIRIM
                         </Badge>
                       ) : (
                         <Badge color="red" className="flex items-center gap-1 mx-auto w-fit">
                           <XCircle size={12} /> GAGAL
                         </Badge>
                       )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden">
                        <p className="text-xs text-slate-500 line-clamp-2 italic">{log.pesan}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default NotifikasiWA;
