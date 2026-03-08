import React, { useMemo, useRef, useEffect } from 'react';
import { resolveMusicTrack } from '../constants/systemMusic';

const TEMPLATE_LOADERS = import.meta.glob('../templates/**/*.html', { as: 'raw' });
const DEFAULT_TEMPLATE_KEY = '../templates/common/default.html';
const LEGACY_KEYS = ['classic', 'royal', 'nature', 'modern', 'default'];

const CAT_DEFAULT_MAP = {
    'uzatu': '../templates/uzatu/template1.html',
    'wedding': '../templates/wedding/template1.html',
    'sundet': '../templates/sundet/template1.html',
    'tusaukeser': '../templates/tusaukeser/template1.html',
    'tusau': '../templates/tusaukeser/template1.html',
    'merei': '../templates/merei/template1.html',
    'besik': '../templates/besik/template1.html'
};

const PALETTES = {
    classic: {
        wine: '#6b1f2e',
        wineDark: '#4a1020',
        wineLight: '#8a2a3e',
        gold: '#c9a96e',
        goldLight: '#e8d5b7',
        cream: '#faf6ef',
        text: '#2a1015',
    },
    royal: {
        wine: '#2f3f6f',
        wineDark: '#1f2c52',
        wineLight: '#445a94',
        gold: '#d4b775',
        goldLight: '#f0e1c0',
        cream: '#f6f8ff',
        text: '#111a30',
    },
    nature: {
        wine: '#1f5d3f',
        wineDark: '#123d29',
        wineLight: '#2f7d56',
        gold: '#d2ba74',
        goldLight: '#efe3bf',
        cream: '#f6fbf7',
        text: '#123323',
    },
    modern: {
        wine: '#1f1f1f',
        wineDark: '#111111',
        wineLight: '#323232',
        gold: '#c7ad74',
        goldLight: '#efe4cd',
        cream: '#f8f8f8',
        text: '#111111',
    },
};

function pad2(n) {
    return String(n).padStart(2, '0');
}

function parseNames(invite) {
    const groomRaw = (invite?.topic1 || '').trim();
    const brideRaw = (invite?.topic2 || '').trim();
    const tpl = invite?.template || '';
    const isWeddingPair = tpl.startsWith('wedding/'); // все свадебные — два человека

    if (!isWeddingPair) {
        const single = groomRaw || brideRaw || (invite?.title || '').trim();
        return { groom: '', bride: single || 'Қонақ' };
    }

    const title = (invite?.title || '').trim();
    const m = title.match(/(.+?)\s*&\s*(.+)/);
    if (m) {
        return { groom: m[1].trim() || 'Жігіт', bride: m[2].trim() || 'Қалыңдық' };
    }
    return { groom: groomRaw || 'Жігіт', bride: brideRaw || 'Қалыңдық' };
}

function normalizeUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
        // If backend saved absolute URL with localhost, rewrite to current host
        if (typeof window !== 'undefined') {
            try {
                const u = new URL(url);
                if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                    return `${window.location.protocol}//${window.location.host}${u.pathname}${u.search}`;
                }
            } catch (_) { /* ignore malformed */ }
        }
        return url;
    }
    if (typeof window === 'undefined') return url;
    // relative path (e.g., /uploads/...)
    return window.location.origin + url;
}

function normalizeTemplateKey(key) {
    if (!key) return DEFAULT_TEMPLATE_KEY;
    if (LEGACY_KEYS.includes(key)) {
        // Try to pick category default if we can guess category from context (passed later) or just fallback
        return DEFAULT_TEMPLATE_KEY;
    }
    let k = key;
    if (k.startsWith('tusau/')) k = k.replace('tusau/', 'tusaukeser/');

    if (k.startsWith('../templates/')) return k;
    if (k.startsWith('templates/')) return `../${k}`;
    return `../templates/${k}`;
}

