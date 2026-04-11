import React from 'react';
import { Edit2, Trash2, Send, CheckCircle, Clock } from 'lucide-react';
import { formatDate, getDeadlineColor } from '../utils/dateHelper';
import Badge from './Badge';

export const PRTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">No</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Mapel</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Kelas</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Judul PR</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">Deadline</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">WA</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(data?.length || 0) === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic">
                Tidak ada data PR ditemukan
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{index + 1}</td>
                <td className="px-6 py-4">
                   <Badge color="blue">{item.mapel}</Badge>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{item.kelas}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{item.judul}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">{item.deskripsi}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <Badge color={getDeadlineColor(item.deadline)} className="uppercase">
                     {formatDate(item.deadline)}
                   </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    {item.wa_sent ? (
                      <Badge color="green" className="flex items-center gap-1">
                        <CheckCircle size={12} /> Terkirim
                      </Badge>
                    ) : (
                      <Badge color="yellow" className="flex items-center gap-1">
                        <Clock size={12} /> Pending
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-primary-light hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit PR"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(item?.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Hapus PR"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
