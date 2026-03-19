export function injectAutoplay(html, isViewMode) {
    if (!isViewMode) return html;

    const script = `
<script>
(function(){
    function setup() {
        if (typeof CONFIG === 'undefined') return;
        if (!CONFIG.autoplay) return;
        if (!CONFIG.music || !CONFIG.music.url) {
            startScroll();
            return;
        }

        let started = false;
        const audio = new Audio(CONFIG.music.url);
        audio.volume = 0.4;
        audio.loop = true;
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';

        const btn = document.createElement('button');
        btn.textContent = '▶ Музыка';
        btn.id = 'music-autoplay-btn';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999,
            padding: '10px 14px', borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'rgba(255,255,255,0.9)',
            color: '#1f2937', fontWeight: '700', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            cursor: 'pointer', display: 'none'
        });
        document.body.appendChild(btn);

        const showBtn = () => { if (!started) btn.style.display = 'block'; };
        const hideBtn = () => { btn.style.display = 'none'; };

        const cleanup = () => {
            triggers.forEach(([el, ev, fn, opts]) => el.removeEventListener(ev, fn, opts));
            audio.removeEventListener('canplaythrough', onCanPlay);
            document.removeEventListener('visibilitychange', onVisibility);
        };

        const startMusic = () => {
            if (started) return;
            started = true;
            audio.play().then(() => { hideBtn(); cleanup(); }).catch(() => showBtn());
        };

        const onCanPlay = () => startMusic();
        const onVisibility = () => {
            if (!started && document.visibilityState === 'visible') startMusic();
        };

        const triggers = [
            [document.body, 'click', startMusic, { once: true }],
            [document.body, 'touchstart', startMusic, { once: true }],
            [document, 'scroll', startMusic, { once: true, passive: true }]
        ];

        btn.addEventListener('click', () => { startMusic(); hideBtn(); });
        audio.addEventListener('canplaythrough', onCanPlay);
        document.addEventListener('visibilitychange', onVisibility);
        triggers.forEach(([el, ev, fn, opts]) => el.addEventListener(ev, fn, opts));

        setTimeout(startMusic, 400);
        startScroll();
        window.addEventListener('unload', cleanup, { once: true });
    }

    function startScroll() {
        const SCROLL_SPEED = 1;
        let scrolling = true;

        const stopScroll = () => { scrolling = false; };
        document.addEventListener('touchstart', stopScroll, { once: true });
        document.addEventListener('wheel', stopScroll, { once: true });

        function autoScroll() {
            if (!scrolling) return;
            const maxY = document.documentElement.scrollHeight - window.innerHeight;
            if (window.scrollY >= maxY) {
                scrolling = false;
                return;
            }
            window.scrollBy({ top: SCROLL_SPEED, behavior: 'instant' });
            requestAnimationFrame(autoScroll);
        }

        setTimeout(() => requestAnimationFrame(autoScroll), 1200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup, { once: true });
    } else {
        setup();
    }
})();
</script>`;

    return html.replace('</body>', `${script}\n</body>`);
}

export function applyTemplateEnhancements(html, { isViewMode = false } = {}) {
    return injectAutoplay(html, isViewMode);
}
