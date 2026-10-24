# CreatorTrack (Frontend)

CreatorTrack adalah aplikasi modern yang dirancang khusus bagi *content creator* untuk merencanakan, mengelola, melacak status, hingga menganalisis performa konten mereka di berbagai *channel* (seperti YouTube, dll.).

Proyek ini dibangun menggunakan **React**, **Vite**, **Tailwind CSS v4**, dan **React Router**, serta terhubung langsung dengan backend [be-cc](https://github.com/project-content-creator/be-cc).

---

## 🚀 Fitur Utama

- **Authentication System:** Registrasi, Login, dan proteksi rute halaman aman berbasis JWT.
- **Dashboard Overview:** Ringkasan statistik dan metrik konten secara *real-time*.
- **Content Management:** 
  - Membuat konten baru dengan detail deskripsi, format, dan *script*.
  - Menampilkan daftar konten (*Content List*) lengkap dengan fitur filter status dan *channel*.
  - Pop-up edit dan manajemen status publikasi.
- **Interactive Checklist:** Menambah, mencentang, dan menghapus *sub-item* checklist langsung di detail konten.
- **Pipeline Tracker:** Melacak progres konten dari tahap ide hingga terpublikasi.
- **Analytics & Channels:** Grafik performa analitik konten dan manajemen channel media sosial.
- **Settings & Theme Customization:** Pengaturan profil, ubah kata sandi, unggah foto, dan dukungan mode gelap/terang (*Dark/Light Mode*).

---

## 🛠️ Tech Stack

- **Framework:** React (SPA)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 & Lucide Icons
- **Routing:** React Router DOM
- **Form & Validation:** React Hook Form & Zod
- **HTTP Client:** Axios

---

# 👥 Kolaborator Proyek
Proyek kolaborasi ini dikembangkan oleh:

Frontend Developer: Inas Lathifah

Backend Developer: Astrid Nur

# 📜 Lisensi
Proyek ini bersifat pribadi/internal untuk keperluan manajemen konten kreator.

---

## ⚙️ Cara Menjalankan Proyek (Setup & Installation)

Ikuti langkah-langkah di bawah ini untuk menjalankan frontend di komputer lokal Anda:

### 1. Clone Repository
Pastikan Anda sudah meng-clone repository ini dan masuk ke dalam foldernya:
```bash
git clone [https://github.com/project-content-creator/fe-cc.git]
cd ./fe-cc
npm install
