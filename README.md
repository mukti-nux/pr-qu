<p align="center">
  <img src="public/logo.png" width="200" alt="EduTask Logo">
</p>

<h1 align="center">📚 EduTask</h1>
<p align="center">
  <b>Sistem Manajemen Pekerjaan Rumah Modern dengan Notifikasi WhatsApp Otomatis</b><br/>
  Dirancang untuk mempermudah koordinasi antara Guru, Siswa, dan Instansi Pendidikan.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-purple"/>
  <img src="https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Tailwind-blue"/>
  <img src="https://img.shields.io/badge/backend-n8n%20Webhook-orange"/>
  <img src="https://img.shields.io/badge/database-PostgreSQL-336791"/>
  <img src="https://img.shields.io/badge/WA-Baileys%20Self--Hosted-25D366"/>
  <img src="https://img.shields.io/badge/multi--instansi-✓-green"/>
</p>

---

## ✨ Fitur Utama

### 👨‍🏫 Panel Guru
- **Manajemen PR**: Create, Read, Update, dan Delete (CRUD) Pekerjaan Rumah
- **Preview WhatsApp**: Lihat pratinjau pesan sebelum dikirim ke grup kelas
- **Notifikasi WA Otomatis**: Kirim PR baru langsung ke grup WhatsApp kelas
- **Log Notifikasi**: Pantau riwayat pengiriman notifikasi via WhatsApp
- **Filter & Search**: Filter PR berdasarkan kelas + pencarian judul realtime
- **Manajemen Kelas & Mapel**: Tambah/hapus kelas dan mata pelajaran

### 🎓 Panel Siswa
- **Dashboard Interaktif**: Tampilan kartu tugas yang intuitif dan responsif
- **Checklist PR**: Tandai tugas yang sudah selesai (`selesai`/`belum`)
- **Countdown Otomatis**: Hitung mundur deadline PR secara realtime
- **Register Mandiri**: Siswa bisa daftar sendiri tanpa perlu akun dari admin
- **Color Coding**: Warna kartu berdasarkan urgensi deadline

### 🔐 Panel Super Admin
- **Multi-Instansi**: Kelola banyak sekolah dalam satu dashboard (isolasi data 100%)
- **CRUD Lengkap**: Kelola Guru, Siswa, Kelas, Mapel, dan Instansi
- **Konfigurasi Grup WA**: Setting Group ID WhatsApp per kelas per instansi
- **Monitor PR Global**: Pantau semua PR lintas kelas dan instansi
- **Log WA Global**: Riwayat lengkap pengiriman notifikasi
- **Export CSV**: Export log notifikasi ke file CSV

### 🤖 Otomasi
- **Reminder Harian**: Cron job otomatis jam 07:00 kirim reminder ke grup WA untuk PR yang deadline besok
- **Auto Reconnect WA**: Bot WhatsApp reconnect otomatis jika terputus

---

## 🚀 Teknologi

| Layer | Teknologi |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Animasi** | Framer Motion |
| **Icons** | Lucide React |
| **Tanggal** | date-fns (dengan locale Indonesia) |
| **Backend/Workflow** | n8n (self-hosted) |
| **Database** | PostgreSQL 14 |
| **WA Gateway** | Baileys (self-hosted REST API) |
| **Reverse Proxy** | Nginx / Caddy |
| **Session** | localStorage (tanpa JWT) |

---

## 🏗️ Arsitektur Sistem

```
Frontend (React)
      ↓
n8n Webhook (https://n8n.muktilabs.my.id/webhook)
      ↓
PostgreSQL (Database)
      ↓
Baileys WA Bot (http://localhost:3001)
      ↓
WhatsApp Grup Kelas
```

**Flow Reminder Harian:**
```
Cron 07:00 → n8n → PostgreSQL (cari PR deadline besok) → Baileys → WA Grup
```

---

## 🗄️ Skema Database

```
instansi          → Data sekolah/lembaga
users             → Guru & Siswa (terikat instansi)
kelas             → Daftar kelas per instansi
mapel             → Daftar mata pelajaran per instansi
pr                → Data pekerjaan rumah
submissions       → Pengumpulan tugas siswa
wa_groups         → Mapping kelas → Group ID WA per instansi
wa_logs           → Riwayat pengiriman notifikasi WA
super_admin       → Akun super administrator
```

> Semua tabel (kecuali `instansi` dan `super_admin`) memiliki kolom `instansi_id`
> sebagai foreign key untuk memastikan isolasi data 100% antar sekolah.

---

## 🌐 API Endpoints

**Base URL:** `https://n8n.muktilabs.my.id/webhook`

