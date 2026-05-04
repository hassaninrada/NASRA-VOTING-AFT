window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }
    }, 800);
});

function updateOnlineStatus() {
    const statusPill = document.querySelector('.status-pill');
    if (statusPill) {
        if (navigator.onLine) {
            document.body.classList.remove('is-offline');
            statusPill.innerHTML = '<div class="pulse-dot"></div> Cloud Election Network Live';
        } else {
            document.body.classList.add('is-offline');
            statusPill.innerHTML = '<div class="pulse-dot"></div> System Operating Offline';
        }
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus(); // Initial check

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register service worker on http/https to avoid protocol errors on local file system
        if (window.location.protocol.startsWith('http')) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('✅ Offline Support Active', reg))
                .catch(err => console.log('❌ Offline Support Failed:', err));
        } else {
            console.log('💡 Offline Support requires a local server (http/https). Double-clicking .html files (file://) is limited.');
        }
    });
}
