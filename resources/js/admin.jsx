import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../css/app.css";

function AdminApp() {
    // Cek localStorage: Apakah user punya "tiket" masuk admin?
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("adminToken") === "true",
    );
    const [activeView, setActiveView] = useState("dashboard");

    const titles = {
        dashboard: "Dashboard Overview",
        produk: "Manajemen Data Barang",
        "form-produk": "Tambah Barang Baru",
        transaksi: "Riwayat & Status Transaksi",
        pelanggan: "Data Pelanggan",
    };

    // --- HALAMAN LOGIN ADMIN (Fallback jika user masuk langsung via /admin) ---
    if (!isAuthenticated) {
        const handleLogin = (e) => {
            e.preventDefault();
            const email = e.target.email.value.trim();
            const password = e.target.password.value;
            if (email === "admin@yukirent.com" && password === "admin123") {
                localStorage.setItem("adminToken", "true"); // Simpan tiket
                setIsAuthenticated(true);
            } else {
                alert("Email atau Password Admin salah!");
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
                                        <div className="num">94</div>
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
                                        <div className="num">12</div>
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
                                        <div className="num">5</div>
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
                                        <div className="num">Rp 12.5M</div>
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
                                        className="btn btn-outline"
                                        style={{
                                            padding: "6px 12px",
                                            fontSize: "12px",
                                        }}
                                        onClick={() =>
                                            setActiveView("transaksi")
                                        }
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
                                            <tr>
                                                <td>
                                                    <strong>#YK2026052</strong>
                                                </td>
                                                <td>Budi Santoso</td>
                                                <td>Sony Alpha A7 IV</td>
                                                <td>18 - 20 Mei 2026</td>
                                                <td>
                                                    <span className="badge-status st-pending">
                                                        Menunggu Pembayaran
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>
                                                        Rp 1.500.000
                                                    </strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>#YK2026051</strong>
                                                </td>
                                                <td>Yuki Rentaka</td>
                                                <td>Fujifilm X-T5</td>
                                                <td>15 - 17 Mei 2026</td>
                                                <td>
                                                    <span className="badge-status st-active">
                                                        Aktif / Disewa
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>
                                                        Rp 1.080.000
                                                    </strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: PRODUK (DATA BARANG) */}
                    {activeView === "produk" && (
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
                                            <tr>
                                                <td>BRG-001</td>
                                                <td>
                                                    <strong>
                                                        Sony Alpha A7 IV
                                                    </strong>
                                                    <br />
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "var(--muted)",
                                                        }}
                                                    >
                                                        Brand: Sony
                                                    </span>
                                                </td>
                                                <td>Mirrorless</td>
                                                <td>Rp 250.000</td>
                                                <td>Rp 750.000</td>
                                                <td>3 unit</td>
                                                <td>
                                                    <button className="btn-edit">
                                                        Edit
                                                    </button>{" "}
                                                    <button className="btn-danger">
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>BRG-002</td>
                                                <td>
                                                    <strong>
                                                        Canon EOS R5
                                                    </strong>
                                                    <br />
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "var(--muted)",
                                                        }}
                                                    >
                                                        Brand: Canon
                                                    </span>
                                                </td>
                                                <td>Mirrorless</td>
                                                <td>Rp 300.000</td>
                                                <td>Rp 900.000</td>
                                                <td>2 unit</td>
                                                <td>
                                                    <button className="btn-edit">
                                                        Edit
                                                    </button>{" "}
                                                    <button className="btn-danger">
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
                    {(activeView === "transaksi" ||
                        activeView === "pelanggan") && (
                        <div className="card">
                            <h3>{titles[activeView]}</h3>
                            <p
                                style={{
                                    color: "var(--muted)",
                                    marginTop: "8px",
                                }}
                            >
                                Modul ini siap dikembangkan dan disambungkan ke
                                database.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Render ke DOM
if (document.getElementById("root")) {
    const root = createRoot(document.getElementById("root"));
    root.render(<AdminApp />);
}