**Response format semua endpoint:**
```json
{ "status": "success", "data": [...] }
```

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/login` | Login guru |
| POST | `/register-siswa` | Register/login siswa |
| POST | `/superadmin-login` | Login super admin |
| GET | `/get-instansi` | Daftar semua instansi |
| GET | `/get-users?instansi_id=X&role=guru` | Daftar guru/siswa per instansi |
| GET | `/get-kelas?instansi_id=X` | Daftar kelas per instansi |
| GET | `/get-mapel?instansi_id=X` | Daftar mapel per instansi |
| GET | `/get-pr?kelas=X&instansi_id=Y` | Daftar PR per kelas & instansi |
| POST | `/create-pr` | Buat PR baru |
| POST | `/update-pr` | Update PR |
| POST | `/delete-pr` | Hapus PR |
| POST | `/kirim-wa` | Kirim notifikasi WA |
| GET | `/get-wa-groups?instansi_id=X` | Daftar grup WA per instansi |
| POST | `/update-wa-group` | Update/tambah grup WA |
| GET | `/get-wa-logs?instansi_id=X` | Log notifikasi WA |
| POST | `/add-guru` | Tambah guru |
| POST | `/update-guru` | Edit guru |
| POST | `/delete-guru` | Hapus guru/siswa |
| POST | `/add-kelas` | Tambah kelas |
| POST | `/delete-kelas` | Hapus kelas |
| POST | `/add-mapel` | Tambah mapel |
| POST | `/delete-mapel` | Hapus mapel |
| POST | `/add-instansi` | Tambah instansi/sekolah baru |
| POST | `/update-instansi` | Edit instansi |
| POST | `/delete-instansi` | Hapus instansi |

---

## 📱 WA Bot Endpoints (Baileys)

**Base URL:** `http://localhost:3001`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/status` | Cek status koneksi WA |
| GET | `/qr` | Tampilkan QR Code untuk scan (browser) |
| POST | `/send` | Kirim pesan ke nomor/grup |
| POST | `/logout` | Logout dari WA |

**Contoh kirim pesan ke grup:**
```bash
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{"target": "628xxx@g.us", "message": "Halo grup!"}'
```

**Format Group ID WA:** `628xxx@g.us`
**Format Personal:** `628xxx@s.whatsapp.net`

---

## 📁 Struktur Folder

```
peer-otomatis/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── FilterBar.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── PRCard.jsx
│   │   ├── PRModal.jsx
│   │   ├── PRTable.jsx
│   │   ├── SuperAdminLayout.jsx
│   │   ├── Toast.jsx
│   │   ├── Toggle.jsx
│   │   ├── WALogTable.jsx
│   │   └── WAPreviewModal.jsx
│   ├── pages/
│   │   ├── DashboardGuru.jsx
│   │   ├── DashboardSiswa.jsx
│   │   ├── Login.jsx
│   │   ├── Manajemen.jsx
│   │   ├── NotifikasiWA.jsx
│   │   ├── SuperAdmin.jsx
│   │   └── SuperAdminLogin.jsx
│   ├── services/
│   │   └── api.js          ← Semua fungsi fetch API
│   ├── utils/
│   │   └── dateHelper.js   ← Format tanggal & countdown
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── wa-baileys/
│   ├── index.js            ← WA Bot REST API (Baileys)
│   ├── session/            ← Session Baileys (jangan di-commit!)
│   └── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠️ Instalasi & Setup

### Prasyarat
- Node.js 18+
- PostgreSQL 14+
- n8n (self-hosted)
- Domain + SSL (untuk production)

### 1. Clone & Install Frontend
```bash
git clone https://github.com/mukti-nux/peer-otomatis.git
cd peer-otomatis
npm install
npm run dev
```

### 2. Setup PostgreSQL
```bash
# Buat user & database
sudo -u postgres psql
```
```sql
CREATE USER pr_user WITH PASSWORD 'your_password';
CREATE DATABASE pr_sekolah OWNER pr_user;
GRANT ALL PRIVILEGES ON DATABASE pr_sekolah TO pr_user;
\q
```
```bash
# Masuk dan jalankan schema
sudo -u postgres psql -d pr_sekolah
```
Jalankan script SQL untuk membuat semua tabel dan seed data awal.

### 3. Konfigurasi PostgreSQL untuk Docker n8n
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
```
Tambahkan:
```
host    pr_sekolah    pr_user    172.17.0.0/16    md5
host    pr_sekolah    pr_user    172.18.0.0/16    md5
```
```bash
sudo systemctl restart postgresql
```

### 4. Setup WA Bot (Baileys)
```bash
cd wa-baileys
npm install
node index.js
```
Buka browser → `http://IP_SERVER:3001/qr` → Scan QR dengan WhatsApp.

