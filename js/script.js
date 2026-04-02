// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
    offset: 50,
    easing: 'ease-in-out'
});

// ========================================
// GOOGLE SHEET CONFIGURATION - RSVP
// ========================================
// GANTI DENGAN URL APPS SCRIPT ANDA!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJJhUKOrv3oKaRzn9x6sfk7YyUlUrEK5v9ot07wkYS5JPuKnGt0KBg4VEo5DP3RfVO/exec';

// Fungsi untuk mengirim data ke Google Spreadsheet
async function submitToGoogleSheet(data) {
    try {
        console.log('📤 Mengirim data ke Google Sheet:', data);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('📥 Response dari Google Sheet:', result);
        
        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, error: result.message || result.error };
        }
        
    } catch (error) {
        console.error('❌ Error submitting to Google Sheet:', error);
        
        // Fallback dengan method GET
        try {
            console.log('🔄 Mencoba dengan method GET...');
            const params = new URLSearchParams();
            params.append('name', data.name);
            params.append('guests', data.guests);
            params.append('attendance', data.attendance);
            params.append('message', data.message);
            params.append('guest_to', data.guest_to);
            params.append('timestamp', data.timestamp);
            
            const fallbackResponse = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
                method: 'GET',
                mode: 'cors'
            });
            
            const fallbackResult = await fallbackResponse.json();
            console.log('📥 Fallback response:', fallbackResult);
            
            if (fallbackResult.success) {
                return { success: true, message: fallbackResult.message };
            } else {
                return { success: false, error: fallbackResult.error };
            }
        } catch (fallbackError) {
            console.error('❌ Fallback juga gagal:', fallbackError);
            return { success: false, error: error.message };
        }
    }
}

