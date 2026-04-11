import React from 'react';
import Badge from './Badge';
import { formatDate, getCountdown, getDeadlineColor } from '../utils/dateHelper';
import { Book, Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const PRCard = ({ item, isFinished, onToggleStatus }) => {
  const countdown = getCountdown(item.deadline);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card flex flex-col h-full border-l-4 transition-all duration-300 ${
        isFinished ? 'border-l-green-400 opacity-80' : `border-l-${countdown.color}-500 shadow-lg`
      }`}
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <Badge color="blue" className="bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest px-3">
            {item.mapel}
          </Badge>
          <Badge color={countdown.color} className="flex items-center gap-1 font-black">
            <Clock size={12} /> {countdown.text}
          </Badge>
        </div>

        <h3 className={`text-xl font-black mb-3 leading-tight ${isFinished ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {item.judul}
        </h3>
        
        <p className={`text-sm mb-6 line-clamp-3 leading-relaxed ${isFinished ? 'text-slate-300' : 'text-slate-500'}`}>
          {item.deskripsi}
        </p>

        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest mt-auto">
          <Clock size={14} className="text-slate-300" />
          <span>Deadline: {formatDate(item.deadline)}</span>
        </div>
      </div>

      <div className={`p-4 border-t flex items-center justify-between transition-colors ${isFinished ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
        <span className={`text-xs font-black uppercase tracking-widest ${isFinished ? 'text-green-600' : 'text-slate-400'}`}>
          {isFinished ? 'Tugas Selesai' : 'Belum Selesai'}
        </span>
        <button
          onClick={() => onToggleStatus(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            isFinished 
            ? 'bg-green-500 text-white shadow-md shadow-green-200' 
            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-light shadow-sm'
          }`}
        >
          {isFinished ? (
            <><CheckCircle2 size={18} /> SELESAI</>
          ) : (
            <><Circle size={18} /> TANDAI SELESAI</>
          )}
        </button>
      </div>
    </motion.div>
  );
};