function buildConfig(invite) {
    const eventDate = invite?.eventDate ? new Date(invite.eventDate) : null;
    const { groom, bride } = parseNames(invite);
    const templateKey = invite?.template || '';
    const isWedding = templateKey.startsWith('wedding/');
    const musicResolved = resolveMusicTrack(invite);

    const gallery = Array.isArray(invite?.gallery)
        ? invite.gallery.filter(Boolean).map(normalizeUrl)
        : [];
    const heroPhotoUrl = normalizeUrl(invite?.previewPhotoUrl || gallery[0] || '');

    const day = eventDate
        ? `${pad2(eventDate.getDate())}-${pad2(eventDate.getMonth() + 1)}-${eventDate.getFullYear()}`
        : '01-01-2027';
    const hour = eventDate
        ? `${pad2(eventDate.getHours())}:${pad2(eventDate.getMinutes())}`
        : '19:00';
    const numericLimit = Number(invite?.maxGuests) || 0;

    return {
        names: { bride, groom },
        day,
        hour,
        location: (invite?.locationName || 'Astana, Farhi Hall').trim(),
        locationUrl: (invite?.locationUrl || '').trim(),
        music: {
            title: (musicResolved.title || invite?.title || 'Наша Песня').trim(),
            artist: (musicResolved.artist || '— загрузите аудио файл —').trim(),
            url: normalizeUrl(musicResolved.url || ''),
            key: musicResolved.key || null,
            source: musicResolved.source || null,
        },
        autoplay: false,
        gallery,
        description: invite?.description || 'Құрметті ағайын-туыс, сізді тойымызға шақырамыз...',
        toiOwners: invite?.toiOwners || '',
        heroPhotoUrl,
        maxGuests: numericLimit,
        isWedding,
        template: templateKey,
    };
}

function applyPalette(html, palette) {
    if (!html) return '';
    if (html.includes('NO_PALETTE')) return html;
    let out = html;
    const vars = {
        '--wine': palette.wine,
        '--wine-dark': palette.wineDark,
        '--wine-light': palette.wineLight,
        '--gold': palette.gold,
        '--gold-light': palette.goldLight,
        '--cream': palette.cream,
        '--text': palette.text,
    };

    Object.entries(vars).forEach(([name, value]) => {
        const rx = new RegExp(`${name}:\\s*#[0-9a-fA-F]{3,8};`);
        out = out.replace(rx, `${name}: ${value};`);
    });
    return out;
}

