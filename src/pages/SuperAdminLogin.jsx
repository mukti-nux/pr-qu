import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '../services/api';
import { Button } from '../components/Button';
import { Toast } from '../components/Modal';
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginSuperAdmin(username, password);
      if (res.status === 'success') {
        localStorage.setItem('superadmin_session', JSON.stringify(res.data));
        navigate('/super-admin');
      } else {
        setToast({ message: 'Username atau Password salah', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Gagal menghubungkan ke server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-purple-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-3xl shadow-lg shadow-purple-600/20 mb-6 rotate-3">
               <ShieldAlert size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Super Admin</h1>
            <p className="text-slate-400 font-medium">Sistem Manajemen PR Sekolah</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  className="w-full bg-[#0f172a]/50 border border-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none transition-all placeholder:text-slate-600"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  className="w-full bg-[#0f172a]/50 border border-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none transition-all placeholder:text-slate-600"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                 <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>MASUK KE PANEL <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminLogin;