// ========================================
// LOAD RSVP DATA DARI GOOGLE SHEET
// ========================================
async function loadRSVPFromSheet() {
    try {
        console.log('📥 Mengambil data dari Google Sheet...');
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getData&_=${Date.now()}`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Data dari Google Sheet:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            const messagesDiv = document.getElementById('messages');
            if (!messagesDiv) return;
            
            let grid = document.querySelector('.messages-grid');
            if (grid) {
                grid.remove();
            }
            
            grid = document.createElement('div');
            grid.className = 'messages-grid';
            messagesDiv.appendChild(grid);
            
            const sortedData = [...data.data].reverse();
            sortedData.forEach(msg => {
                addMessageToGrid({
                    name: msg.name,
                    attendance: msg.attendance,
                    guests: msg.guests,
                    message: msg.message,
                    timestamp: msg.timestamp
                });
            });
            
            console.log(`✅ Berhasil memuat ${data.data.length} pesan dari Google Sheet`);
        } else {
            console.log('ℹ️ Tidak ada data dari Google Sheet');
            loadDummyMessages();
        }
    } catch (error) {
        console.error('❌ Error loading data from Google Sheet:', error);
        loadDummyMessages();
    }
}

// ========================================
// Navbar scroll effect
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-custom');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    createRomanticElements();
});

// ========================================
// Audio player dengan scroll trigger
// ========================================
const weddingSong = document.getElementById('weddingSong');
let audioPlayed = false;
let userInteracted = false;

// Buat tombol kontrol musik
const musicControl = document.createElement('button');
musicControl.className = 'music-control';
musicControl.innerHTML = '<i class="fas fa-music"></i>';
musicControl.style.display = 'none';
document.body.appendChild(musicControl);

// Deteksi interaksi pengguna
function handleUserInteraction() {
    if (!userInteracted) {
        userInteracted = true;
        if (!audioPlayed && weddingSong) {
            playMusic();
        }
    }
}

document.addEventListener('click', handleUserInteraction);
document.addEventListener('touchstart', handleUserInteraction);
document.addEventListener('keydown', handleUserInteraction);

function createRomanticElements() {
    if (window.scrollY > 200 && !document.querySelector('.romantic-element')) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'romantic-element';
                heart.innerHTML = '❤️';
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = Math.random() * window.innerHeight + 'px';
                heart.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
                heart.style.fontSize = (20 + Math.random() * 30) + 'px';
                heart.style.opacity = '0.3';
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 5000);
            }, i * 200);
        }
    }
}

window.addEventListener('scroll', function() {
    if (!audioPlayed && !userInteracted && window.scrollY > 100) {
        userInteracted = true;
        playMusic();
    }
});

function playMusic() {
    if (!audioPlayed && weddingSong) {
        weddingSong.play().then(() => {
            audioPlayed = true;
            musicControl.style.display = 'flex';
            musicControl.classList.add('playing');
            musicControl.innerHTML = '<i class="fas fa-pause"></i>';
            showRomanticAnimation();
            console.log('🎵 Musik mulai diputar');
        }).catch(error => {
            console.log('⏸️ Autoplay diblokir. Pengguna perlu klik terlebih dahulu.');
            musicControl.style.display = 'flex';
            musicControl.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
}

function showRomanticAnimation() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.fontSize = (15 + Math.random() * 25) + 'px';
            heart.style.opacity = '0.5';
            heart.style.position = 'fixed';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            document.body.appendChild(heart);
            
            let startTime = null;
            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const progress = (currentTime - startTime) / 3000;
                
                if (progress < 1) {
                    heart.style.transform = `translateY(-${progress * window.innerHeight}px) rotate(${progress * 360}deg)`;
                    heart.style.opacity = 0.5 * (1 - progress);
                    requestAnimationFrame(animate);
                } else {
                    heart.remove();
                }
            }
            requestAnimationFrame(animate);
        }, i * 100);
    }
}

if (musicControl) {
    musicControl.addEventListener('click', function() {
        if (weddingSong && weddingSong.paused) {
            weddingSong.play();
            musicControl.innerHTML = '<i class="fas fa-pause"></i>';
            musicControl.classList.add('playing');
            showRomanticAnimation();
        } else if (weddingSong) {
            weddingSong.pause();
            musicControl.innerHTML = '<i class="fas fa-play"></i>';
            musicControl.classList.remove('playing');
        }
    });
}

// ========================================
// Guest name from URL
// ========================================
function getGuestNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    return guest ? decodeURIComponent(guest) : 'Tamu Undangan';
}

function formatGuestName(name) {
    const lowerCaseWords = ['dan', 'di', 'ke', 'dari', 'atau', 'untuk', 'dengan', '&', 'serta', 'yang'];
    
    const words = name.split(' ');
    
    const formattedWords = words.map(word => {
        if (lowerCaseWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    return formattedWords.join(' ');
}

function displayGuestName() {
    const guestName = getGuestNameFromURL();
    const formattedName = formatGuestName(guestName);
    const guestDisplay = document.getElementById('guest-display');
    if (guestDisplay) {
        guestDisplay.innerHTML = `Kepada Yth. <strong>${escapeHtml(formattedName)}</strong>`;
    }
}

// ========================================
// Countdown timer (9 April 2026)
// ========================================
function updateCountdown() {
    const weddingDate = new Date('April 9, 2026 09:00:00').getTime();
    
    function calculateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days < 0 ? '00' : days;
        if (hoursEl) hoursEl.textContent = hours < 0 ? '00' : (hours < 10 ? '0' + hours : hours);
        if (minutesEl) minutesEl.textContent = minutes < 0 ? '00' : (minutes < 10 ? '0' + minutes : minutes);
        if (secondsEl) secondsEl.textContent = seconds < 0 ? '00' : (seconds < 10 ? '0' + seconds : seconds);
        
        if (distance < 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
        }
    }
    
    calculateCountdown();
    setInterval(calculateCountdown, 1000);
}

// ========================================
// Copy to clipboard function
// ========================================
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Nomor rekening berhasil disalin!', 'success');
    }, function(err) {
        console.error('Gagal menyalin: ', err);
        showNotification('Gagal menyalin, silakan copy manual', 'error');
    });
};

// ========================================
// Smooth scroll for anchor links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// ========================================
// Show notification
// ========================================
function showNotification(message, type) {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// Add message to grid
// ========================================
function addMessageToGrid(data) {
    const messagesDiv = document.getElementById('messages');
    if (!messagesDiv) return;
    
    let grid = document.querySelector('.messages-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'messages-grid';
        messagesDiv.appendChild(grid);
    }
    
    // Cek duplicate
    const existingMessages = grid.querySelectorAll('.message-card');
    let isDuplicate = false;
    existingMessages.forEach(card => {
        const nameEl = card.querySelector('h4');
        if (nameEl && nameEl.textContent === data.name) {
            isDuplicate = true;
        }
    });
    
    if (isDuplicate) return;
    
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';
    messageCard.style.opacity = '0';
    messageCard.style.transform = 'translateY(20px)';
    
    let attendanceClass = '';
    let attendanceText = data.attendance || 'Ragu';
    switch(attendanceText) {
        case 'Hadir':
            attendanceClass = 'hadir';
            break;
        case 'Tidak Hadir':
            attendanceClass = 'tidak-hadir';
            break;
        default:
            attendanceClass = 'ragu';
    }
    
    const guestCount = data.guests || '0';
    const messageText = data.message ? escapeHtml(data.message) : '<em>Tidak ada ucapan</em>';
    const dateText = data.timestamp ? new Date(data.timestamp).toLocaleDateString('id-ID') : '';
    
    messageCard.innerHTML = `
        <h4>${escapeHtml(data.name)}</h4>
        <span class="attendance ${attendanceClass}">${attendanceText}</span>
        <p><small><i class="fas fa-users"></i> ${guestCount} Tamu</small></p>
        <p>${messageText}</p>
        ${dateText ? `<small style="color: #999; font-size: 0.7rem;">${dateText}</small>` : ''}
    `;
    
    grid.appendChild(messageCard);
    
    setTimeout(() => {
        messageCard.style.transition = 'all 0.5s ease';
        messageCard.style.opacity = '1';
        messageCard.style.transform = 'translateY(0)';
    }, 100);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Load dummy messages (fallback)
// ========================================
function loadDummyMessages() {
    const existingMessages = document.querySelectorAll('.message-card');
    if (existingMessages.length > 0) {
        console.log('Messages already exist, skipping dummy data');
        return;
    }
    
    console.log('Loading dummy messages (no data from Google Sheet)');
    const dummyMessages = [
        {
            name: 'Budi Santoso',
            attendance: 'Hadir',
            guests: '2',
            message: 'Selamat menempuh hidup baru Arif & Nurul, semoga menjadi keluarga yang sakinah mawaddah warahmah. Barakallah!',
            timestamp: new Date().toISOString()
        },
        {
            name: 'Ani Wijaya',
            attendance: 'Hadir',
            guests: '1',
            message: 'Wah bahagianya, semoga langgeng selalu ya! Doa terbaik untuk kalian berdua.',
            timestamp: new Date().toISOString()
        },
        {
            name: 'Citra Dewi',
            attendance: 'Ragu',
            guests: '2',
            message: 'Masih konfirmasi jadwal, semoga bisa hadir ya!',
            timestamp: new Date().toISOString()
        }
    ];
    
    dummyMessages.forEach(msg => {
        addMessageToGrid(msg);
    });
}

// ========================================
// Lightbox - Perbaikan error
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lightbox !== 'undefined' && lightbox && typeof lightbox.option === 'function') {
        try {
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true,
                'albumLabel': 'Gambar %1 dari %2',
                'fadeDuration': 300,
                'imageFadeDuration': 300
            });
            console.log('✅ Lightbox initialized');
        } catch(e) {
            console.warn('Lightbox initialization failed:', e);
        }
    } else {
        console.log('Lightbox not loaded, skipping...');
    }
});

// ========================================
// Form submission handler dengan Google Sheet
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    displayGuestName();
    updateCountdown();
    
    // Load data dari Google Sheet
    loadRSVPFromSheet();
    
    const form = document.getElementById('rsvpForm');
    if (!form) {
        console.error('Form RSVP tidak ditemukan!');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Mengirim...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        const nameInput = document.getElementById('name');
        const guestsInput = document.getElementById('guests');
        const attendanceInput = document.getElementById('attendance');
        const messageInput = document.getElementById('message');
        
        const name = nameInput ? nameInput.value : '';
        const guests = guestsInput ? guestsInput.value : '0';
        const attendance = attendanceInput ? attendanceInput.value : 'Ragu';
        const message = messageInput ? messageInput.value : '';
        
        if (!name.trim()) {
            showNotification('Silakan isi nama Anda terlebih dahulu', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        const formData = {
            name: name,
            guests: guests,
            attendance: attendance,
            message: message,
            timestamp: new Date().toISOString(),
            guest_to: getGuestNameFromURL()
        };
        
        // Simpan ke localStorage (backup)
        const existingData = localStorage.getItem('wedding_rsvp_data');
        let rsvpList = existingData ? JSON.parse(existingData) : [];
        rsvpList.push(formData);
        localStorage.setItem('wedding_rsvp_data', JSON.stringify(rsvpList));
        
        // Kirim ke Google Spreadsheet
        const result = await submitToGoogleSheet(formData);
        
        if (result.success) {
            showNotification('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.', 'success');
            addMessageToGrid(formData);
            form.reset();
            showRomanticAnimation();
            
            setTimeout(() => {
                loadRSVPFromSheet();
            }, 2000);
        } else {
            showNotification('Data tersimpan di lokal, akan disinkronkan nanti.', 'warning');
            addMessageToGrid(formData);
            form.reset();
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        const messagesSection = document.getElementById('messages');
        if (messagesSection) {
            messagesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// Parallax effect for hero
// ========================================
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// ========================================
// Add animation on scroll for timeline items
// ========================================
const observerOptionsTimeline = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observerTimeline = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('timeline-visible');
        }
    });
}, observerOptionsTimeline);

document.querySelectorAll('.timeline-item').forEach(item => {
    observerTimeline.observe(item);
});

// ========================================
// Log bahwa website sudah siap
// ========================================
console.log('✅ Wedding website loaded successfully!');
console.log('📝 RSVP Form siap digunakan');
console.log('🔗 Google Sheet URL:', GOOGLE_SCRIPT_URL);