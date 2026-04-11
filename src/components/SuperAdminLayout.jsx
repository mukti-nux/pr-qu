import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Building2, Users, GraduationCap, LayoutGrid, BookOpen, 
  MessageSquare, FileText, BarChart, LogOut, ShieldCheck
} from 'lucide-react';

export const SuperAdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem('superadmin_session') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('superadmin_session');
    navigate('/super-admin/login');
  };

  const menuItems = [
    { name: 'Instansi', icon: <Building2 size={20} />, id: 'instansi' },
    { name: 'Guru', icon: <Users size={20} />, id: 'guru' },
    { name: 'Siswa', icon: <GraduationCap size={20} />, id: 'siswa' },
    { name: 'Kelas', icon: <LayoutGrid size={20} />, id: 'kelas' },
    { name: 'Mapel', icon: <BookOpen size={20} />, id: 'mapel' },
    { name: 'Grup WhatsApp', icon: <MessageSquare size={20} />, id: 'wa-groups' },
    { name: 'Log WA', icon: <FileText size={20} />, id: 'wa-logs' },
    { name: 'Monitor PR', icon: <BarChart size={20} />, id: 'monitor-pr' },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e293b] border-r border-white/5 flex flex-col shadow-2xl overflow-y-auto">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-purple-600 p-2.5 rounded-2xl shadow-lg ring-4 ring-purple-600/10">
             <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-widest uppercase italic">SA Panel</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">PR SEKOLAH v1.0</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/super-admin#${item.id}`)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all group ${
                window.location.hash === `#${item.id}` || (!window.location.hash && item.id === 'instansi')
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                window.location.hash === `#${item.id}` || (!window.location.hash && item.id === 'instansi') ? 'scale-110' : ''
              }`}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 mx-4 mb-4 rounded-3xl bg-slate-900/50 mt-10">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 font-black">
                 {session.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-black text-white">{session.username}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Super Admin</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-black transition-all"
           >
             <LogOut size={16} /> LOGOUT
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0f172a]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#1e293b]/30 backdrop-blur-md">
           <h2 className="text-xl font-black text-white uppercase tracking-wider">
             {menuItems.find(m => `#${m.id}` === window.location.hash)?.name || 'Instansi'}
           </h2>
           <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Server Online
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
