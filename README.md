<p align="center">
  <img src="public/logo.png" width="200" alt="MuktiLabs Logo">
</p>

# 📚 Sistem Manajemen PR Sekolah

Sistem Manajemen Pekerjaan Rumah (PR) Modern berbasis Web yang terintegrasi dengan Notifikasi WhatsApp Otomatis. Dirancang untuk mempermudah koordinasi antara Guru, Siswa, dan Instansi Pendidikan.

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Tailwind-blue)
![Integration](https://img.shields.io/badge/integration-n8n%20WhatsApp-green)

---

## ✨ Fitur Utama

### 👨‍🏫 Panel Guru
- **Manajemen PR**: Create, Read, Update, dan Delete (CRUD) Pekerjaan Rumah.
- **Preview WhatsApp**: Lihat pratinjau pesan sebelum dikirim ke grup kelas.
- **Log Notifikasi**: Pantau riwayat pengiriman notifikasi via WhatsApp.
- **Filter Kelas**: Memudahkan pencarian PR berdasarkan kelas spesifik.

### 🎓 Panel Siswa
- **Dashboard Interaktif**: Tampilan kartu tugas yang intuitif dan responsif.
- **Checklist PR**: Tandai tugas yang sudah selesai (`selesai`/`belum`).
- **Countdown Otomatis**: Menghitung waktu mundur pengerjaan PR berdasarkan deadline.

### 🔐 Panel Super Admin (Isolated)
- **Multi-Instansi**: Kelola banyak sekolah/lembaga dalam satu dashboard (Isolasi data 100%).
- **Manajemen Database**: CRUD Master Data (Guru, Siswa, Kelas, Mapel).
- **Konfigurasi WhatsApp**: Pengaturan ID Grup WhatsApp per kelas.
- **Monitoring Global**: Pantau statistik PR dan log pengiriman WhatsApp secara real-time.

---

## 🚀 Teknologi yang Digunakan

| Core | UI/UX | Analytics & Ops |
| --- | --- | --- |
| **React 18** (Vite) | **Tailwind CSS** | **n8n** (Automations) |
| **Axios** (API) | **Framer Motion** | **Lucide Icons** |
| **React Router 6** | **Glassmorphism UI** | **Local Storage Session** |

---

## 🛠️ Instalasi

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di sistem Anda.

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/pr-sekolah.git
   cd pr-sekolah
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Vite (Opsional)**
   Edit `vite.config.js` jika ingin menyesuaikan `allowedHosts` atau port server.

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

---

## 📁 Struktur Folder
```text
src/
├── components/     # Komponen UI Reusable (Navbar, Modal, Badge, dll)
├── pages/          # Halaman Utama (Login, Dashboard Guru/Siswa, SuperAdmin)
├── services/       # Integrasi API (Axios instance)
├── utils/          # Helper (Format tanggal, logika countdown)
└── assets/         # Resource statis (CSS, images)
```

---

## 🔌 Integrasi API & Backend
Sistem ini menggunakan **n8n Webhook** sebagai backend processing dengan struktur payload JSON.
- **Endpoint**: `https://n8n.muktilabs.my.id/webhook`
- **Response Format**: `{ status: "success", data: [...] }`
- **WhatsApp Provider**: Terhubung melalui n8n ke WhatsApp API Gateway.

---

## 📝 Catatan Penting
- Gunakan **kode unik** yang diberikan sekolah untuk login sebagai Guru.
- Siswa dapat mendaftar langsung melalui menu **Register Siswa** di halaman login.
- Untuk akses Super Admin, navigasikan ke route `/superadmin`.

---

## 👨‍💻 Kontribusi
Dibuat dengan ❤️ oleh **MuktiLabs** untuk kemajuan pendidikan Indonesia.

---
© 2026 muktilabs — Sistem Manajemen PR Cerdas.
