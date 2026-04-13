import React from 'react';
import { Book, Download, Eye, Edit2, Trash2, Send } from 'lucide-react';
import { getMapelGradient, getCoverInitials, getCategoryColor } from '../utils/bookHelper';

export const BukuCard = ({ buku, role, onEdit, onDelete, onNotif, onClick }) => {
  const isGuru = role === 'guru';

  return (
    <div className="group relative bg-slate-800/40 rounded-3xl border border-white/5 overflow-hidden hover:border-accent-yellow/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent-yellow/5 flex flex-col h-full">
      {/* Cover Section */}
      <div 
        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={() => onClick(buku)}
      >
        {buku.cover_url ? (
          <img 
            src={buku.cover_url} 
            alt={buku.judul}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{ background: getMapelGradient(buku.mapel) }}
          >
            <span className="text-4xl font-black text-white/90 drop-shadow-2xl uppercase tracking-tighter">
              {getCoverInitials(buku.judul)}
            </span>
            <div className="mt-4 flex flex-col items-center">
              <Book className="w-8 h-8 text-white/20 mb-2" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{buku.mapel}</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md uppercase tracking-widest ${getCategoryColor(buku.kategori)}`}>
          {buku.kategori}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={(e) => { e.stopPropagation(); window.open(buku.file_url, '_blank'); }}
             className="p-4 bg-accent-yellow text-primary-dark rounded-2xl hover:scale-110 transition-transform shadow-xl"
             title="Baca Online"
           >
             <Eye size={20} />
           </button>
           <a 
             href={buku.file_url} 
             download 
             onClick={(e) => e.stopPropagation()}
             className="p-4 bg-white text-primary-dark rounded-2xl hover:scale-110 transition-transform shadow-xl"
             title="Download"
           >
             <Download size={20} />
           </a>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-white font-black text-base line-clamp-2 leading-tight mb-2 uppercase tracking-tight group-hover:text-accent-yellow transition-colors">
          {buku.judul}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{buku.mapel}</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span className="text-[10px] font-bold text-accent-yellow/70 uppercase tracking-widest">Kelas {buku.kelas === 'Semua Kelas' ? 'SEMUA' : buku.kelas}</span>
        </div>

        <p className="text-xs text-slate-400 font-medium mb-4 italic">
          Karya: {buku.penulis || 'Anonim'}
        </p>

        {/* Guru Actions */}
        {isGuru && (
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(buku)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Edit Buku"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(buku.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Hapus Buku"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <button 
              onClick={() => onNotif(buku)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow hover:text-primary-dark rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border border-accent-yellow/20"
            >
              <Send size={12} /> Kirim WA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