function injectPhoto(html, url) {
    if (!url) return html;
    const absoluteUrl = normalizeUrl(url);
    const safeUrl = absoluteUrl.replace(/"/g, '&quot;');
    let out = html.replace(
        /<div class="hero-photo-placeholder">[\s\S]*?<\/div>/,
        `<img class="hero-photo-img" src="${safeUrl}" alt="photo">`
    );
    out = out.replace(
        /<div id="heroPhoto"([^>]*)>[\s\S]*?<\/div>/,
        `<div id="heroPhoto"$1><img class="hero-photo-img" src="${safeUrl}" alt="photo" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`
    );
    return out;
}

function injectAutoplay(html, isViewMode) {
    if (!isViewMode) return html;
    const script = `
<script>
(function(){
    function setup() {
        if (typeof CONFIG === 'undefined') return;
        if (!CONFIG.autoplay) return; // editor mode off
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
        const onVisibility = () => { if (!started && document.visibilityState === 'visible') startMusic(); };

        const triggers = [
            [document.body, 'click', startMusic, { once: true }],
            [document.body, 'touchstart', startMusic, { once: true }],
            [document, 'scroll', startMusic, { once: true, passive: true }]
        ];

        btn.addEventListener('click', () => { startMusic(); hideBtn(); });
        audio.addEventListener('canplaythrough', onCanPlay);
        document.addEventListener('visibilitychange', onVisibility);
        triggers.forEach(([el, ev, fn, opts]) => el.addEventListener(ev, fn, opts));

        // Initial attempt after a short delay
        setTimeout(startMusic, 400);

        // Autoscroll kicks in regardless, only in view mode
        startScroll();

        // Cleanup on unload to avoid leaks
        window.addEventListener('unload', cleanup, { once: true });
    }

    function startScroll() {
        const SCROLL_SPEED = 1; // px per frame
        let scrolling = true;
        const stopScroll = () => { scrolling = false; };
        document.addEventListener('touchstart', stopScroll, { once: true });
        document.addEventListener('wheel', stopScroll, { once: true });

        function autoScroll() {
            if (!scrolling) return;
            const maxY = document.documentElement.scrollHeight - window.innerHeight;
            if (window.scrollY >= maxY) { scrolling = false; return; }
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

function injectLiveBridge(html) {
    const bridge = `
<script>
(function(){
    const qs = (sel) => document.querySelector(sel);
    const byId = (id) => document.getElementById(id);
    const setText = (id, text) => { const el = byId(id); if (el) el.textContent = text ?? ''; };
    function apply(cfg){
        if (!cfg) return;
        const dayParts = (cfg.day || '').split('-');
        const dd = dayParts[0] || '';
        const mm = dayParts[1] || '';
        const yy = dayParts[2] || '';
        const tplKey = (cfg.template || '').toString();
        const isWeddingPair = tplKey.startsWith('wedding/');
        const primary = cfg.names?.groom || cfg.names?.bride || '';
        const pair = cfg.names?.bride || '';
        
        const namesLine = (isWeddingPair && pair) 
            ? (pair + ' & ' + (cfg.names?.groom || '')).trim()
            : primary;
            
        const dateLine = [dd, mm, yy].filter(Boolean).join('.') + (cfg.hour ? ' · ' + cfg.hour : '');
        const ownersVal = cfg.toiOwners || '';

        // Primary hero / about texts
        setText('heroName', primary);
        setText('heroNames', namesLine);
        setText('heroNamesLine', (isWeddingPair && pair) ? (cfg.names?.groom + ' & ' + pair) : primary);
        setText('heroNamesInline', (isWeddingPair && pair) ? (cfg.names?.groom + ' & ' + pair) : primary);
        setText('hBride', isWeddingPair ? pair : primary);
        setText('hGroom', isWeddingPair ? primary : '');
        setText('heroDateLine', dateLine);
        setText('hDate', dateLine);
        setText('evDate', [dd, mm, yy].filter(Boolean).join('.'));
        setText('evTime', cfg.hour || '');
        setText('eventText', cfg.description || '');
        setText('locationName', cfg.location || '');
        setText('footLine', (isWeddingPair && pair) ? (pair + ' & ' + primary + '  ·  ' + yy) : (primary + ' · ' + yy));
        setText('footerName', isWeddingPair ? 'Үйлену тойы' : (tplKey.includes('tusau') ? 'Тұсаукесер тойы' : (tplKey.includes('uzatu') ? 'Ұзату тойы' : 'Той')));

        const ownersBlock = byId('ownersBlock');
        const ownersText = byId('ownersText');
        const ownersBig = byId('ownersBigName');
        const ownersSection = byId('ownersSection');
        const ownerTargets = ['ownersLine','ownersName','ownersLabel','ownersLabelTxt'];
        ownerTargets.forEach(id => setText(id, ownersVal));
        if (ownersBlock) {
            if (ownersVal) {
                if (ownersText) ownersText.textContent = ownersVal;
                if (ownersBig) ownersBig.textContent = ownersVal;
                ownersBlock.style.display = 'block';
            } else {
                ownersBlock.style.display = 'none';
            }
        }
        if (ownersBig) ownersBig.textContent = ownersVal || '—';
        if (ownersSection) ownersSection.style.display = ownersVal ? 'block' : 'none';

        const mapBtnWrap = byId('mapBtnWrap');
        const mapBtn = byId('mapBtn');
        if (mapBtnWrap && mapBtn) {
            const has = cfg.locationUrl || cfg.location;
            mapBtnWrap.style.display = has ? 'block' : 'none';
            mapBtn.href = cfg.locationUrl || '#';
            mapBtn.style.pointerEvents = cfg.locationUrl ? 'auto' : 'none';
            mapBtn.style.opacity = cfg.locationUrl ? '1' : '0.55';
        }

        if (cfg.heroPhotoUrl) {
            const heroImg = qs('.hero-photo-img');
            if (heroImg) {
                heroImg.src = cfg.heroPhotoUrl;
            } else {
                const ph = qs('.hero-photo-placeholder');
                if (ph) {
                    const img = document.createElement('img');
                    img.className = 'hero-photo-img';
                    img.src = cfg.heroPhotoUrl;
                    img.alt = 'photo';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    ph.replaceWith(img);
                }
            }
        }

        const slides = byId('gallerySlides');
        if (slides) {
            slides.innerHTML = '';
            if (cfg.gallery && cfg.gallery.length) {
                cfg.gallery.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'photo';
                    img.style.maxWidth = '100%';
                    slides.appendChild(img);
                });
            } else {
                slides.textContent = 'Добавьте фото в галерею';
            }
        }
    }
    window.__APPLY_DYNAMIC_CONFIG = apply;
    // Apply CONFIG immediately on load so text is visible without waiting for postMessage
    setTimeout(function(){ if(typeof CONFIG !== 'undefined') apply(CONFIG); }, 0);
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'UPDATE_CONFIG') {
            apply(e.data.config);
        }
    });
})();
</script>`;
    return html.replace('</body>', `${bridge}\n</body>`);
}

function injectConfig(html, config) {
    return html
        .replace(
            /const CONFIG = \{[\s\S]*?\};/,
            `const CONFIG = ${JSON.stringify(config, null, 8)};`
        )
        .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${(config?.music?.title || 'Wedding Invitation').replace(/</g, '&lt;')}</title>`
        );
}