### 5. Konfigurasi n8n
- Tambah credential PostgreSQL di n8n (Settings → Credentials)
- Buat semua workflow sesuai dokumentasi
- Aktifkan semua workflow (toggle **Published**)
- Pastikan BASE_URL workflow KIRIM WA mengarah ke Baileys:
```
URL    : http://localhost:3001/send
Method : POST
Body   : { "target": "{{ group_id }}", "message": "{{ pesan }}" }
```

---

## 👤 Cara Login

### Guru
1. Pilih instansi/sekolah dari dropdown
2. Pilih nama guru dari dropdown
3. Masukkan kode unik (diberikan oleh admin/super admin)
4. Klik **Masuk**

### Siswa
1. Pilih instansi/sekolah
2. Input nama lengkap
3. Pilih kelas
4. Input NISN (opsional)
5. Klik **Masuk** (otomatis terdaftar ke database)

### Super Admin
- Akses: `https://domain.com/super-admin/login`
- Gunakan username & password yang tersimpan di tabel `super_admin`

---

## ➕ Menambah Sekolah Baru

1. Login ke Super Admin → Tab **Instansi** → Tambah Instansi
2. Tab **Guru** → pilih instansi baru → tambah guru
3. Tab **Kelas** → pilih instansi baru → tambah kelas
4. Tab **Mapel** → pilih instansi baru → tambah mapel
5. Tab **Grup WA** → input Group ID WA per kelas (setelah bot masuk ke grup)

Atau via SQL langsung:
```sql
-- 1. Tambah instansi
INSERT INTO instansi (nama, kode, alamat)
VALUES ('SMK Contoh', 'SMK-CONTOH', 'Jl. Contoh No.1');

-- 2. Tambah guru (ganti instansi_id sesuai id yang baru dibuat)
INSERT INTO users (nama, role, instansi_id, kode_unik)
VALUES ('Nama Guru', 'guru', ID_INSTANSI, 'kode_unik_guru');
```

---

## 🔧 Troubleshooting

| Problem | Solusi |
|---|---|
| Data tidak muncul di UI | Cek BASE_URL di `api.js`, pastikan `/webhook` bukan `/webhook-test` |
| WA tidak terkirim | Cek status bot: `curl http://localhost:3001/status` |
| Bot WA disconnect | Buka `http://IP:3001/qr` di browser dan scan ulang |
| Error 500 di endpoint n8n | Buka n8n → Executions → klik yang merah → cek node error |
| Workflow tidak jalan | Pastikan status **Published** di halaman Workflows n8n |
| Login guru gagal | Cek `kode_unik` di tabel `users` sudah benar |
| Data campur antar sekolah | Pastikan semua query n8n sudah filter `instansi_id` |
| PostgreSQL tidak bisa diakses Docker | Cek `pg_hba.conf` sudah ada range IP `172.17.0.0/16` dan `172.18.0.0/16` |
| Cannot read properties of undefined | Pastikan semua state array diinisialisasi `useState([])` bukan `useState(null)` |

---

## ⚠️ Keamanan

- File `wa-baileys/session/` **jangan di-commit** ke Git (tambahkan ke `.gitignore`)
- Ganti password super admin secara berkala
- Kode unik guru sebaiknya menggunakan NIP atau kode acak yang kuat
- Gunakan HTTPS untuk semua endpoint production
- Batasi akses port `3001` (WA Bot) hanya dari localhost/internal network
- Jangan expose endpoint n8n tanpa authentication di production

---

## 🗺️ Roadmap

- [ ] Upload file submission tugas siswa
- [ ] Dashboard statistik per instansi (chart jumlah PR, tingkat pengumpulan)
- [ ] Notifikasi email sebagai backup WA
- [ ] PWA (Progressive Web App) untuk siswa
- [ ] Role admin per instansi (bukan hanya super admin)
- [ ] Docker Compose full stack (frontend + n8n + PostgreSQL + WA Bot)
- [ ] API rate limiting & keamanan tambahan
- [ ] Fitur komentar/feedback guru pada tugas siswa

---

## 👨‍💻 Kontribusi

Dibuat dengan ❤️ oleh **MuktiLabs** untuk kemajuan pendidikan Indonesia.

Pull request dan issue sangat disambut! Untuk perubahan besar, buka issue terlebih dahulu untuk mendiskusikan apa yang ingin diubah.

---

## 📄 Lisensi

MIT License © 2026 [MuktiLabs](https://muktilabs.my.id)

---

<p align="center">
  <b>EduTask</b> — Otomasi PR, Fokus Belajar 🎓<br/>
  <a href="https://muktilabs.my.id">muktilabs.my.id</a>
</p>
