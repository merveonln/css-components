// Yeni Yıl 2026 Geri Sayımı
function updateCountdown() {
    const newYear = new Date('2026-01-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = newYear - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Yeni yıl kutlaması
        document.querySelector('.glitter-text').textContent = '🎉 MUTLU YILLAR 🎉';
    }
}

// Her saniye güncelle
setInterval(updateCountdown, 1000);
updateCountdown();

// Sayfa yüklendiğinde çalıştır
window.addEventListener('load', () => {
    updateCountdown();
});