function injectRsvpApi(html, inviteId, maxGuests) {
    if (!inviteId) return html;
    const limit = maxGuests || 0;
    const script = `
<script>
    (function () {
        // --- Replace guest-opt buttons / readonly counter with editable number input ---
        var MAX_GUESTS = ${limit};
        window.addEventListener('DOMContentLoaded', function() {
            // Remove guest-opt buttons
            document.querySelectorAll('.guest-opt').forEach(function(b) { b.style.display = 'none'; });
            // Make rGuests input editable
            var gInput = document.getElementById('rGuests');
            if (gInput) {
                gInput.removeAttribute('readonly');
                gInput.type = 'number';
                gInput.min = '1';
                if (MAX_GUESTS > 0) {
                    gInput.max = String(MAX_GUESTS);
                } else {
                    gInput.removeAttribute('max'); // unlimited
                }
                gInput.value = '1';
                gInput.style.width = '80px';
                gInput.style.textAlign = 'center';
                gInput.style.display = 'block';
                gInput.style.margin = '8px auto';
                var clampGuests = function() {
                    var v = parseInt(gInput.value, 10) || 1;
                    v = Math.max(1, v);
                    if (MAX_GUESTS > 0) v = Math.min(v, MAX_GUESTS);
                    gInput.value = String(v);
                };
                gInput.addEventListener('input', clampGuests);
                gInput.addEventListener('change', clampGuests);
            }
        });

        // Override changeGuests to respect MAX_GUESTS and editable input
        window.changeGuests = function changeGuests(delta) {
            var inp = document.getElementById('rGuests');
            if (!inp) return;
            var next = parseInt(inp.value || '1', 10) + (delta || 0);
            if (isNaN(next)) next = 1;
            next = Math.max(1, next);
            if (MAX_GUESTS > 0) next = Math.min(next, MAX_GUESTS);
            inp.value = String(next);
        };

        window.submitRSVP = async function submitRSVP() {
            var nameEl = document.getElementById('rName');
            var phoneEl = document.getElementById('rPhone');
            var noteEl = document.getElementById('rNote');
            var formEl = document.getElementById('rsvpForm');
            var successEl = document.getElementById('successMsg');
            if (!nameEl || !phoneEl || !formEl || !successEl) return;

            var name = (nameEl.value || '').trim();
            var phone = (phoneEl.value || '').trim();
            if (!name) { nameEl.focus(); return; }
            if (!phone) { phoneEl.focus(); return; }

            var err = document.getElementById('rsvpError');
            if (!err) {
                err = document.createElement('div');
                err.id = 'rsvpError';
                err.style.color = '#8b1e1e';
                err.style.fontFamily = "'Cinzel', serif";
                err.style.fontSize = '10px';
                err.style.letterSpacing = '1.5px';
                err.style.margin = '8px 0 14px';
                formEl.insertBefore(err, formEl.querySelector('.submit-btn'));
            }
            err.textContent = '';

            var guestsInput = document.getElementById('rGuests');
            var guestsCount = Math.max(1, parseInt(guestsInput ? guestsInput.value : '1', 10) || 1);

            // Client-side maxGuests validation
            if (MAX_GUESTS > 0 && guestsCount > MAX_GUESTS) {
                err.textContent = '\u049a\u043e\u043d\u0430\u049b \u0441\u0430\u043d\u044b \u043b\u0438\u043c\u0438\u0442\u0456: ' + MAX_GUESTS;
                if (guestsInput) guestsInput.value = String(MAX_GUESTS);
                return;
            }

            try {
                var res = await fetch('/api/v1/invites/${inviteId}/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        guestName: name,
                        phone: phone || null,
                        guestsCount: guestsCount,
                        attending: true,
                        note: (noteEl ? noteEl.value : '').trim() || null
                    })
                });

                if (!res.ok) {
                    var data = await res.json().catch(function() { return {}; });
                    throw new Error(data.message || '\u0416\u0456\u0431\u0435\u0440\u0443 \u0441\u04d9\u0442\u0441\u0456\u0437 \u0431\u043e\u043b\u0434\u044b');
                }

                formEl.style.display = 'none';
                successEl.style.display = 'block';
            } catch (e) {
                err.textContent = e.message || '\u049a\u0430\u0442\u0435 \u043e\u0440\u044b\u043d \u0430\u043b\u0434\u044b';
            }
        };
    })();
</script>
`;
    return html.replace('</body>', `${script}\n</body>`);
}

