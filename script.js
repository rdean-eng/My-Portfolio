// THEMES CONFIGURATION
const themes = ['theme-midnight', 'theme-purple', 'theme-emerald', 'theme-light'];
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

// TAB NAVIGATION
function switchTab(event, tabId) {
    event.preventDefault();

    // Toggle active class on nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Toggle active tab content panel
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    const selectedTab = document.getElementById('tab-' + tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// BACKGROUND MATRIX RAIN ANIMATION
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{};:';
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(8, 13, 24, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#38bdf8';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 45);
}