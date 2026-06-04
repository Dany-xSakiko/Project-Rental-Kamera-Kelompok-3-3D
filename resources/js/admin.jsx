import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../css/app.css";
import axios from "axios";

// --- FORMAT RUPIAH ---
const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// --- KOMPONEN TRANSAKSI ---
const TransaksiView = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/admin/rentals", {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(({ data }) => {
            // 🔎 INTIP STRUKTUR: Klik kanan di browser -> Inspect -> Tab Console
            console.log("=== CHECK DATA API RENTALS ===", data);

            // 🛠️ PAKSA JALUR: Jika data langsung array
            if (Array.isArray(data)) {
                setRentals(data);
            } 
            // Jika dibungkus pagination bawaan Laravel biasa ($rentals->paginate())
            else if (data && data.data && Array.isArray(data.data)) {
                setRentals(data.data);
            } 
            // Jika dibungkus API Resource / objek kustom bernama rentals
            else if (data && data.rentals && Array.isArray(data.rentals)) {
                setRentals(data.rentals);
            } 
            // Jika dibungkus pagination di dalam objek rentals
            else if (data && data.rentals && data.rentals.data && Array.isArray(data.rentals.data)) {
                setRentals(data.rentals.data);
            } 
            // 💡 CARA ALT JIKA FORMATNYA OBJEK LAIN: Kita coba ambil paksa key pertama yang berupa array
            else if (data && typeof data === 'object') {
                const ketemuArray = Object.values(data).find(val => Array.isArray(val));
                if (ketemuArray) {
                    setRentals(ketemuArray);
                } else if (stats && Array.isArray(stats.booking_terbaru)) {
                    setRentals(stats.booking_terbaru); // Balik ke data dashboard
                } else {
                    setRentals([]);
                }
            } 
            else {
                setRentals([]);
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error("Gagal load API rentals:", err);
            if (stats && Array.isArray(stats.booking_terbaru)) {
                setRentals(stats.booking_terbaru);
            }
            setLoading(false);
        });
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/admin/rentals/${id}/status`, { status }, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            setRentals(rentals.map(r => r.id === id ? { ...r, status } : r));
            alert("✅ Status berhasil diupdate!");
        } catch (err) {
            alert("❌ " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px" }}>Riwayat & Status Transaksi</h3>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>{rentals.length} transaksi</span>
            </div>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Kode Booking</th>
                            <th>User ID</th>
                            <th>Tanggal Sewa</th>
                            <th>Hari</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* SEKRING PENGAMAN: Cek dulu apakah rentals ada dan berupa array */}
                        {rentals && Array.isArray(rentals) && rentals.length > 0 ? (
                            rentals.map(r => (
                                <tr key={r.id}>
                                    <td><strong>{r.booking_code}</strong></td>
                                    <td>{r.user_id}</td>
                                    <td>{r.start_date} s/d {r.end_date}</td>
                                    <td>{r.total_days} hari</td>
                                    <td><strong>{typeof rp === 'function' ? rp(r.total_price) : `Rp ${r.total_price}`}</strong></td>
                                    <td>
                                        <span className={`badge-status ${
                                            r.status === "Aktif / Disewa" ? "st-active" :
                                            r.status === "Selesai" ? "st-active" :
                                            r.status === "Dibatalkan" ? "st-danger" :
                                            "st-pending"
                                        }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={r.status}
                                            onChange={(e) => updateStatus && updateStatus(r.id, e.target.value)}
                                            style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #ddd" }}
                                        >
                                            <option>Menunggu Pembayaran</option>
                                            <option>Aktif / Disewa</option>
                                            <option>Selesai</option>
                                            <option>Dibatalkan</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            /* Tampilan alternatif kalau data rentals masih kosong/belum siap */
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", color: "gray", padding: "20px" }}>
                                    Tidak ada data transaksi atau data belum dimuat.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- KOMPONEN DATA PELANGGAN (FRONTEND) ---
