export const getMapelGradient = (mapel) => {
  const gradients = {
    'matematika'      : 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    'ipa'             : 'linear-gradient(135deg, #064e3b, #10b981)',
    'bahasa indonesia': 'linear-gradient(135deg, #7f1d1d, #ef4444)',
    'bahasa inggris'  : 'linear-gradient(135deg, #4c1d95, #8b5cf6)',
    'ips'             : 'linear-gradient(135deg, #7c2d12, #f97316)',
    'pai'             : 'linear-gradient(135deg, #14532d, #22c55e)',
    'pkn'             : 'linear-gradient(135deg, #1e3a5f, #0ea5e9)',
    'bahasa jawa'     : 'linear-gradient(135deg, #422006, #d97706)',
    'pjok'            : 'linear-gradient(135deg, #1a2e05, #84cc16)',
  };
  const key = mapel?.toLowerCase() || '';
  return gradients[key] || 'linear-gradient(135deg, #1f2937, #6b7280)';
};

export const getCoverInitials = (judul) => {
  if (!judul) return 'BK';
  return judul.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

export const getCategoryColor = (kategori) => {
  const colors = {
    'Buku Pelajaran': 'bg-green-500/10 text-green-400 border-green-500/30',
    'Referensi': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'LKS & Modul': 'bg-red-500/10 text-red-400 border-red-500/30',
    'Fiksi': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  };
  return colors[kategori] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
};