function localizeTemplate(html, lang) {
    if (lang !== 'kk') return html;
    let out = html.replace('<html lang="ru">', '<html lang="kk">');

    const pairs = [
        ['Приглашение на свадьбу', 'Үйлену тойына шақыру'],
        ['Прокрутите вниз', 'Төмен қарай жылжытыңыз'],
        ['До торжества осталось', 'Тойға дейін'],
        ['Дней', 'Күн'],
        ['Часов', 'Сағат'],
        ['Минут', 'Минут'],
        ['Секунд', 'Секунд'],
        ['Наша музыка', 'Біздің музыка'],
        ['Наша Песня', 'Біздің ән'],
        ['— загрузите аудио файл —', '— аудио файлын жүктеңіз —'],
        ['Загрузить музыку', 'Музыканы жүктеу'],
        ['Перемотать', 'Артқа'],
        ['Вперёд', 'Алға'],
        ['Фото', 'Фотолар'],
        ['Ваш ответ', 'Сіздің жауабыңыз'],
        ['Пожалуйста, подтвердите присутствие', 'Қатысатыныңызды растаңыз'],
        ['Ваше имя', 'Атыңыз'],
        ['Введите ваше имя', 'Атыңызды жазыңыз'],
        ['Телефон', 'Телефон'],
        ['Количество гостей', 'Қонақ саны'],
        ['1 Гость', '1 қонақ'],
        ['2 Гостя', '2 қонақ'],
        ['3 Гостя', '3 қонақ'],
        ['Пожелания / Меню', 'Тілектер / Мәзір'],
        ['Аллергии, особые пожелания...', 'Аллергия, тілектер...'],
        ['Подтвердить присутствие', 'Қатысамын деп растау'],
        ['Спасибо! Ждём вас на нашем торжестве.', 'Рахмет! Тойда күтеміз.'],
        ['Начало в ${CONFIG.hour}  ·  ${CONFIG.location}', 'Басталуы ${CONFIG.hour}  ·  ${CONFIG.location}'],
        ['Добавьте несколько фотографий — карусель появится здесь.', 'Бірнеше фото жүктеңіз — галерея осында шығады.'],
    ];

    pairs.forEach(([ru, kk]) => {
        out = out.replace(new RegExp(ru, 'g'), kk);
    });

    out = out.replace(
        /<span>Пн<\/span><span>Вт<\/span><span>Ср<\/span>\s*<span>Чт<\/span><span>Пт<\/span><span>Сб<\/span><span>Vс<\/span>/,
        '<span>Дс</span><span>Сс</span><span>Ср</span><span>Бс</span><span>Жм</span><span>Сб</span><span>Жс</span>'
    );

    out = out.replace(
        /const MONTHS_RU = \[[^\]]+\];/,
        'const MONTHS_RU = ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];'
    );
    out = out.replace(
        /const MONTHS_GEN = \[[^\]]+\];/,
        'const MONTHS_GEN = ["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"];'
    );

    return out;
}

function pickPalette(invite) {
    const tpl = invite?.template || '';
    const parts = tpl.split('/');
    const category = parts[0] || '';
    const fileName = (parts[parts.length - 1] || '').replace('.html', '');
    const candidates = [
        fileName,
        category,
        LEGACY_KEYS.includes(tpl) ? tpl : null,
        'classic',
    ].filter(Boolean);
    const key = candidates.find(k => PALETTES[k]);
    return PALETTES[key] || PALETTES.classic;
}

function buildTemplate2Html(invite, htmlSource, { enableRsvp = false, inviteId = null, lang = 'kk', mode = 'edit' } = {}) {
    const palette = pickPalette(invite);
    const isViewMode = mode === 'view';
    const config = { ...buildConfig(invite || {}), autoplay: isViewMode };
    const heroUrl = invite?.previewPhotoUrl || config.gallery?.[0] || '';

    const tplKey = normalizeTemplateKey(invite?.template);
    const skipPalette = tplKey.includes('/wedding/template4.html') || (htmlSource && /NO_PALETTE/i.test(htmlSource));
    let html = htmlSource;
    html = skipPalette ? html : applyPalette(html, palette);
    html = injectConfig(html, config);
    html = injectPhoto(html, heroUrl);
    if (enableRsvp) {
        html = injectRsvpApi(html, inviteId, config.maxGuests);
    }
    html = injectAutoplay(html, isViewMode);
    html = injectLiveBridge(html);
    html = localizeTemplate(html, lang);
    return html;
}

