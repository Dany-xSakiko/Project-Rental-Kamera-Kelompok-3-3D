import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../css/app.css"; // Pastikan file app.css berisi SEMUA css dari file aslimu
import { products } from "./data";
import axios from "axios";

// --- FORMAT RUPIAH ---
const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// ==========================================
// 1. KOMPONEN NAVBAR & FOOTER
// ==========================================
const Navbar = ({ setActivePage, cartCount, user, setUser }) => (
    <nav id="navbar">
        <div className="nav-logo" onClick={() => setActivePage("home")}>
            Yukirent Cam<span className="nav-logo-dot">✦</span>
        </div>
        <div className="nav-search">
            <span className="nav-search-icon">⌕</span>
            <input type="text" placeholder="Cari kamera, lensa, aksesoris…" />
        </div>
        <div className="nav-links">
            <span className="nav-a" onClick={() => setActivePage("home")}>
                Beranda
            </span>
            <span className="nav-a" onClick={() => setActivePage("catalog")}>
                Katalog
            </span>
            <div className="nav-sep"></div>
            {user ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <button
                        className="nav-icon-btn"
                        onClick={() => setActivePage("cart")}
                        title="Keranjang"
                    >
                        🛒<div className="nav-badge">{cartCount}</div>
                    </button>
                    <button
                        className="nav-icon-btn"
                        onClick={() => setActivePage("profile")}
                        title="Profil"
                    >
                        🔔
                    </button>
                    <div
                        className="nav-avatar"
                        onClick={() => setActivePage("profile")}
                    >
                        {user.initials}
                    </div>
                </div>
            ) : (
                <span
                    className="nav-a nav-auth"
                    onClick={() => setActivePage("auth")}
                >
                    Sign up / Login
                </span>
            )}
        </div>
    </nav>
);

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand-logo">
                        Yukirent Cam<span className="dot">✦</span>
                    </div>
                    <p className="footer-desc">
                        Tempat rental kamera & alat fotografi terpercaya. Sewa
                        mudah, harga terjangkau, kualitas premium.
                    </p>
                </div>
                <div>
                    <h5>Layanan</h5>
                    <span className="footer-link">Cara Sewa</span>
                    <span className="footer-link">Syarat & Ketentuan</span>
                </div>
                <div>
                    <h5>Kontak</h5>
                    <span className="footer-link">
                        📍 Jl. Raya Kamera No.1, Yogyakarta
                    </span>
                    <span className="footer-link">📱 +62 812-3456-7890</span>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copy">
                    © 2026 Yukirent Camera. Semua hak cipta dilindungi
                    undang-undang.
                </div>
            </div>
        </div>
    </footer>
);

// ==========================================
// 2. KOMPONEN HALAMAN
// ==========================================

