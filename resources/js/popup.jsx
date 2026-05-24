export default function PaymentPopup({ onClose }) {
    return (
        <div className="popup">
        <div className="popup-content">
            <h2>Pembayaran Berhasil ✅</h2>
            <p>Terima kasih, pesanan kamu sudah diproses.</p>
            <button onClick={onClose}>Tutup</button>
        </div>
        </div>
    );
}
