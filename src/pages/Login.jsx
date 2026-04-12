import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstansi, getUsers, getKelas, loginGuru, registerSiswa } from '../services/api';
import { Button } from '../components/Button';
import { Toast } from '../components/Modal';
import { BookOpen, User, Users, Lock, ChevronRight, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guru');
  const [instansiList, setInstansiList] = useState([]);
  const [selectedInstansi, setSelectedInstansi] = useState('');
  const [userList, setUserList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [guruId, setGuruId] = useState('');
  const [kodeUnik, setKodeUnik] = useState('');
  const [siswaNama, setSiswaNama] = useState('');
  const [siswaKelas, setSiswaKelas] = useState('');
  const [siswaNisn, setSiswaNisn] = useState('');

  useEffect(() => {
    fetchInstansi();
  }, []);

  useEffect(() => {
    if (selectedInstansi) {
      if (activeTab === 'guru') fetchGuru(selectedInstansi);
      else fetchKelas(selectedInstansi);
    }
  }, [selectedInstansi, activeTab]);

  const fetchInstansi = async () => {
    try {
      const data = await getInstansi();
      setInstansiList(data);
    } catch (err) {
      setToast({ message: 'Gagal mengambil data instansi', type: 'error' });
    }
  };

  const fetchGuru = async (id) => {
    try {
      const data = await getUsers(id, 'guru');
      setUserList(data);
    } catch (err) {
      setToast({ message: 'Gagal mengambil data guru', type: 'error' });
    }
  };

  const fetchKelas = async (id) => {
    try {
      const data = await getKelas(id);
      setKelasList(data);
    } catch (err) {
      setToast({ message: 'Gagal mengambil data kelas', type: 'error' });
    }
  };

  const handleLoginGuru = async (e) => {
    e.preventDefault();
    if (!selectedInstansi || !guruId || !kodeUnik) return;
    setLoading(true);
    try {
      const res = await loginGuru(selectedInstansi, guruId, kodeUnik);
      if (res.status === 'success') {
        const instansiName = instansiList?.find(i => String(i.id) === String(selectedInstansi))?.nama;
        localStorage.setItem('user_session', JSON.stringify({
          ...res.data,
          instansi: instansiName || 'Instansi'
        }));
        navigate('/dashboard-guru');
      } else {
        setToast({ message: 'Kode unik salah', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Login gagal, periksa koneksi', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSiswa = async (e) => {
    e.preventDefault();
    if (!selectedInstansi || !siswaNama || !siswaKelas) return;
    setLoading(true);
    try {
      const res = await registerSiswa({
        nama: siswaNama,
        kelas: siswaKelas,
        instansi_id: selectedInstansi,
        nisn: siswaNisn
      });
      if (res.status === 'success') {
        const instansiName = instansiList?.find(i => String(i.id) === String(selectedInstansi))?.nama;
        localStorage.setItem('user_session', JSON.stringify({
          ...res.data,
          role: 'siswa', // Ensure role is set
          instansi: instansiName || 'Instansi'
        }));
        navigate('/dashboard-siswa');
      }
    } catch (err) {
      setToast({ message: 'Pendaftaran gagal', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary-dark text-white w-1/2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="grid grid-cols-6 gap-4 p-8">
                {[...Array(24)].map((_, i) => <BookOpen key={i} className="w-12 h-12" />)}
             </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-accent-yellow p-3 rounded-2xl shadow-lg rotate-3">
                 <BookOpen className="w-10 h-10 text-primary-dark" />
               </div>
               <h1 className="text-3xl font-black tracking-tighter">PR SEKOLAH</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Kelola Tugas <br />
              <span className="text-accent-yellow">Lebih Modern & Teratur.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm">
              Platform manajemen pekerjaan rumah terbaik untuk mempererat koordinasi guru, siswa, dan orang tua.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-4 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
             <div className="bg-accent-wa p-3 rounded-xl">
                <Users className="w-6 h-6 text-white" />
             </div>
             <div>
                <p className="text-sm font-medium text-slate-300 italic">"Membantu memantau perkembangan belajar anak dengan notifikasi WhatsApp yang praktis."</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Masuk ke Sistem</h3>
            <p className="text-slate-500">Pilih peran Anda untuk melanjutkan</p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('guru')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeTab === 'guru' ? 'bg-white text-primary-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={18} /> GURU
            </button>
            <button
              onClick={() => setActiveTab('siswa')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${activeTab === 'siswa' ? 'bg-white text-primary-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={18} /> SISWA
            </button>
          </div>

          <form onSubmit={activeTab === 'guru' ? handleLoginGuru : handleRegisterSiswa} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Instansi</label>
              <div className="relative">
                <School className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                <select
                  className="input pl-12 bg-slate-50 border-slate-200"
                  value={selectedInstansi}
                  onChange={(e) => setSelectedInstansi(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Instansi / Sekolah --</option>
                  {instansiList?.map(i => (
                    <option key={i.id} value={i.id}>{i.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeTab === 'guru' ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Guru</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                    <select
                      className="input pl-12 bg-slate-50 border-slate-200"
                      value={guruId}
                      onChange={(e) => setGuruId(e.target.value)}
                      disabled={!selectedInstansi}
                      required
                    >
                      <option value="">-- Pilih Nama Anda --</option>
                      {userList?.map(u => (
                        <option key={u.id} value={u.id}>{u.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kode Unik (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      className="input pl-12 bg-slate-50 border-slate-200"
                      placeholder="Masukkan kode unik anda"
                      value={kodeUnik}
                      onChange={(e) => setKodeUnik(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      className="input pl-12 bg-slate-50 border-slate-200"
                      placeholder="Masukkan nama lengkap"
                      value={siswaNama}
                      onChange={(e) => setSiswaNama(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kelas</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                    <select
                      className="input pl-12 bg-slate-50 border-slate-200"
                      value={siswaKelas}
                      onChange={(e) => setSiswaKelas(e.target.value)}
                      disabled={!selectedInstansi}
                      required
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList?.map(k => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">NISN (Opsional)</label>
                  <input
                    type="text"
                    className="input bg-slate-50 border-slate-200"
                    placeholder="Masukkan NISN jika ada"
                    value={siswaNisn}
                    onChange={(e) => setSiswaNisn(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-dark/20"
              disabled={loading}
            >
              {loading ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk Sekarang <ChevronRight size={20} /></>
              )}
            </Button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Login;
