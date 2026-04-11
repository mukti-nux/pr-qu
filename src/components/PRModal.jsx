import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Book, Users, Type, AlignLeft, Calendar, Send } from 'lucide-react';

export const PRModal = ({ isOpen, onClose, onSave, editData, mapelList, kelasList }) => {
  const [formData, setFormData] = useState({
    mapel: '',
    kelas: '',
    judul: '',
    deskripsi: '',
    deadline: '',
    kirim_wa: true
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        deadline: editData.deadline.substring(0, 10),
        kirim_wa: false // Default to false when editing existing
      });
    } else {
      setFormData({
        mapel: '',
        kelas: '',
        judul: '',
        deskripsi: '',
        deadline: '',
        kirim_wa: true
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? 'Edit Pekerjaan Rumah' : 'Tambah PR Baru'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mata Pelajaran</label>
            <div className="relative">
              <Book className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
              <select
                className="input pl-12 bg-slate-50 border-slate-200"
                value={formData.mapel}
                onChange={(e) => setFormData({...formData, mapel: e.target.value})}
                required
              >
                <option value="">-- Pilih Mapel --</option>
                {mapelList.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Kelas</label>
            <div className="relative">
              <Users className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
              <select
                className="input pl-12 bg-slate-50 border-slate-200"
                value={formData.kelas}
                onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                required
              >
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Judul Tugas</label>
          <div className="relative">
            <Type className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="input pl-12 bg-slate-50 border-slate-200"
              placeholder="Contoh: Latihan Soal Bab 3"
              value={formData.judul}
              onChange={(e) => setFormData({...formData, judul: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Detail</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <textarea
              className="input pl-12 bg-slate-50 border-slate-200 min-h-[120px] py-3"
              placeholder="Sebutkan soal nomor berapa saja atau detail pengerjaan..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              required
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Batas Pengumpulan (Deadline)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="date"
              className="input pl-12 bg-slate-50 border-slate-200"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              required
            />
          </div>
        </div>

        {!editData && (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <input 
              type="checkbox" 
              id="kirim_wa"
              className="w-5 h-5 rounded accent-accent-wa"
              checked={formData.kirim_wa}
              onChange={(e) => setFormData({...formData, kirim_wa: e.target.checked})}
            />
            <label htmlFor="kirim_wa" className="text-sm font-bold text-green-700 cursor-pointer flex items-center gap-2">
              <Send size={16} /> Kirim notifikasi otomatis ke grup WhatsApp kelas
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" className="px-8">
            {editData ? 'Simpan Perubahan' : 'Buat PR Sekarang'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const WAPreviewModal = ({ isOpen, onClose, onConfirm, payload }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Pesan WhatsApp" size="sm">
      <div className="space-y-4">
        <div className="bg-[#E7FCE3] p-6 rounded-2xl border border-green-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 -mr-8 -mt-8 rounded-full"></div>
          <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {payload?.pesan}
          </pre>
        </div>
        <p className="text-xs text-slate-500 italic text-center">
          Pesan ini akan dikirimkan ke grup WA {payload?.kelas} secara otomatis.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="wa" className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-green-500/20" onClick={onConfirm}>
            <Send size={20} /> Konfirmasi & Kirim
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Nanti saja, simpan PR saja
          </Button>
        </div>
      </div>
    </Modal>
  );
};
