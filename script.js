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
    "education"
];

let currentTabIndex = 0;
let familySwitchTimer = null;
let familyAutoplayPaused = false;
let familyTransitionTimer = null;

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

    // Hide the profile on personal, achievements, and family pages.
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        if (['achievements', 'about', 'education'].includes(tabId)) {
            heroSection.classList.add('hide-photo');
        } else {
            heroSection.classList.remove('hide-photo');
        }
        heroSection.classList.toggle('home-profile-layout', tabId === 'home');
    }

    if (tabId === 'education') {
        scheduleFamilySwitch(3000);
    } else {
        clearTimeout(familySwitchTimer);
        familySwitchTimer = null;
        clearTimeout(familyTransitionTimer);
        familyTransitionTimer = null;
        document.querySelectorAll('.family-view.is-transitioning-out').forEach(view => {
            view.hidden = true;
            view.classList.remove('is-transitioning-out');
        });
        document.querySelectorAll('.family-view.is-transitioning-in').forEach(view => view.classList.remove('is-transitioning-in'));
    }

    // Update Previous and Continue buttons
    updateNavigationButtons();
}

function scheduleFamilySwitch(delay) {
    clearTimeout(familySwitchTimer);
    familySwitchTimer = null;
    if (currentTabIndex !== tabs.indexOf('education') || familyAutoplayPaused) return;

    familySwitchTimer = setTimeout(() => {
        const activeSection = document.querySelector('.family-view.active');
        const nextSection = activeSection?.id === 'family-section' ? 'friends' : 'family';
        showFamilySection(nextSection);
    }, delay);
}

function toggleFamilyAutoplay() {
    familyAutoplayPaused = !familyAutoplayPaused;
    const button = document.getElementById('family-autoplay-toggle');
    if (button) {
        button.textContent = familyAutoplayPaused ? '▶ Play' : 'Ⅱ Pause';
        button.setAttribute('aria-pressed', String(familyAutoplayPaused));
        button.setAttribute('aria-label', familyAutoplayPaused ? 'Resume automatic Family and Friends switching' : 'Pause automatic Family and Friends switching');
    }

    if (familyAutoplayPaused) {
        clearTimeout(familySwitchTimer);
        familySwitchTimer = null;
    } else {
        scheduleFamilySwitch(3000);
    }
}

function positionFamilyClickCue(selectedSection) {
    const cue = document.querySelector('.family-click-cue');
    const targetButton = document.querySelector(`.family-title-link[onclick*="'${selectedSection === 'family' ? 'friends' : 'family'}'"]`);
    if (cue && targetButton) targetButton.insertAdjacentElement('afterend', cue);
}

function showFamilySection(section) {
    const targetView = document.getElementById(`${section}-section`);
    const currentView = document.querySelector('.family-view.active');

    clearTimeout(familyTransitionTimer);
    document.querySelectorAll('.family-view.is-transitioning-out').forEach(view => {
        view.hidden = true;
        view.classList.remove('is-transitioning-out');
    });

    if (targetView && targetView !== currentView) {
        if (currentView) {
            currentView.classList.remove('active');
            currentView.classList.add('is-transitioning-out');
        }
        targetView.hidden = false;
        targetView.classList.add('active', 'is-transitioning-in');
        requestAnimationFrame(() => targetView.classList.remove('is-transitioning-in'));
        if (currentView) {
            familyTransitionTimer = setTimeout(() => {
                currentView.hidden = true;
                currentView.classList.remove('is-transitioning-out');
                familyTransitionTimer = null;
            }, 3000);
        }
    }

    document.querySelectorAll('.family-title-link').forEach(button => {
        const active = button.textContent.trim().toLowerCase() === section;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });

    positionFamilyClickCue(section);
    scheduleFamilySwitch(3000);
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
    // Reapply the initial tab state so the home layout and navigation stay in sync.
    switchTab(null, 'home');
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
    // Bind click events to achievement and profile images.
    document.querySelectorAll('.card-media-box img, .about-image img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();

            // Do not open a preview when the image file is missing.
            if (!img.complete || img.naturalWidth === 0) {
                return;
            }
            
            // Ensure we grab the actual image source and card title
            const imgSrc = img.getAttribute('src') || img.src;
            const card = img.closest('.portfolio-card');
            const titleEl = card ? card.querySelector('.card-title') : img.closest('.family-photo')?.querySelector('figcaption strong');
            const caption = titleEl ? titleEl.textContent.trim() : (img.alt || 'View');

            if (imgSrc) {
                openLightbox(imgSrc, caption);
            }
        });
    });

    // Make the entire family/friends photo card open its image, including the caption area.
    document.querySelectorAll('.family-photo').forEach(photo => {
        photo.addEventListener('click', () => {
            const img = photo.querySelector('img');
            if (!img?.complete || img.naturalWidth === 0) return;

            const imgSrc = img.getAttribute('src') || img.src;
            const caption = photo.querySelector('figcaption strong')?.textContent.trim() || img.alt || 'View';
            if (imgSrc) openLightbox(imgSrc, caption);
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
