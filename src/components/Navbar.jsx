import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, BookOpen, Bell, Settings, User } from 'lucide-react';
import { Button } from './Button';

export const Navbar = () => {
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem('user_session') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  return (
    <nav className="bg-primary-dark text-white sticky top-0 z-[4000] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to={session.role === 'guru' ? '/dashboard-guru' : '/dashboard-siswa'} className="flex items-center gap-2">
              <div className="bg-accent-yellow p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-dark" />
              </div>
              <span className="text-xl font-bold tracking-tight">PR SEKOLAH</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {session.role === 'guru' && (
              <>
                <Link to="/dashboard-guru" className="text-sm font-medium hover:text-accent-yellow transition-colors">Dashboard</Link>
                <Link to="/manajemen" className="text-sm font-medium hover:text-accent-yellow transition-colors">Manajemen</Link>
                <Link to="/notifikasi-wa" className="text-sm font-medium hover:text-accent-yellow transition-colors">Log WhatsApp</Link>
              </>
            )}
            {session.role === 'siswa' && (
              <span className="text-sm font-medium text-slate-300">Kelas {session.kelas}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold tracking-wide">{session.nama}</span>
              <span className="text-[10px] text-accent-yellow uppercase font-black">{session.instansi}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-accent-yellow/50 shadow-inner">
              <User className="w-6 h-6 text-slate-300" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500 rounded-xl transition-all group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
