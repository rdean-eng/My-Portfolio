// ==========================================
// THEMES CONFIGURATION
// ==========================================

const themes = [
    'theme-midnight',
    'theme-purple',
    'theme-emerald',
    'theme-light'
];

let currentThemeIndex = 0;

function cycleTheme() {

    // Remove active theme class
    document.body.classList.remove(themes[currentThemeIndex]);

    // Move to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    // Apply new theme class
    const nextTheme = themes[currentThemeIndex];
    document.body.classList.add(nextTheme);

    // Update Theme Toggle Button Label
    const themeBtn = document.getElementById('theme-btn');

    const themeNames = {
        'theme-midnight': '🎨 Midnight',
        'theme-purple': '🔮 Purple',
        'theme-emerald': '🌿 Emerald',
        'theme-light': '☀️ Light'
    };

    if (themeBtn) {
        themeBtn.textContent = themeNames[nextTheme];
    }
}


// ==========================================
// TAB NAVIGATION
// ==========================================

const tabs = [
    "home",
    "about",
    "achievements",
    "education",
    "family"
];

let currentTabIndex = 0;

function switchTab(event, tabId) {

    // Allow navigation without a click event
    if (event) {
        event.preventDefault();
    }

    // Find selected tab
    const tabIndex = tabs.indexOf(tabId);

    // Prevent invalid tab selection
    if (tabIndex === -1) {
        return;
    }

    // Update current tab index
    currentTabIndex = tabIndex;

    // Update active navigation button
    document.querySelectorAll('.nav-btn').forEach(btn => {

        btn.classList.remove('active');

        if (btn.getAttribute('onclick')?.includes(`'${tabId}'`)) {
            btn.classList.add('active');
        }
    });

    // Update active tab content
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const selectedTab = document.getElementById('tab-' + tabId);

    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // CONTROL PROFILE PHOTO VISIBILITY
    // Hides the left column photo specifically on the achievements tab
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        if (tabId === 'achievements') {
            heroSection.classList.add('hide-photo');
        } else {
            heroSection.classList.remove('hide-photo');
        }
    }

    // Update Previous and Continue buttons
    updateNavigationButtons();
}


// ==========================================
// PREVIOUS / CONTINUE NAVIGATION
// ==========================================

function navigateTab(direction) {

    const nextIndex = currentTabIndex + direction;

    // Prevent navigating outside available tabs
    if (nextIndex < 0 || nextIndex >= tabs.length) {
        return;
    }

    // Switch to the selected tab
    switchTab(null, tabs[nextIndex]);
}


// ==========================================
// Navigate between portfolio pages with the keyboard arrow keys.
document.addEventListener('keydown', event => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (
        target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
    const lightbox = document.getElementById('lightbox-modal');

    if (isTyping || lightbox?.classList.contains('active')) {
        return;
    }

    if (event.key === 'ArrowLeft' && currentTabIndex > 0) {
        event.preventDefault();
        navigateTab(-1);
    } else if (event.key === 'ArrowRight' && currentTabIndex < tabs.length - 1) {
        event.preventDefault();
        navigateTab(1);
    }
});
// UPDATE NAVIGATION BUTTON STATES
// ==========================================

function updateNavigationButtons() {

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Disable Previous on the first tab
    if (prevBtn) {
        prevBtn.disabled = currentTabIndex === 0;
    }

    // Disable Continue on the last tab
    if (nextBtn) {
        nextBtn.disabled = currentTabIndex === tabs.length - 1;
    }
}


// ==========================================
// BACKGROUND MATRIX RAIN ANIMATION
// ==========================================

const canvas = document.getElementById('matrix-canvas');

if (canvas) {

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Recalculate columns when window resizes
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    }

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{};:';
    const fontSize = 13;

    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(1);

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    function drawMatrix() {

        ctx.fillStyle = 'rgba(8, 13, 24, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#38bdf8';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {

            const text = chars.charAt(
                Math.floor(Math.random() * chars.length)
            );

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (
                drops[i] * fontSize > canvas.height &&
                Math.random() > 0.975
            ) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 45);
}


// ==========================================
// INITIALIZE NAVIGATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // Set initial button states
    updateNavigationButtons();

});

// ==========================================
// LIGHTBOX EXPAND PHOTO MODAL (FIXED)
// ==========================================

function openLightbox(imgSrc, captionText) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');

    if (modal && modalImg && imgSrc) {
        modalImg.src = imgSrc;
        modalCaption.textContent = captionText || 'Achievement / Certificate';
        modal.classList.add('active');
        if (!modal.open) modal.showModal();
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    if (modal) {
        modal.classList.remove('active');
        if (modal.open) modal.close();
        if (modalImg) modalImg.src = ''; // Clear source on close to prevent ghost previews
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Bind click events to every image inside card media boxes
    document.querySelectorAll('.card-media-box img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();

            // Do not open a preview when the image file is missing.
            if (!img.complete || img.naturalWidth === 0) {
                return;
            }
            
            // Ensure we grab the actual image source and card title
            const imgSrc = img.getAttribute('src') || img.src;
            const card = img.closest('.portfolio-card');
            const titleEl = card ? card.querySelector('.card-title') : null;
            const caption = titleEl ? titleEl.textContent.trim() : (img.alt || 'View');

            if (imgSrc) {
                openLightbox(imgSrc, caption);
            }
        });
    });

    // Close lightbox when pressing the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});

// OPEN/CLOSE THE PORTFOLIO FOLDER POP-UPS
function openPortfolioDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog && !dialog.open) dialog.showModal();
}

function closePortfolioDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (dialog?.open) dialog.close();
}

document.querySelectorAll('.portfolio-dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
});