// --- HALAMAN BERANDA ---
const HomePage = ({ setActivePage, setSelectedProduct }) => {
    const [hotItems, setHotItems] = useState([]);

    useEffect(() => {
        axios.get("/api/katalog-produk")
            .then(({ data }) => {
                const cameras = data.cameras.map(c => ({
                    id:      c.id,
                    type:    "camera",
                    brand:   c.brand,
                    name:    c.name || c.type,
                    price:   Math.round(c.price_per_day),
                    deposit: Math.round(c.price_per_day) * 2,
                    cat:     c.type,
                    icon:    <img src={`/storage/${c.image}`} alt={c.name} className="hot-card-img"/>,
                    desc:    c.description,
                    hot:     true,
                }));

                const equipments = data.equipments.map(e => ({
                    id:      e.id,
                    type:    "equipment",
                    brand:   e.brand,
                    name:    e.name,
                    price:   Math.round(e.price_per_day),
                    deposit: Math.round(e.price_per_day) * 2,
                    cat:     "Aksesoris",
                    icon:    <img src={`/storage/${e.image}`} alt={e.name} className="hot-card-img"/>,
                    desc:    e.specification,
                    hot:     false,
                }));

                // Ambil 4 item pertama yang hot
                const allHot = [...cameras, ...equipments].filter(p => p.hot);
            setHotItems(allHot.filter(p => p.name !== "Nikon Z6 II").slice(0, 3));
            });
    }, []);

    const openProduct = (product) => {
        setSelectedProduct(product);
        setActivePage("detail");
    };

    return (
        <div className="page active">
            <section className="hero">
                <div className="hero-left">
                    <div className="hero-eyebrow">
                        ★ Platform Rental Kamera #1 di Indonesia
                    </div>
                    <h1 className="hero-title">
                        Sewa Kamera
                        <br />
                        <em>Profesional,</em>
                        <br />
                        Tanpa Beli
                    </h1>
                    <p className="hero-desc">
                        Dari DSLR, mirrorless, lensa prime, hingga drone — semua
                        tersedia. Booking online, konfirmasi instan, pickup 3
                        jam.
                    </p>
                    <div className="hero-actions">
                        <button
                            className="btn btn-gold btn-lg"
                            onClick={() => setActivePage("catalog")}
                        >
                            📷 Lihat Katalog
                        </button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="sec-head">
                        <div>
                            <div className="sec-title">
                                🔥 Paling Banyak Disewa
                            </div>
                        </div>
                        <span
                            className="sec-link"
                            onClick={() => setActivePage("catalog")}
                        >
                            Lihat semua →
                        </span>
                    </div>
                    <div className="grid-4">
                        {hotItems.map((p) => (
                            <div
                                key={p.id}
                                className="pcard"
                                onClick={() => openProduct(p)}
                            >
                                <div className="pcard-thumb">
                                    <div className="pcard-thumb-inner">
                                        {p.icon}
                                    </div>
                                    <div className="pcard-badges">
                                        {p.hot && (
                                            <span className="badge badge-hot">
                                                🔥 Hot
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="pcard-body">
                                    <div className="pcard-brand">{p.brand}</div>
                                    <div className="pcard-name">{p.name}</div>
                                    <div className="pcard-price">
                                        {rp(p.price)}
                                        <span className="pcard-price-sub">
                                            /hari
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- HALAMAN KATALOG ---
const CatalogPage = ({ setActivePage, setSelectedProduct }) => {
    const [filter, setFilter] = useState("Semua");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data dari API waktu halaman dibuka
    useEffect(() => {
        axios.get("/api/katalog-produk")
            .then(({ data }) => {
                // Gabungkan cameras dan equipments
                const cameras = data.cameras.map(c => ({
                    id:      c.id,
                    type:    "camera",
                    brand:   c.brand,
                    name:    c.name || c.type, // ← pakai c.name
                    price:   Math.round(c.price_per_day), // ← bulatkan
                    deposit: Math.round(c.price_per_day) * 2,
                    cat:     c.type,
                    icon:    <img src={`/storage/${c.image}`} alt={c.name} className="camera-card-img"/>,
                    desc:    c.description,
                    hot:     true,
                }));

                const equipments = data.equipments.map(e => ({
                    id:      e.id,
                    type:    "equipment",
                    brand:   e.brand,
                    name:    e.name,
                    price:   Math.round(e.price_per_day), // ← bulatkan
                    deposit: Math.round(e.price_per_day) * 2,
                    cat:     "Aksesoris",
                    icon:    <img src={`/storage/${e.image}`} alt={e.name} className="equipment-card-img"/>,
                    desc:    e.description,
                    desc:    e.specification,
                    hot:     false,
                }));

                setProducts([...cameras, ...equipments]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredProducts = filter === "Semua"
        ? products
        : products.filter((p) => p.cat === filter);

    if (loading) return <div style={{ padding: "80px", textAlign: "center" }}>Loading...</div>;

    return (
        <div className="page active">
            <div className="container">
                <div className="catalog-wrap">
                    <aside className="sidebar">
                        <div className="sb-section">
                            <div className="sb-title">Kategori</div>
                            {["Semua", "Mirrorless", "DSLR", "Lensa", "Video", "Aksesoris"].map((cat) => (
                                <div
                                    key={cat}
                                    className="check-row"
                                    onClick={() => setFilter(cat)}
                                    style={{
                                        fontWeight: filter === cat ? "bold" : "normal",
                                        color: filter === cat ? "var(--gold)" : "inherit",
                                        background: filter === cat ? "rgba(200, 146, 42, 0.1)" : "transparent",
                                        cursor: "pointer",
                                        padding: "8px 10px",
                                        borderRadius: "6px",
                                        borderLeft: filter === cat ? "3px solid var(--gold)" : "3px solid transparent",
                                    }}
                                >
                                    <label className="check-label" style={{ cursor: "pointer" }}>
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <div className="cat-main">
                        <div className="cat-grid">
                            {filteredProducts.map((p) => (
                                <div
                                    key={p.id + p.type}
                                    className="pcard"
                                    onClick={() => {
                                        setSelectedProduct(p);
                                        setActivePage("detail");
                                    }}
                                >
                                    <div className="pcard-thumb">
                                        <div className="pcard-thumb-inner">{p.icon}</div>
                                    </div>
                                    <div className="pcard-body">
                                        <div className="pcard-brand">{p.brand}</div>
                                        <div className="pcard-name">{p.name}</div>
                                        <div className="pcard-price">
                                            {rp(p.price)}
                                            <span className="pcard-price-sub">/hari</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HALAMAN DETAIL PRODUK ---
const DetailPage = ({ product, addToCart, setActivePage }) => {
    const [activeTab, setActiveTab] = useState("desc");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Kalkulasi hari
    let days = 0;
    if (startDate && endDate) {
        const diff = new Date(endDate) - new Date(startDate);
        days = Math.round(diff / 86400000);
    }

    const handleBook = () => {
        if (days <= 0) return alert("Pilih tanggal sewa yang valid!");
        addToCart(product, startDate, endDate, days);
        setActivePage("cart");
    };

    if (!product) return null;

    return (
        <div className="page active">
            <div className="container">
                <div className="bc">
                    <span onClick={() => setActivePage("home")}>Beranda</span>
                    <span className="bc-sep">›</span>
                    <span>{product.name}</span>
                </div>
                <div className="detail-wrap">
                    <div>
                        <div className="detail-gallery">
                            <div className="detail-gallery-icon">
                                {product.icon}
                            </div>
                        </div>

                        <div className="det-tabs">
                            <div
                                className={`det-tab ${activeTab === "desc" ? "active" : ""}`}
                                onClick={() => setActiveTab("desc")}
                            >
                                Deskripsi
                            </div>
                            <div
                                className={`det-tab ${activeTab === "terms" ? "active" : ""}`}
                                onClick={() => setActiveTab("terms")}
                            >
                                Syarat Sewa
                            </div>
                        </div>

                        {activeTab === "desc" && (
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: "var(--muted)",
                                    lineHeight: 1.9,
                                    whiteSpace: "pre-line",
                                    marginTop: "16px",
                                }}
                            >
                                {product.desc || "Deskripsi belum tersedia."}
                            </div>
                        )}
                        {activeTab === "terms" && (
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: "var(--muted)",
                                    lineHeight: 1.9,
                                    marginTop: "16px",
                                }}
                            >
                                <p>
                                    • KTP asli wajib ditinggal sebagai jaminan.
                                </p>
                                <p>
                                    • Deposit dibayar lunas (dikembalikan
                                    setelah pengecekan).
                                </p>
                                <p>
                                    • Keterlambatan pengembalian: denda Rp
                                    50.000 per jam.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="detail-brand">{product.brand}</div>
                        <div className="detail-name">{product.name}</div>
                        <div className="detail-price-box">
                            <span className="detail-price-main">
                                {rp(product.price)}
                            </span>
                            <span className="detail-price-per">/ hari</span>
                            <div className="detail-deposit">
                                Deposit: {rp(product.deposit)}
                            </div>
                        </div>

                        <div className="booking-box">
                            <div className="booking-title">📅 Buat Booking</div>
                            <div className="booking-dates">
                                <div>
                                    <label>Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label>Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="dur-box">
                                <div className="dur-num">
                                    {days > 0 ? `${days} hari` : "—"}
                                </div>
                                <div className="dur-label">Durasi sewa</div>
                            </div>

                            <div className="booking-summary">
                                <div className="sum-row">
                                    <span>Subtotal sewa</span>
                                    <span>
                                        {days > 0
                                            ? rp(product.price * days)
                                            : "Rp 0"}
                                    </span>
                                </div>
                                <div className="sum-row">
                                    <span>Deposit</span>
                                    <span>{rp(product.deposit)}</span>
                                </div>
                                <div className="sum-row total">
                                    <span>Total Bayar</span>
                                    <span>
                                        {days > 0
                                            ? rp(
                                                  product.price * days +
                                                    product.deposit,
                                                )
                                            : "—"}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn btn-gold btn-full"
                                style={{ marginTop: "16px" }}
                                onClick={handleBook}
                            >
                                ⚡ Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HALAMAN KERANJANG ---
// --- CART PAGE ---
const CartPage = ({ cart, removeFromCart, clearCart, setActivePage }) => {
    // State untuk efek loading saat tombol bayar diklik
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const totalSewa = cart.reduce((a, c) => a + c.p.price * c.days, 0);

    // Fungsi simulasi pembayaran otomatis
        // Fungsi checkout — kirim data ke API Laravel
    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // Siapkan list item dari keranjang
            const items = cart.map(item => ({
                camera_id:     item.p.type === "camera" ? item.p.id : null,
                equipment_id:  item.p.type === "equipment" ? item.p.id : null,
                price_per_day: item.p.price,
            }));

            // Ambil tanggal dari item pertama di keranjang
            const start_date  = cart[0].start;
            const end_date    = cart[0].end;
            const total_days  = cart[0].days;
            const total_price = totalSewa;

            // Kirim ke API /api/rentals (butuh token login)
            await axios.post("/api/rentals", {
                start_date,
                end_date,
                total_days,
                total_price,
                items,
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    Accept: "application/json",
                }
            });

            setIsProcessing(false);
            clearCart(); // Kosongkan keranjang
            setShowSuccessModal(true); // Tampilkan popup sukses

        } catch (err) {
            setIsProcessing(false);
            alert("❌ " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="page active">
            <div className="container">
                <div className="bc">
                    <span onClick={() => setActivePage("home")}>Beranda</span>
                    <span className="bc-sep">›</span>
                    <span>Keranjang</span>
                </div>
                {cart.length === 0 ? (
                    <div className="empty" style={{ padding: "80px 20px" }}>
                        <div className="empty-icon">🛒</div>
                        <h4>Keranjang masih kosong</h4>
                        <button
                            className="btn btn-ink"
                            style={{ marginTop: "20px" }}
                            onClick={() => setActivePage("catalog")}
                        >
                            Browse Katalog
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-box">
                            <div className="cart-box-title">
                                Keranjang Booking ({cart.length} item)
                            </div>
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="cart-thumb">
                                        {item.p.icon}
                                    </div>
                                    <div>
                                        <div className="cart-item-name">
                                            {item.p.name}
                                        </div>
                                        <div className="cart-item-dates">
                                            📅 {item.start} s/d {item.end} ·{" "}
                                            {item.days} hari
                                        </div>
                                        <span
                                            className="cart-item-remove"
                                            onClick={() =>
                                                removeFromCart(index)
                                            }
                                        >
                                            Hapus
                                        </span>
                                    </div>
                                    <div>
                                        <div className="cart-item-price">
                                            {rp(item.p.price * item.days)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-box">
                            <div className="summary-box-title">
                                Ringkasan Pesanan
                            </div>
                            <div className="s-row">
                                <span>Subtotal sewa</span>
                                <span>{rp(totalSewa)}</span>
                            </div>
                            <div className="s-row total">
                                <span>Total Bayar</span>
                                <span>{rp(totalSewa)}</span>
                            </div>

                            {/* Tombol Bayar yang sudah diubah logic-nya */}
                            <button
                                className="btn btn-gold btn-full btn-lg"
                                style={{
                                    marginTop: "16px",
                                    opacity: isProcessing ? 0.7 : 1,
                                    cursor: isProcessing ? "wait" : "pointer",
                                }}
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing
                                    ? "Memproses Pembayaran ⏳..."
                                    : "Bayar Sekarang →"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* POPUP SUKSES */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <span>Status Pembayaran</span>
                            <button
                                className="modal-close-btn"
                                onClick={() => { setShowSuccessModal(false); setActivePage("profile"); }}
                            >✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-success-icon">✅</div>
                            <div className="modal-title">Pembayaran Berhasil!</div>
                            <div className="modal-desc">Pembayaran telah berhasil dikonfirmasi.</div>
                            <button
                                className="btn btn-gold btn-full"
                                onClick={() => { setShowSuccessModal(false); setActivePage("home"); }}
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- HALAMAN LOGIN / REGISTER ---
const AuthPage = ({ setUser, setActivePage }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async (e) => {
    e.preventDefault();

    const email    = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
        if (isLogin) {
            // Cek admin dulu
            if (email === "admin@yukirent.com" && password === "admin123") {
                alert("✦ Berhasil login sebagai Admin. Mengalihkan ke Dashboard...");
                window.location.href = "/admin";
                return;
            }

            // Login pakai axios
            const { data } = await axios.post("/api/login", { email, password });

            localStorage.setItem("token", data.token);
            setUser({
                name:     data.user.name,
                email:    data.user.email,
                initials: data.user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
            });
            setActivePage("home");

        } else {
            const name                  = e.target.fullname.value.trim();
            const password_confirmation = e.target.password.value;

            // Register pakai axios
            const { data } = await axios.post("/api/register", {
                name, email, password, password_confirmation
            });

            localStorage.setItem("token", data.token);
            setUser({
                name:     data.user.name,
                email:    data.user.email,
                initials: data.user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
            });
            alert("🎉 Akun berhasil dibuat!");
            setActivePage("home");
        }

        } catch (err) {
        const msg = err.response?.data?.errors?.email?.[0] 
                || err.response?.data?.message 
                || err.message 
                || "Terjadi kesalahan.";
        
        // Kalau email sudah terdaftar, arahkan ke login
        if (msg.includes("already been taken")) {
            alert("📧 Email sudah terdaftar! Silakan login.");
            setIsLogin(true); // otomatis pindah ke form login
        } else {
            alert("❌ " + msg);
        }
    }
};

    return (
        <div
            className="page active auth-page"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "calc(100vh - 56px)",
                padding: "40px 20px",
            }}
        >
            <div
                className="auth-box"
                style={{
                    maxWidth: isLogin ? "900px" : "920px",
                    width: "100%",
                    margin: "0 auto",
                }}
            >
                <div className="auth-panel-left">
                    <div className="auth-logo">
                        Yukirent Cam<span className="auth-logo-dot">✦</span>
                    </div>
                    <h2 className="auth-headline">
                        {isLogin
                            ? "Selamat datang kembali!"
                            : "Gabung Yukirent!"}
                    </h2>
                    <p className="auth-sub">
                        {isLogin
                            ? "Login untuk booking dan cek riwayat sewa."
                            : "Daftar sekarang dan dapatkan voucher Rp 50.000"}
                    </p>
                </div>
                <div className="auth-panel-right">
                    <h2>{isLogin ? "Masuk ke Akun" : "Buat Akun Baru"}</h2>
                    <p className="auth-tagline">
                        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                        <a
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                color: "var(--gold)",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            {isLogin ? "Daftar gratis →" : "Masuk →"}
                        </a>
                    </p>
                    <form onSubmit={handleAuth}>
                        {!isLogin && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nomor WhatsApp</label>
                                    <input type="tel" name="phone" required />
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label>Kata Sandi</label>
                            <input type="password" name="password" required />
                        </div>
                        <button
                            type="submit"
                            className={
                                isLogin
                                    ? "btn btn-ink btn-full btn-lg"
                                    : "btn btn-gold btn-full btn-lg"
                            }
                        >
                            {isLogin ? "Masuk" : "Buat Akun"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- HALAMAN PROFIL (DASHBOARD PELANGGAN) ---
const ProfilePage = ({ user, setUser, setActivePage }) => {
    const [activeTab, setActiveTab] = useState("dash");

    return (
        <div className="page active">
            <div className="profile-hero">
                <div className="container">
                    <div className="ph-inner">
                        <div className="ph-av-ring">{user.initials}</div>
                        <div className="ph-info">
                            <div className="ph-name">{user.name}</div>
                            <div className="ph-meta">
                                <span>✉️ {user.email}</span>
                                <span>⭐ Member Gold</span>
                            </div>
                        </div>
                    </div>
                    <div className="ph-tabs">
                        <div
                            className={`ph-tab ${activeTab === "dash" ? "active" : ""}`}
                            onClick={() => setActiveTab("dash")}
                        >
                            Dashboard
                        </div>
                        <div
                            className={`ph-tab ${activeTab === "orders" ? "active" : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            Riwayat Booking
                        </div>
                        <div
                            className={`ph-tab ${activeTab === "acct" ? "active" : ""}`}
                            onClick={() => setActiveTab("acct")}
                        >
                            Pengaturan
                        </div>
                        <div
                            className="ph-tab"
                            style={{ color: "#eb5757", marginLeft: "auto" }}
                            onClick={() => {
                                setUser(null);
                                setActivePage("home");
                            }}
                        >
                            Keluar 🚪
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="container"
                style={{ paddingTop: "28px", paddingBottom: "56px" }}
            >
                {activeTab === "dash" && (
                    <div className="dash-stats">
                        <div className="dstat">
                            <div className="dstat-icon">📦</div>
                            <div className="dstat-n">7</div>
                            <div className="dstat-l">Total Booking</div>
                        </div>
                        <div className="dstat">
                            <div className="dstat-icon">⭐</div>
                            <div className="dstat-n">350</div>
                            <div className="dstat-l">Poin Reward</div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="card">
                        <h3>Riwayat Booking Terakhir</h3>
                        <p style={{ color: "var(--muted)" }}>
                            Nantinya data ini akan ditarik dari tabel rentals di
                            database Laravel.
                        </p>
                    </div>
                )}

                {activeTab === "acct" && (
                    <div className="card" style={{ maxWidth: "600px" }}>
                        <h3>Pengaturan Akun</h3>
                        <div className="form-group">
                            <label>Nama</label>
                            <input
                                type="text"
                                id="profileName"
                                defaultValue={user.name}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                id="profileEmail"
                                defaultValue={user.email}
                            />
                        </div>
        
                        <button
                            className="btn btn-ink"
                            onClick={async () => {
                                const name  = document.getElementById("profileName").value.trim();
                                const email = document.getElementById("profileEmail").value.trim();
                                try {
                                    const res = await fetch("/api/profile", {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json",
                                            "Authorization": "Bearer " + localStorage.getItem("token"),
                                        },
                                        body: JSON.stringify({ name, email }),
                                    });
                                    const data = await res.json();
                                    if (!res.ok) throw new Error(data.message || "Gagal menyimpan.");
                                    setUser({
                                        ...user,
                                        name:     data.user.name,
                                        email:    data.user.email,
                                        initials: data.user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
                                    });
                                    alert("✅ Profil berhasil diperbarui!");
                                } catch (err) {
                                    alert("❌ " + err.message);
                                }
                            }}
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 3. KOMPONEN APP (Root / Parent)
// ==========================================
export default function App() {
    const [activePage, setActivePage] = useState("home");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);

    // State User (Ubah default ke null jika ingin simulasi belum login)
    const [user, setUser] = useState(null);

    // Fungsi Tambah Keranjang
    const addToCart = (product, start, end, days) => {
        setCart([...cart, { p: product, start, end, days }]);
    };

    // Fungsi Hapus Keranjang
    const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
    };

    // 1. FUNGSI BARU: Untuk mengosongkan keranjang setelah dibayar
    const clearCart = () => {
        setCart([]);
    };

    // Router Sederhana
    const renderPage = () => {
        switch (activePage) {
            case "home":
                return (
                    <HomePage
                        setActivePage={setActivePage}
                        setSelectedProduct={setSelectedProduct}
                    />
                );
            case "catalog":
                return (
                    <CatalogPage
                        setActivePage={setActivePage}
                        setSelectedProduct={setSelectedProduct}
                    />
                );
            case "detail":
                return (
                    <DetailPage
                        product={selectedProduct}
                        addToCart={addToCart}
                        setActivePage={setActivePage}
                    />
                );
            case "cart":
                return (
                    <CartPage
                        cart={cart}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart} // 2. FUNGSI BARU DIMASUKKAN KE SINI
                        setActivePage={setActivePage}
                    />
                );
            case "auth":
                return (
                    <AuthPage setUser={setUser} setActivePage={setActivePage} />
                );
            case "profile":
                return (
                    <ProfilePage
                        user={user}
                        setUser={setUser}
                        setActivePage={setActivePage}
                    />
                );
            default:
                return (
                    <HomePage
                        setActivePage={setActivePage}
                        setSelectedProduct={setSelectedProduct}
                    />
                );
        }
    };

    return (
        <>
            <Navbar
                setActivePage={setActivePage}
                cartCount={cart.length}
                user={user}
                setUser={setUser}
            />
            {renderPage()}
            {activePage !== "auth" && <Footer />}
        </>
    );
}

// ==========================================
// RENDER KE DOM (Hanya untuk Laravel Vite)
// ==========================================
if (document.getElementById("root")) {
    const root = createRoot(document.getElementById("root"));
    root.render(<App />);
}
