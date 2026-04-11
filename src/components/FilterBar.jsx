import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const FilterBar = ({ 
  kelasList = [], 
  selectedKelas, 
  setSelectedKelas, 
  searchQuery, 
  setSearchQuery,
  onRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari judul PR atau deskripsi..."
          className="input pl-12 border-slate-200 bg-slate-50 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            className="input pl-9 py-2 text-sm border-slate-200 bg-slate-50 w-full"
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
          >
            <option value="">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k.id} value={k.nama}>{k.nama}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={onRefresh}
          className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
