
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
