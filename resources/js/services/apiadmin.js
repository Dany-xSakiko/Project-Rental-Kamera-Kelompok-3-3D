import axios from "axios";

// ============================================================
// BASE CONFIG
// ============================================================
const API_BASE = "/api";

// authHeaders() adalah fungsi, 
//    jadi token dibaca fresh setiap kali dipanggil
const authHeaders = () => ({
    Authorization: "Bearer " + localStorage.getItem("token"),
});

// ============================================================
// AUTH
// ============================================================
export const loginAdmin = (email, password) =>
    axios.post(`${API_BASE}/admin/login`, { email, password });

// ============================================================
// DASHBOARD
// ============================================================
export const getDashboardStats = () =>
    axios.get(`${API_BASE}/admin/dashboard-stats`, 
        { headers: authHeaders() });

// ============================================================
// RENTALS / TRANSAKSI
// ============================================================
export const getRentals = () =>
    axios.get(`${API_BASE}/admin/rentals`, 
        { headers: authHeaders() });

export const updateRentalStatus = (id, status) =>
    axios.put(
        `${API_BASE}/admin/rentals/${id}/status`,
        { status },
        { headers: authHeaders() }
    );

// ============================================================
// PELANGGAN / USERS
// ============================================================
export const getPelanggan = () =>
    axios.get(`${API_BASE}/admin/pelanggan`, 
        { headers: authHeaders() });

// ============================================================
// PRODUK: CAMERAS & EQUIPMENTS
// ============================================================
export const getCameras = (keyword = "") =>
    axios.get(`${API_BASE}/cameras`, {
        params: keyword ? { search: keyword } : {},
        headers: authHeaders(),
    });

export const getEquipments = (keyword = "") =>
    axios.get(`${API_BASE}/equipments`, {
        params: keyword ? { search: keyword } : {},
        headers: authHeaders(),
    });

export const deleteCamera = (id) =>
    axios.delete(`${API_BASE}/cameras/${id}`, { headers: authHeaders() });

// tambahkan deleteEquipment, sebelumnya tidak ada!
export const deleteEquipment = (id) =>
    axios.delete(`${API_BASE}/equipments/${id}`, { headers: authHeaders() });

export const updateProduct = (id, isCamera, payload) => {
    const endpoint = isCamera
        ? `${API_BASE}/cameras/${id}`
        : `${API_BASE}/equipments/${id}`;

    return axios.post(
        endpoint,
        { ...payload, _method: "PUT" },
        { headers: authHeaders() }
    );
};

//  tambahkan createProduct, untuk tambah kamera/equipment baru
export const createProduct = (isCamera, payload) => {
    const endpoint = isCamera
        ? `${API_BASE}/cameras`
        : `${API_BASE}/equipments`;

    return axios.post(
        endpoint,
        payload,
        { headers: authHeaders() }
    );
};