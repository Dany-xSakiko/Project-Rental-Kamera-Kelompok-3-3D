import axios from "axios";

// ================================================
// HELPER — ambil token dari localStorage
// ================================================
const authHeaders = () => ({
    Authorization: "Bearer " + localStorage.getItem("token"),
    Accept: "application/json",
});


// Dipakai di: HomePage, CatalogPage    
export const getKatalogProduk = () => {
    return axios.get("/api/katalog-produk");
};

                
//   Mengirim data booking ke server             
//   Dipakai di: CartPage    
export const postRental = ({ start_date, end_date, total_days, total_price, items }) => {
    return axios.post("/api/rentals", {
        start_date,
        end_date,
        total_days,
        total_price,
        items,
    }, {
        headers: authHeaders(),
    });
};
        
// ║  Login user, mendapatkan token + data user   ║
// ║  Dipakai di: AuthPage              
export const postLogin = ({ email, password }) => {
    return axios.post("/api/login", { email, password });
};

//   Registrasi akun baru, mendapat token        ║
//   Dipakai di: AuthPage  
export const postRegister = ({ name, email, password, password_confirmation, phone }) => {
    return axios.post("/api/register", {
        name,
        email,
        password,
        password_confirmation,
        phone,
    });
};

//  Update nama & email profil user             ║
//  Dipakai di: ProfilePage  
export const putProfile = ({ name, email }) => {
    return fetch("/api/profile", {
        method: "PUT",
        headers: {
            "Content-Type":  "application/json",
            "Accept":        "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, email }),
    });
};

//  Mencari kamera berdasarkan keyword          ║
//  Dipakai di: App → handleSearch() 
export const searchCameras = (keyword) => {
    return Promise.all([
        axios.get(`/api/cameras?search=${keyword}`, { headers: authHeaders() }),      // ← DITAMBAHKAN
        axios.get(`/api/equipments?search=${keyword}`, { headers: authHeaders() }),   // ← DITAMBAHKAN
    ]);
};
