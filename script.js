const themes = ['default', 'theme-purple', 'theme-emerald', 'theme-light', 'theme-midnight'];
const themeNames = ['🌙 Default', '💜 Purple', '💚 Emerald', '☀️ Light', '🌌 Midnight'];

function cycleTheme() {
    let currentTheme = localStorage.getItem('portfolio_theme') || 'default';
    let currentIndex = themes.indexOf(currentTheme);
    
    // Fallback if currentTheme isn't found in the array
    if (currentIndex === -1) currentIndex = 0;
    
    // Move to the next theme in the array (loops back to 0 at the end)
    let nextIndex = (currentIndex + 1) % themes.length;
    let nextTheme = themes[nextIndex];
    
    applyTheme(nextTheme);
}

function applyTheme(themeName) {
    // Clear out theme classes from the body
    document.body.className = '';
    
    // Add the new theme class if it's not the default
    if (themeName !== 'default') {
        document.body.classList.add(themeName);
    }
    
    // Save choice to browser memory
    localStorage.setItem('portfolio_theme', themeName);
    
    // Update the button's text and emoji
    const btn = document.querySelector('.theme-toggle-btn');
    if (btn) {
        let index = themes.indexOf(themeName);
        btn.innerHTML = themeNames[index];
    }
}

// Load saved theme automatically on page startup
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('portfolio_theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

