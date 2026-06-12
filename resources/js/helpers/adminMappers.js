// ============================================================
// FORMAT HELPERS
// ============================================================

export const rp = (n) =>
    "Rp " + (Number(n) || 0).toLocaleString("id-ID");

// ============================================================
// RENTAL RESPONSE MAPPERS
// ============================================================


export const parseRentalsResponse = (data) => {
    if (Array.isArray(data)) return data;

    if (data?.data && Array.isArray(data.data)) return data.data;

    if (data?.rentals && Array.isArray(data.rentals)) return data.rentals;

    if (data?.rentals?.data && Array.isArray(data.rentals.data))
        return data.rentals.data;

    if (data && typeof data === "object") {
        const found = Object.values(data).find((v) => Array.isArray(v));
        if (found) return found;
    }

    return [];
};

// ============================================================
// PRODUCT HELPERS
// ============================================================

export const isCameraItem = (item) =>
    item?.serial_number !== undefined || item?.asal === "camera";

export const filterCameras = (cameras, keyword) => {
    if (!keyword) return cameras;
    const q = keyword.toLowerCase();
    return cameras.filter((c) => {
        const nama  = (c.name  || c.type  || "").toLowerCase();
        const brand = (c.brand || "").toLowerCase();
        const kategori = (c.category?.name || c.type || "").toLowerCase(); 
        return nama.includes(q) || brand.includes(q);
    });
};

// ============================================================
// RENTAL STATUS HELPERS
// ============================================================

export const statusBadgeClass = (status) => {
    switch (status) {
        case "Aktif / Disewa":
        case "Selesai":
            return "st-active";
        case "Dibatalkan":
            return "st-danger";
        default:
            return "st-pending";
    }
};

export const dashboardStatusClass = (status) =>
    status === "Selesai" || status === "Aktif / Disewa"
        ? "st-success"
        : "st-pending";