const Template2Frame = ({ invite, inviteId = null, enableRsvp = false, style, className, lang = 'kk', mobileZoom = false, mode = 'edit' }) => {
    const iframeRef = useRef(null);
    const [html, setHtml] = React.useState('');
    const [templateKey, setTemplateKey] = React.useState(() => normalizeTemplateKey(invite?.template));

    const getOptimalFallback = () => {
        const tpl = invite?.template || '';
        const cat = tpl.split('/')[0];
        return CAT_DEFAULT_MAP[cat] || DEFAULT_TEMPLATE_KEY;
    };

    // Async template loading
    useEffect(() => {
        const nextKey = normalizeTemplateKey(invite?.template);
        let active = true;

        const load = async () => {
            const loader = TEMPLATE_LOADERS[nextKey] || TEMPLATE_LOADERS[getOptimalFallback()];
            if (!loader) return;
            try {
                const raw = await loader();
                if (active) {
                    const fullHtml = buildTemplate2Html(invite, raw, { enableRsvp, inviteId, lang, mode });
                    setHtml(fullHtml);
                    setTemplateKey(nextKey);
                }
            } catch (err) {
                console.error('Template load failed:', err);
            }
        };

        load();
        return () => { active = false; };
    }, [invite?.template, enableRsvp, inviteId, lang, mode, invite?.previewPhotoUrl, invite?.gallery, invite?.musicUrl, invite?.musicKey, invite?.musicSource]);

    const isEmptyInvite = useMemo(() => {
        if (!invite) return true;
        const hasMain =
            (invite.title && invite.title.trim()) ||
            (invite.topic1 && invite.topic1.trim()) ||
            (invite.topic2 && invite.topic2.trim()) ||
            (invite.description && invite.description.trim()) ||
            invite.eventDate ||
            (invite.previewPhotoUrl && invite.previewPhotoUrl.trim()) ||
            (Array.isArray(invite.gallery) && invite.gallery.length > 0);
        return !hasMain;
    }, [invite]);

    const liveConfig = useMemo(() => buildConfig(invite || {}), [invite]);
    const prevHashRef = useRef('');

    // Send live config updates instantly (no debounce) for reactive text preview
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;
        const hash = JSON.stringify(liveConfig);
        if (hash === prevHashRef.current) return;
        prevHashRef.current = hash;
        iframe.contentWindow.postMessage({ type: 'UPDATE_CONFIG', config: liveConfig }, '*');
    }, [liveConfig]);

    // Re-send config when iframe finishes loading (srcDoc loads asynchronously)
    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;
        // Force re-send so text is always up to date after iframe reload
        prevHashRef.current = '';
        iframe.contentWindow.postMessage({ type: 'UPDATE_CONFIG', config: liveConfig }, '*');
    };

    if (mode === 'edit' && isEmptyInvite) {
        return (
            <div
                className={className}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: mobileZoom ? '70vh' : '100%',
                    borderRadius: '16px',
                    border: '1px dashed #d7e9df',
                    background: '#f7fff9',
                    color: '#173f33',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '28px',
                    boxSizing: 'border-box',
                    ...style,
                }}
            >
                <div style={{ maxWidth: '360px', lineHeight: 1.4, fontFamily: 'Manrope, sans-serif' }}>
                    <div style={{ fontWeight: 800, marginBottom: '6px' }}>Алдын ала қарау</div>
                    <div style={{ fontSize: '14px', color: '#5f7f73' }}>
                        Шаблон осы жерде көрсетіледі. Фото, атаулар немесе күнді қосыңыз — превью бірден жаңартылады.
                    </div>
                </div>
            </div>
        );
    }

    if (!html && !isEmptyInvite) {
        return (
            <div style={{
                width: '100%', height: '100%', background: '#F8FFFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#10B981', fontFamily: 'Manrope, sans-serif'
            }}>
                Жүктелуде...
            </div>
        );
    }

    return (
        <iframe
            ref={iframeRef}
            title="template-2-preview"
            srcDoc={html}
            onLoad={handleIframeLoad}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                minHeight: mobileZoom ? '70vh' : '100%',
                border: 'none',
                background: 'transparent',
                transform: mobileZoom ? 'scale(1.05)' : 'none',
                transformOrigin: 'top center',
                ...style,
            }}
        />
    );
};

export default Template2Frame;
