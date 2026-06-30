"# Rental Kamera - Kelompok 3" 
- Achmaddany Rozaqy | NPM: 2313020033 (UI Design, Lead, Frontend, Backend)
- Rahmat Nuril Mustofa | NPM: 2313020190 (Co-lead, Backend, database engineering)
- Muhammad Rizky Abdillah | NPM: 2313020176 (Backend)
- M. Fanny Dimas Efendi | NPM: 2313020282(Frontend)
- Hamdani Syahdan Maulana | ?

# Yukirent Cam ✦
**Sistem Manajemen Penyewaan Kamera & Peralatan Profesional**

Yukirent Cam adalah platform manajemen penyewaan kamera dan peralatan fotografi berbasis web yang dibangun untuk mempermudah proses booking pelanggan serta manajemen inventaris bagi admin.

## 🚀 Key Features

### Admin Dashboard
* **Role-Based Access**: Sistem login satu pintu yang membedakan akses antara Admin dan Pelanggan.
* **Inventory Management**: Manajemen data kamera dan peralatan (CRUD: Create, Read, Update, Delete).
* **Transaction Tracking**: Pemantauan status booking pelanggan (Menunggu Pembayaran, Aktif, Selesai).
* **User Management**: Pengawasan data pelanggan yang terdaftar.

### Customer Features
* **Easy Booking**: Katalog produk yang interaktif.
* **User Dashboard**: Riwayat booking dan poin reward pelanggan.

## 🛠 Tech Stack

* **Backend**: Laravel (PHP) - *Restful API*
* **Frontend**: React.js
* **Database**: MySQL
* **Styling**: Custom CSS (Utility-first inspired)

## 📦 Getting Started

### Prerequisites
Pastikan kamu sudah menginstall:
- PHP (v8.x recommended)
- Composer
- Node.js & NPM
- MySQL/MariaDB

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/username/yukirent-cam.git](https://github.com/username/yukirent-cam.git)
    cd yukirent-cam
    ```

2.  **Backend Setup**
    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    ```
    *Sesuaikan database di file `.env` kamu.*

3.  **Frontend Setup**
    ```bash
    npm install
    npm run dev
    ```

4.  **Database Migration & Seeding**
    ```bash
    php artisan migrate:fresh --seed
    ```

5.  **Run the App**
    ```bash
    php artisan serve
    ```

## 📂 Project Structure
* `/resources/js`: Berisi file React (`admin.jsx`, `customer.jsx`).
* `/database/migrations`: Skema database (Users, Rentals, Cameras, etc).
* `/routes`: Definisi jalur API dan Web.

---
*Dibuat untuk Project Manajemen Penyewaan Kamera.*
