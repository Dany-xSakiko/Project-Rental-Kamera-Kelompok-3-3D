// ================================================
// MAPPERS — mengubah format data API → format React
// Dipakai di: HomePage, CatalogPage, SearchPage
// ================================================
            
export const rp = (n) =>
    "Rp " + (Number(n) || 0).toLocaleString("id-ID");


export const mapCamera = (c, imgClass = "camera-card-img") => ({
    id:       c.id,
    type:     "camera",
    brand:    c.brand,
    name:     c.name || c.type,
    price:    Math.round(c.price_per_day),   // ← dibulatkan dari decimal
    deposit:  Math.round(c.price_per_day) * 2, // ← dihitung otomatis
    cat:      c.type,
    imgSrc:   `/storage/${c.image}`,         // ← path gambar
    imgClass: imgClass,                      // ← class CSS gambar
    desc:     c.description,
    hot:      true,
});

            
export const mapEquipment = (e, imgClass = "equipment-card-img") => ({
    id:       e.id,
    type:     "equipment",
    brand:    e.brand,
    name:     e.name,
    price:    Math.round(e.price_per_day),   // ← dibulatkan dari decimal
    deposit:  Math.round(e.price_per_day) * 2, // ← dihitung otomatis
    cat:      "Aksesoris",
    imgSrc:   `/storage/${e.image}`,         // ← path gambar
    imgClass: imgClass,                      // ← class CSS gambar
    desc:     e.specification,
    hot:      false,
});

        
export const mapSearchResult = (c) => ({
    id:       c.id,
    type:     "camera",
    brand:    c.brand,
    name:     c.name || c.type,
    price:    Math.round(c.price_per_day),   // ← dibulatkan dari decimal
    deposit:  Math.round(c.price_per_day) * 2, // ← dihitung otomatis
    imgSrc:   `/storage/${c.image}`,         // ← path gambar
    imgClass: "camera-card-img",
    desc:     c.description,
});
