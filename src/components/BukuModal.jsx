import React from 'react';
import { Modal } from './Modal';
import { Book, Download, Eye, ExternalLink, Calendar, User, Building, MapPin } from 'lucide-react';
import { getMapelGradient, getCoverInitials, getCategoryColor } from '../utils/bookHelper';

export const BukuModal = ({ buku, isOpen, onClose }) => {
  if (!buku) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Materi / Buku">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Cover */}
        <div className="w-full md:w-1/3 shrink-0">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white/10 sticky top-0">
            {buku.cover_url ? (
              <img src={buku.cover_url} alt={buku.judul} className="w-full h-full object-cover" />
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                style={{ background: getMapelGradient(buku.mapel) }}
              >
                <span className="text-5xl font-black text-white/90 uppercase tracking-tighter">
                  {getCoverInitials(buku.judul)}
                </span>
                <span className="mt-6 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{buku.mapel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-6">
          <div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest mb-4 ${getCategoryColor(buku.kategori)}`}>
              {buku.kategori}
            </div>
            <h2 className="text-3xl font-black text-slate-800 leading-tight uppercase tracking-tight">
              {buku.judul}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Penulis</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                   <User size={14} className="text-slate-400" />
                   <span>{buku.penulis || 'Anonim'}</span>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Penerbit</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                   <Building size={14} className="text-slate-400" />
                   <span>{buku.penerbit || '-'}</span>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun Terbit</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                   <Calendar size={14} className="text-slate-400" />
                   <span>{buku.tahun || '-'}</span>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapel • Kelas</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                   <Book size={14} className="text-slate-400" />
                   <span>{buku.mapel} • {buku.kelas === 'Semua Kelas' ? 'Semua' : buku.kelas}</span>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Materi</span>
             <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-slate-200 pl-4 py-1">
                {buku.deskripsi || "Tidak ada deskripsi untuk buku ini."}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
             <button 
               onClick={() => window.open(buku.file_url, '_blank')}
               className="flex-1 flex items-center justify-center gap-3 bg-primary-dark text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg overflow-hidden active:scale-95"
             >
                <Eye size={20} className="text-accent-yellow" />
                Baca Online
             </button>
             <a 
               href={buku.file_url} 
               download
               className="flex-1 flex items-center justify-center gap-3 bg-white text-primary-dark border-2 border-slate-100 h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
             >
                <Download size={20} />
                Download PDF
             </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
