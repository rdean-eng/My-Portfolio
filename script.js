const tabIds = ['home', 'about', 'achievements', 'education'];
const themes = ['theme-midnight', 'theme-purple', 'theme-emerald', 'theme-light'];
let activeTab = 'home';
let activeTheme = 0;

const introScreen = document.getElementById('intro-screen');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let finishIntroTimer;

function finishIntro() {
    if (!introScreen?.classList.contains('is-visible')) return;
    introScreen.classList.remove('is-visible');
    introScreen.classList.add('is-leaving');
    introScreen.setAttribute('aria-hidden', 'true');
    clearTimeout(finishIntroTimer);
    window.setTimeout(() => {
        introScreen.style.display = 'none';
        document.querySelector('.nav-btn[data-tab="home"]')?.focus({ preventScroll: true });
    }, 600);
}

if (!reducedMotion && introScreen) {
    introScreen.classList.add('is-visible');
    introScreen.setAttribute('aria-hidden', 'false');
    finishIntroTimer = window.setTimeout(finishIntro, 1450);
} else if (introScreen) {
    introScreen.style.display = 'none';
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finishIntro();
});

function switchTab(tabId, updateHash = true) {
    if (!tabIds.includes(tabId)) return;
    activeTab = tabId;

    document.querySelectorAll('.nav-btn').forEach(link => {
        const isActive = link.dataset.tab === tabId;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        const isActive = panel.id === `tab-${tabId}`;
        panel.classList.toggle('active', isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
    });

    const main = document.querySelector('main.hero');
    main?.classList.toggle('home-profile-layout', tabId === 'home');
    if (updateHash) history.replaceState(null, '', `#${tabId}`);
}

document.querySelectorAll('.nav-btn, [data-go]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const tab = link.dataset.tab || link.dataset.go;
        switchTab(tab);
    });
});

document.getElementById('theme-btn')?.addEventListener('click', () => {
    document.body.classList.remove(...themes);
    activeTheme = (activeTheme + 1) % themes.length;
    document.body.classList.add(themes[activeTheme]);
    const names = ['Midnight', 'Purple', 'Emerald', 'Light'];
    const button = document.getElementById('theme-btn');
    button.textContent = `◉ ${names[activeTheme].toUpperCase()}`;
    button.setAttribute('aria-label', `Color theme: ${names[activeTheme]}. Change theme`);
});

document.addEventListener('keydown', event => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    const lightbox = document.getElementById('lightbox-modal');
    if (isTyping || lightbox?.open) return;
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const nextTab = tabIds[tabIds.indexOf(activeTab) + direction];
    if (direction && nextTab) {
        event.preventDefault();
        switchTab(nextTab);
    }
});

const modal = document.getElementById('lightbox-modal');
const modalImage = document.getElementById('lightbox-img');
const modalCaption = document.getElementById('lightbox-caption');

function openLightbox(image, caption) {
    if (!modal || !modalImage || !image) return;
    modalImage.src = image;
    modalImage.alt = caption || 'Expanded portfolio image';
    modalCaption.textContent = caption || '';
    modal.showModal();
}

function closeLightbox() {
    if (modal?.open) modal.close();
    if (modalImage) modalImage.removeAttribute('src');
}

document.querySelectorAll('.card-media-box img, .about-image img, .family-photo').forEach(item => {
    item.addEventListener('click', () => {
        const image = item.matches('img') ? item : item.querySelector('img');
        if (!image?.complete || image.naturalWidth === 0) return;
        const card = item.closest('.portfolio-card');
        const caption = card?.querySelector('.card-title')?.textContent.trim()
            || item.querySelector('figcaption strong')?.textContent.trim()
            || image.alt;
        openLightbox(image.getAttribute('src') || image.src, caption);
    });
});

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
modal?.addEventListener('click', event => {
    if (event.target === modal) closeLightbox();
});
modal?.addEventListener('close', () => {
    if (modalImage) modalImage.removeAttribute('src');
});

const initialTab = location.hash.slice(1);
switchTab(tabIds.includes(initialTab) ? initialTab : 'home', false);