const PelangganView = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mengambil token login admin yang tersimpan
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        
        axios.get("/api/admin/pelanggan", {
            headers: { Authorization: "Bearer " + token }
        })
        .then(({ data }) => {
            setCustomers(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Gagal memuat data pelanggan:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Pelanggan...</div>;

    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px" }}>Data Pelanggan Terdaftar</h3>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>{customers.length} pengguna</span>
            </div>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID User</th>
                            <th>Nama Lengkap</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Tanggal Bergabung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Cek dulu apakah variabel customers benar-benar sebuah Array */}
                        {Array.isArray(customers) && customers.length > 0 ? (
                            customers.map((c, index) => (
                                <tr key={c.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{c.name || c.nama}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || "-"}</td>
                                    <td>{c.role || "user"}</td>
                                    <td>{c.created_at|| "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "gray", padding: "20px" }}>
                                    Tidak ada data pelanggan atau format data salah.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


function AdminApp() {
    // Cek localStorage: Apakah user punya "tiket" masuk admin?
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("adminToken") === "true" || localStorage.getItem("token") !== null
    );
    const [activeView, setActiveView] = useState("dashboard");

    // ==========================================
// 🛠️ PERBAIKAN KELOMPOK 3-3D: STATE UTAMA (Ditaruh di paling atas AdminApp)
// ==========================================
const [cameras, setCameras] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

// Fungsi untuk mengambil data kamera dari API
const fetchCameras = async (keyword = "") => {
    try {
        const { data } = await axios.get(`/api/cameras?search=${keyword}`);
        setCameras(data.data);
        setLoading(false);
    } catch (err) {
        setLoading(false);
    }
};

// Ambil data kamera saat AdminApp pertama kali dimuat
useEffect(() => {
    fetchCameras();
}, []);

// Fungsi hapus kamera dari database
const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus barang ini?")) return;
    try {
        await axios.delete(`/api/cameras/${id}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        setCameras(cameras.filter(c => c.id !== id));
        alert("✅ Barang berhasil dihapus!");
    } catch (err) {
        alert("❌ " + (err.response?.data?.message || err.message));
    }
};

// ==========================================================================================
// ⭐ KELOMPOK 3-3D: FUNGSI EDIT CERDAS GABUNGAN (CAMERAS & EQUIPMENTS) ⭐
// ==========================================================================================
const handleEditProduct = async (item) => {
    // 📌 DETEKSI ASAL BARANG: Apakah dari tabel camera atau equipment?
    // Kita cek properti uniknya (misal jika ada serial_number atau asal === 'camera')
    const isCamera = item.serial_number !== undefined || item.asal === 'camera';
    
    // ---- [1. PROMPT UNTUK NAMA BARANG] ----
    const newName = window.prompt("✏️ Masukkan NAMA BARANG baru:", item.name || item.type);
    if (newName === null) return; 
    if (newName.trim() === "") {
        alert("❌ Nama barang tidak boleh kosong!");
        return;
    }

    // ---- [🛠️ KONDISIONAL: 2. PROMPT UNTUK SERIAL NUMBER (KHUSUS KAMERA)] ----
    let newSerialNumber = null;
    if (isCamera) {
        newSerialNumber = window.prompt("✏️ Masukkan NOMOR SERI / SERIAL NUMBER:", item.serial_number || "");
        if (newSerialNumber === null) return;
        if (newSerialNumber.trim() === "") {
            alert("❌ Nomor seri wajib diisi untuk kebutuhan database kamera!");
            return;
        }
    }

    // ---- [3. PROMPT UNTUK KATEGORI] ----
    const newType = window.prompt("✏️ Masukkan KATEGORI baru (misal: Mirrorless / Lensa / Tripod):", item.type);
    if (newType === null) return;
    if (newType.trim() === "") {
        alert("❌ Kategori tidak boleh kosong!");
        return;
    }

    // ---- [4. PROMPT UNTUK HARGA SEWA] ----
    const inputHarga = window.prompt("✏️ Masukkan HARGA SEWA per hari (Angka saja):", item.price_per_day);
    if (inputHarga === null) return;
    const newPrice = parseInt(inputHarga, 10);
    if (isNaN(newPrice) || newPrice < 0) {
        alert("❌ Harga harus berupa angka yang valid!");
        return;
    }

    // ---- [5. PROMPT UNTUK DEPOSIT] ----
    const inputDeposit = window.prompt("✏️ Masukkan nominal DEPOSIT (Angka saja):", item.deposit || 0);
    if (inputDeposit === null) return;
    const newDeposit = parseInt(inputDeposit, 10);
    if (isNaN(newDeposit) || newDeposit < 0) {
        alert("❌ Deposit harus berupa angka yang valid!");
        return;
    }

    // ---- [6. PROMPT UNTUK STOK BARANG] ----
    const inputStok = window.prompt("✏️ Masukkan JUMLAH STOK baru (Angka saja):", item.stock || 0);
    if (inputStok === null) return;
    const newStock = parseInt(inputStok, 10);
    if (isNaN(newStock) || newStock < 0) {
        alert("❌ Stok harus berupa angka yang valid!");
        return;
    }

    // ---- [7. STRUKTUR DATA PAYLOAD YANG AKAN DIKIRIM] ----
    const updatedData = {
        name: newName,
        brand: item.brand || "", 
        type: newType,
        price_per_day: newPrice,
        deposit: newDeposit,
        stock: newStock
    };

    // 📌 Jika barangnya kamera, ikut sertakan serial_number ke data payload
    if (isCamera) {
        updatedData.serial_number = newSerialNumber;
    }
    // Jika kamera tembak ke /api/cameras, jika equipment tembak ke /api/equipments
    const apiUrl = isCamera ? `/api/cameras/${item.id}` : `/api/equipments/${item.id}`;

    try {
        // Tembak API menggunakan method POST + Spoofing PUT agar aman di Laravel
        await axios.post(apiUrl, {
            ...updatedData,
            _method: 'PUT' 
        }, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        // Ganti 'cameras' di bawah dengan nama state gabungan yang kalian pakai merender tabel
        setCameras(cameras.map(c => (c.id === item.id && (isCamera === (c.serial_number !== undefined || c.asal === 'camera')) ? { ...c, ...updatedData } : c)));
        
        alert(`✅ Data ${isCamera ? 'Kamera' : 'Equipment'} berhasil diperbarui!`);
    } catch (err) {
        alert("❌ Gagal mengupdate data: " + (err.response?.data?.message || err.message));
    }
};

// --- 🌟 TAMBAHKAN STATE UNTUK MENAMPUNG DATA DATABASE ---
    const [stats, setStats] = useState({
        total_barang: 0,
        sedang_disewa: 0,
        menunggu_pickup: 0,
        pendapatan: 0,
        booking_terbaru: []
    });
    const [loadingStats, setLoadingStats] = useState(true);

    const titles = {
        dashboard: "Dashboard Overview",
        produk: "Manajemen Data Barang",
        "form-produk": "Tambah Barang Baru",
        transaksi: "Riwayat & Status Transaksi",
        pelanggan: "Data Pelanggan",
    };

    //DI SINI NYAWANYA! FUNGSI UNTUK MENARIK DATA DARI DATABASE RENTALS ⚡ ---//
    useEffect(() => {
        if (isAuthenticated && activeView === "dashboard") {
            const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
            
            axios.get("/api/admin/dashboard-stats", {
                headers: { Authorization: "Bearer " + token }
            })
            .then(({ data }) => {
                setStats({
                    total_barang: data.total_barang || 0,
                    sedang_disewa: data.sedang_disewa || 0,
                    menunggu_pickup: data.menunggu_pickup || 0,
                    pendapatan: data.pendapatan || 0,
                    booking_terbaru: data.booking_terbaru || []
                });
                setLoadingStats(false); // Berhenti loading karena data sukses diambil
            })
            .catch((err) => {
                // Jika error, cetak di console F12 dan matikan loading agar tidak stuck
                console.error("Gagal mengambil data dari database:", err);
                setLoadingStats(false); 
            });
        }
    }, [activeView, isAuthenticated]);

    // Jika belum login, tampilkan pesan proteksi
    if (!isAuthenticated) {
        return (
            <div style={{ padding: "100px", textAlign: "center" }}>
                <h2>Sesi Login Habis / Anda Belum Login</h2>
                <p style={{ color: "gray", marginTop: "10px" }}>Silakan login kembali melalui halaman utama.</p>
            </div>
        );
    }

    // --- HALAMAN LOGIN ADMIN (Fallback jika user masuk langsung via /admin) ---
    if (!isAuthenticated) {
        const handleLogin = async (e) => {
            e.preventDefault();
            const email = e.target.email.value.trim();
            const password = e.target.password.value;
            try {
                // Tembak API login backend
                const { data } = await axios.post("/api/admin/login", { email, password });
                
                // Simpan token asli dari database dan set status login
                localStorage.setItem("token", data.token);
                localStorage.setItem("adminToken", "true"); 
                setIsAuthenticated(true);
                
                alert("✅ Login Admin Berhasil!");
            } catch (err) {
                alert("❌ " + (err.response?.data?.message || "Email atau Password Admin salah!"));
            }
        };

        return (
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--ink)",
                }}
            >
                <div
                    className="card"
                    style={{ width: "400px", padding: "40px" }}
                >
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <h2
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "28px",
                                fontWeight: 700,
                            }}
                        >
                            Yukirent
                            <span style={{ color: "var(--gold)" }}>✦</span>{" "}
                            Admin
                        </h2>
                        <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                            Masukkan kredensial untuk mengakses dashboard
                        </p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email Admin</label>
                            <input type="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label>Kata Sandi</label>
                            <input type="password" name="password" required />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-gold btn-full btn-lg"
                            style={{ marginTop: "12px" }}
                        >
                            Masuk Dashboard
                        </button>
                    </form>
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <a
                            href="/"
                            style={{
                                fontSize: "12px",
                                color: "var(--muted)",
                                textDecoration: "none",
                            }}
                        >
                            ← Kembali ke Web Pelanggan
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // --- HALAMAN DASHBOARD UTAMA ---
    return (
        <div className="admin-body">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="brand">
                    Yukirent<span className="dot">✦</span>{" "}
                    <span
                        style={{
                            fontSize: "12px",
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 400,
                            opacity: 0.7,
                            marginLeft: "auto",
                        }}
                    >
                        Admin
                    </span>
                </div>
                <div className="nav-menu">
                    <div
                        className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveView("dashboard")}
                    >
                        📊 Dashboard
                    </div>
                    <div
                        className={`nav-item ${activeView === "produk" || activeView === "form-produk" ? "active" : ""}`}
                        onClick={() => setActiveView("produk")}
                    >
                        📷 Data Barang
                    </div>
                    <div
                        className={`nav-item ${activeView === "transaksi" ? "active" : ""}`}
                        onClick={() => setActiveView("transaksi")}
                    >
                        📝 Transaksi / Booking
                    </div>
                    <div
                        className={`nav-item ${activeView === "pelanggan" ? "active" : ""}`}
                        onClick={() => setActiveView("pelanggan")}
                    >
                        👥 Pelanggan
                    </div>
                </div>
                <div className="user-profile">
                    <div className="user-av">AD</div>
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>
                            Admin Utama
                        </div>
                        <div
                            style={{
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.5)",
                            }}
                        >
                            admin@yukirent.com
                        </div>
                    </div>
                    {/* TOMBOL LOGOUT */}
                    <button
                        style={{
                            marginLeft: "auto",
                            background: "transparent",
                            border: "none",
                            color: "#fee2e2",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            localStorage.removeItem("adminToken"); // Hapus memori login admin
                            setIsAuthenticated(false);
                            window.location.href = "/"; // Arahkan kembali ke halaman depan
                        }}
                        title="Keluar / Logout"
                    >
                        🚪
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <header className="topbar">
                    <div className="page-title">{titles[activeView]}</div>
                    <div>
                        <button
                            className="btn btn-outline"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={() => (window.location.href = "/")}
                        >
                            Buka Web Utama ↗
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {/* VIEW: DASHBOARD */}
                    {activeView === "dashboard" && (
                        <div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📷</div>
                                    <div className="stat-info">
                                        <h4>TOTAL BARANG</h4>
                                        <div className="num">{stats.total_barang || 0}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div
                                        className="stat-icon"
                                        style={{
                                            background: "#DFF0E4",
                                            color: "#1A5E2E",
                                        }}
                                    >
                                        ⚡
                                    </div>
                                    <div className="stat-info">
                                        <h4>SEDANG DISEWA</h4>
                                        <div className="num">{stats.sedang_disewa || 0}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div
                                        className="stat-icon"
                                        style={{
                                            background: "#FDE8D2",
                                            color: "#7A3500",
                                        }}
                                    >
                                        📝
                                    </div>
                                    <div className="stat-info">
                                        <h4>MENUNGGU PICKUP</h4>
                                        <div className="num">{stats.menunggu_pickup || 0}</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div
                                        className="stat-icon"
                                        style={{
                                            background: "#E8F4F8",
                                            color: "#1A5E87",
                                        }}
                                    >
                                        💰
                                    </div>
                                    <div className="stat-info">
                                        <h4>PENDAPATAN BULAN INI</h4>
                                        <div className="num">
                                            Rp {typeof stats.pendapatan === 'number' 
                                    ? stats.pendapatan.toLocaleString("id-ID") 
                                    : (parseInt(stats.pendapatan) || 0).toLocaleString("id-ID")}
                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <h3 style={{ fontSize: "16px" }}>
                                        Booking Masuk Terbaru
                                    </h3>
                                    <button
                                        type="button" // 1. Mengunci tombol agar tidak dianggap sebagai tombol submit form
                                        className="btn btn-outline"
                                        style={{
                                            padding: "6px 12px",
                                            fontSize: "12px",
                                            cursor: "pointer" // 2. Membuat kursor berubah jadi jari penunjuk
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault(); // 3. Mencegah browser melakukan reload/refresh halaman secara tidak sengaja
                                            setActiveView("transaksi"); // 4. Berpindah ke halaman transaksi secara aman
                                        }}
                                    >
                                        Lihat Semua
                                    </button>
                                </div>
                                <div className="table-wrap">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID Booking</th>
                                                <th>Pelanggan</th>
                                                <th>Barang</th>
                                                <th>Tanggal Sewa</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingStats ? (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: "center", color: "gray", padding: "20px" }}>
                                                        Memuat data transaksi...
                                                    </td>
                                                </tr>
                                            ) : stats.booking_terbaru.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: "center", color: "gray", padding: "20px" }}>
                                                        Belum ada data rental masuk di database.
                                                    </td>
                                                </tr>
                                            ) : (
                                                stats.booking_terbaru.map((b) => (
                                                    <tr key={b.id}>
                                                        {/* ID BOOKING */}
                                                        <td>
                                                            <strong>#{b.id}</strong>
                                                        </td>
                                                        
                                                        {/* NAMA USER/MEMBER */}
                                                        <td>{b.pelanggan_nama}</td>
                                                        
                                                        {/* NAMA PRODUK YANG DISEWA */}
                                                        <td>{b.nama_barang || "Kamera"}</td>
                                                        
                                                        {/* RENTANG TANGGAL */}
                                                        <td>{b.start_date || b.tanggal_sewa || "-"} s/d {b.end_date || ""}</td>
                                                        
                                                        {/* BADGE STATUS */}
                                                        <td>
                                                            <span className={`badge-status ${
                                                                b.status === 'Selesai' || b.status === 'Aktif / Disewa' ? 'st-success' : 'st-pending'
                                                            }`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        
                                                        {/* TOTAL HARGA FORMAT RUPIAH */}
                                                        <td>
                                                            <strong>
                                                                Rp {b.total_price ? b.total_price.toLocaleString("id-ID") : "0"}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: PRODUK (DATA BARANG) */}
                    {activeView === "produk" && (
                        <div>
                            {loading ? (
                                <div style={{ padding: "40px", textAlign: "center" }}>Loading data dari database...</div>
                            ) : (
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "20px",
                                            }}
                                            >
                                            <input
                                                type="text"
                                                placeholder="Cari nama barang..."
                                                style={{ width: "300px" }}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-ink"
                                                onClick={() => setActiveView("form-produk")}
                                            >
                                                + Tambah Barang Baru
                                            </button>
                                        </div>
                                        <div className="card">
                                            <div className="table-wrap">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Nama Barang</th>
                                                            <th>Kategori</th>
                                                            <th>Harga / Hari</th>
                                                            <th>Deposit</th>
                                                            <th>Stok</th>
                                                            <th>Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cameras.filter(c => {
                                                            const nama = (c.name || c.type || "").toLowerCase();
                                                            const brand = (c.brand || "").toLowerCase();
                                                            return nama.includes(search.toLowerCase()) || brand.includes(search.toLowerCase());
                                                        }).length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                                                                    Tidak ada data yang cocok
                                                                </td>
                                                            </tr>
                                                        ) : cameras.filter(c => {
                                                            const nama = (c.name || c.type || "").toLowerCase();
                                                            const brand = (c.brand || "").toLowerCase();
                                                            return nama.includes(search.toLowerCase()) || brand.includes(search.toLowerCase());
                                                        }).map(c => (
                                                            <tr key={c.id}>
                                                                <td>{c.id}</td>

                                                                {/* 2. NAMA BARANG */}
                                                                <td>
                                                                    <strong>{c.name || c.type}</strong>
                                                                    <br />
                                                                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>Brand: {c.brand}</span>
                                                                </td>
                                                                {/* 3. KATEGORI */}
                                                                <td>{c.type}</td>

                                                                {/* 4. HARGA / HARI */}
                                                                <td>{typeof rp === 'function' ? rp(Math.round(c.price_per_day)) : `Rp ${Math.round(c.price_per_day).toLocaleString('id-ID')}`}</td>

                                                                {/* 🛠️ PERBAIKAN: 5. DEPOSIT (Baris baru yang sebelumnya hilang) */}
                                                                <td>{typeof rp === 'function' ? rp(Math.round(c.deposit || 0)) : `Rp ${Math.round(c.deposit || 0).toLocaleString('id-ID')}`}</td>

                                                                {/* 6. STOK */}
                                                                <td>
                                                                    <span style={{
                                                                        color: c.stock > 0 ? "#1a5e2e" : "#8b2222",
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {c.stock} unit
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button 
                                                                        className="btn-edit" 
                                                                        onClick={() => handleEditProduct(c)}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn-danger"
                                                                        onClick={() => handleDelete(c.id)}
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}  
                        </div>
                    )} 

                    {/* VIEW: FORM PRODUK */}
                    {activeView === "form-produk" && (
                        <div>
                            <button
                                className="btn btn-outline"
                                style={{ marginBottom: "20px" }}
                                onClick={() => setActiveView("produk")}
                            >
                                ← Kembali ke Data Barang
                            </button>
                            <div className="card" style={{ maxWidth: "800px" }}>
                                <h3
                                    style={{
                                        marginBottom: "24px",
                                        fontSize: "18px",
                                        borderBottom: "1px solid var(--border)",
                                        paddingBottom: "12px",
                                    }}
                                >
                                    Input Data Barang Baru
                                </h3>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        alert(
                                            "Siap dihubungkan ke API Laravel!",
                                        );
                                        setActiveView("produk");
                                    }}
                                >
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nama Kamera / Alat</label>
                                            <input type="text" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Kategori</label>
                                            <select>
                                                <option>Mirrorless</option>
                                                <option>DSLR</option>
                                                <option>Lensa</option>
                                                <option>Aksesoris</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Brand Merk</label>
                                            <input type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label>Total Stok Alat</label>
                                            <input
                                                type="number"
                                                defaultValue="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Harga Sewa (Per Hari)</label>
                                            <input type="number" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Biaya Deposit</label>
                                            <input type="number" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Deskripsi Singkat</label>
                                        <textarea rows="4"></textarea>
                                    </div>
                                    <div
                                        style={{
                                            marginTop: "32px",
                                            display: "flex",
                                            gap: "12px",
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            className="btn btn-gold"
                                        >
                                            Simpan Data Barang
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() =>
                                                setActiveView("produk")
                                            }
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* VIEW: TRANSAKSI & PELANGGAN (Placeholder) */}
                    {activeView === "transaksi" && <TransaksiView />}
                    {activeView === "pelanggan" && <PelangganView />}
                </div>
            </main>
        </div>
    );
}
// Alternatif jika di-render via main.jsx (Hapus blok ReactDOM.createRoot di admin.jsx)
export default AdminApp;

// Render ke DOM
if (document.getElementById("root")) {
    if (!window.reactRoot) {
        window.reactRoot = createRoot(document.getElementById("root"));
    }
    window.reactRoot.render(<AdminApp />);
}