import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Sparkles, Loader2, Link, Book, Tag, Image as ImageIcon, Send } from 'lucide-react';
import { generateBukuAI } from '../services/api';

export const BukuFormModal = ({ isOpen, onClose, onSave, initialData, mapelList, kelasList }) => {
  const [formData, setFormData] = useState({
    judul: '', penulis: '', penerbit: '', tahun: '',
    mapel: '', kelas: '', kategori: 'Buku Pelajaran',
    file_url: '', cover_url: '', deskripsi: '',
    kirim_wa: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        judul: '', penulis: '', penerbit: '', tahun: '',
        mapel: '', kelas: '', kategori: 'Buku Pelajaran',
        file_url: '', cover_url: '', deskripsi: '',
        kirim_wa: true
      });
    }
  }, [initialData, isOpen]);

  const handleGenerateAI = async () => {
    if (!formData.judul) return;
    setIsGenerating(true);
    try {
      const aiData = await generateBukuAI(formData.judul);
      if (aiData) {
        setFormData(prev => ({
          ...prev,
          penulis: aiData.penulis || prev.penulis,
          penerbit: aiData.penerbit || prev.penerbit,
          tahun: aiData.tahun || prev.tahun,
          mapel: aiData.mapel || prev.mapel,
          kategori: aiData.kategori || prev.kategori,
          deskripsi: aiData.deskripsi || prev.deskripsi
        }));
      }
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Buku' : 'Upload Buku Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Section 1: Main Info */}
           <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">URL PDF (GitHub/Gdrive)</label>
                <div className="relative">
                   <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                     type="url" required placeholder="https://..."
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold"
                     value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})}
                   />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Judul Buku</label>
                <div className="flex gap-2">
                   <input 
                     type="text" required placeholder="Contoh: Matematika Kelas IX"
                     className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold"
                     value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})}
                   />
                   <button 
                     type="button"
                     disabled={!formData.judul || isGenerating}
                     onClick={handleGenerateAI}
                     className="px-6 rounded-2xl bg-primary-dark text-white hover:bg-slate-800 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 group shadow-lg"
                   >
                     {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-accent-yellow group-hover:rotate-12 transition-transform" />}
                     <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">AI</span>
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Penulis</label>
                    <input 
                      type="text" placeholder="Nama Penulis"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.penulis} onChange={e => setFormData({...formData, penulis: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Penerbit</label>
                    <input 
                      type="text" placeholder="Penerbit"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.penerbit} onChange={e => setFormData({...formData, penerbit: e.target.value})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tahun</label>
                    <input 
                      type="text" placeholder="2024"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}
                    >
                      <option value="Buku Pelajaran">Buku Pelajaran</option>
                      <option value="Referensi">Referensi</option>
                      <option value="LKS & Modul">LKS & Modul</option>
                      <option value="Fiksi">Fiksi</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Section 2: Mapping & Detail */}
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mata Pelajaran</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.mapel} onChange={e => setFormData({...formData, mapel: e.target.value})}
                    >
                      <option value="">-- Pilih --</option>
                      {mapelList?.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Kelas</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold text-sm"
                      value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})}
                    >
                      <option value="">-- Pilih --</option>
                      <option value="Semua Kelas">Semua Kelas</option>
                      {kelasList?.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">URL Cover (Opsional)</label>
                <div className="relative">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                     type="url" placeholder="https://..."
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-800 outline-none focus:ring-4 focus:ring-primary-dark/5 font-bold"
                     value={formData.cover_url} onChange={e => setFormData({...formData, cover_url: e.target.value})}
                   />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deskripsi Ringkas</label>
                <textarea 
                  rows="3" placeholder="AI akan membantu mengisi ini..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 outline-none focus:ring-4 focus:ring-primary-dark/5 font-medium text-sm italic"
                  value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                 <input 
                   type="checkbox" 
                   checked={formData.kirim_wa} onChange={e => setFormData({...formData, kirim_wa: e.target.checked})}
                   className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary-dark focus:ring-0 checked:bg-primary-dark"
                 />
                 <span className="text-sm font-bold text-slate-500 group-hover:text-primary-dark transition-colors flex items-center gap-2">
                    <Send size={14} /> Kirim notifikasi ke grup WhatsApp kelas
                 </span>
              </label>
           </div>
        </div>

        <div className="flex gap-4 pt-4">
           <Button type="button" variant="outline" className="flex-1 rounded-2xl h-14" onClick={onClose}>Batal</Button>
           <Button type="submit" className="flex-1 bg-primary-dark text-white rounded-2xl h-14 font-black uppercase tracking-widest">
             {initialData ? 'Perbarui Buku' : 'Simpan Buku'}
           </Button>
        </div>
      </form>
    </Modal>
  );
};
