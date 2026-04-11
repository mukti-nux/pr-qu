import axios from 'axios';

const BASE_URL = 'https://n8n.muktilabs.my.id/webhook';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// AUTH
export const loginGuru = (instansi_id, user_id, kode_unik) =>
  api.post('/login', { instansi_id, user_id, kode_unik }).then(r => r.data);

export const registerSiswa = (payload) =>
  api.post('/register-siswa', payload).then(r => r.data);

export const loginSuperAdmin = (username, password) =>
  api.post('/superadmin-login', { username, password }).then(r => r.data);

// INSTANSI
export const getInstansi = () =>
  api.get('/get-instansi').then(r => r.data.data);

export const addInstansi = (payload) =>
  api.post('/add-instansi', payload).then(r => r.data);

export const updateInstansi = (payload) =>
  api.post('/update-instansi', payload).then(r => r.data);

export const deleteInstansi = (id) =>
  api.post('/delete-instansi', { id }).then(r => r.data);

// USERS
export const getUsers = (instansi_id, role, kelas = '') =>
  api.get(`/get-users?instansi_id=${instansi_id}&role=${role}${kelas ? `&kelas=${kelas}` : ''}`)
    .then(r => r.data.data);

export const addGuru = (payload) =>
  api.post('/add-guru', payload).then(r => r.data);

export const updateGuru = (payload) =>
  api.post('/update-guru', payload).then(r => r.data);

export const deleteUser = (id) =>
  api.post('/delete-guru', { id }).then(r => r.data);

// KELAS
export const getKelas = (instansi_id) =>
  api.get(`/get-kelas?instansi_id=${instansi_id}`).then(r => r.data.data);

export const addKelas = (nama, instansi_id) =>
  api.post('/add-kelas', { nama, instansi_id }).then(r => r.data);

export const deleteKelas = (id, instansi_id) =>
  api.post('/delete-kelas', { id, instansi_id }).then(r => r.data);

// MAPEL
export const getMapel = (instansi_id) =>
  api.get(`/get-mapel?instansi_id=${instansi_id}`).then(r => r.data.data);

export const addMapel = (nama, instansi_id) =>
  api.post('/add-mapel', { nama, instansi_id }).then(r => r.data);

export const deleteMapel = (id, instansi_id) =>
  api.post('/delete-mapel', { id, instansi_id }).then(r => r.data);

// PR
export const getPR = (kelas, instansi_id) =>
  api.get(`/get-pr?kelas=${kelas}&instansi_id=${instansi_id}`).then(r => r.data.data);

export const getPRAllKelas = async (instansi_id) => {
  const kelasList = await getKelas(instansi_id);
  const results = await Promise.all(
    kelasList.map(k => getPR(k.nama, instansi_id).catch(() => []))
  );
  return results.flat();
};

export const createPR = (payload) =>
  api.post('/create-pr', payload).then(r => r.data);

export const updatePR = (payload) =>
  api.post('/update-pr', payload).then(r => r.data);

export const deletePR = (id) =>
  api.post('/delete-pr', { id }).then(r => r.data);

// WHATSAPP
export const kirimWA = (payload) =>
  api.post('/kirim-wa', payload).then(r => r.data);

export const getWAGroups = (instansi_id) =>
  api.get(`/get-wa-groups?instansi_id=${instansi_id}`).then(r => r.data.data);

export const updateWAGroup = (payload) =>
  api.post('/update-wa-group', payload).then(r => r.data);

export const getWALogs = (instansi_id) =>
  api.get(`/get-wa-logs?instansi_id=${instansi_id}`).then(r => r.data.data);

export default api;
