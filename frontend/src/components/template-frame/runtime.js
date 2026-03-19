import { resolveMusicTrack } from '../../constants/systemMusic';
import {
    getCategoryFromTemplateId,
    getTemplateEventLabel,
    getTemplateMeta,
    resolveTemplateId,
} from '../../config/templates/templateRegistry';

export const PALETTES = {
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

export function trByLang(lang, kk, ru) {
    return lang === 'ru' ? (ru ?? kk ?? '') : (kk ?? ru ?? '');
}

export function pad2(n) {
    return String(n).padStart(2, '0');
}

export function getNormalizedTemplate(invite) {
    return resolveTemplateId(
        invite?.template,
        getCategoryFromTemplateId(invite?.template)
    );
}

export function getTemplateMetaForInvite(invite) {
    return getTemplateMeta(getNormalizedTemplate(invite)) || null;
}

export function isPairTemplate(invite) {
    return !!getTemplateMetaForInvite(invite)?.features?.pairNames;
}

export function parseNames(invite) {
    const firstRaw = (invite?.topic1 || '').trim();
    const secondRaw = (invite?.topic2 || '').trim();
    const hasPairNames = isPairTemplate(invite);

    if (!hasPairNames) {
        const single = firstRaw || secondRaw || (invite?.title || '').trim();
        return { groom: '', bride: single || 'Қонақ' };
    }

    const title = (invite?.title || '').trim();
    const pairFromTitle = title.match(/(.+?)\s*&\s*(.+)/);

    if (pairFromTitle) {
        return {
            groom: pairFromTitle[1].trim() || 'Жігіт',
            bride: pairFromTitle[2].trim() || 'Қалыңдық',
        };
    }

    return {
        groom: firstRaw || 'Жігіт',
        bride: secondRaw || 'Қалыңдық',
    };
}

export function normalizeUrl(url) {
    if (!url) return '';

    if (/^https?:\/\//i.test(url)) {
        if (typeof window !== 'undefined') {
            try {
                const u = new URL(url);
                if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                    return `${window.location.protocol}//${window.location.host}${u.pathname}${u.search}`;
                }
            } catch (_) {
                // ignore malformed
            }
        }
        return url;
    }

    if (typeof window === 'undefined') return url;
    return window.location.origin + url;
}

export function buildConfig(invite, lang = 'kk') {
    const eventDate = invite?.eventDate ? new Date(invite.eventDate) : null;
    const { groom, bride } = parseNames(invite);
    const templateKey = getNormalizedTemplate(invite);
    const templateMeta = getTemplateMetaForInvite(invite);

    const hasPairNames = !!templateMeta?.features?.pairNames;
    const supportsGallery = templateMeta?.features?.gallery ?? true;
    const supportsMusic = templateMeta?.features?.music ?? true;
    const supportsMap = templateMeta?.features?.map ?? true;

    const musicResolved = resolveMusicTrack(invite);

    const gallery = supportsGallery && Array.isArray(invite?.gallery)
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
        locationUrl: supportsMap ? (invite?.locationUrl || '').trim() : '',
        music: {
            title: supportsMusic
                ? (musicResolved.title || invite?.title || trByLang(lang, 'Біздің ән', 'Наша песня')).trim()
                : '',
            artist: supportsMusic
                ? (musicResolved.artist || trByLang(lang, '— аудио файлын жүктеңіз —', '— загрузите аудио файл —')).trim()
                : '',
            url: supportsMusic ? normalizeUrl(musicResolved.url || '') : '',
            key: supportsMusic ? (musicResolved.key || null) : null,
            source: supportsMusic ? (musicResolved.source || null) : null,
        },
        autoplay: false,
        gallery,
        description: invite?.description || trByLang(
            lang,
            'Құрметті ағайын-туыс, сізді тойымызға шақырамыз...',
            'Дорогие родные и близкие, приглашаем вас на наше торжество...'
        ),
        toiOwners: invite?.toiOwners || '',
        heroPhotoUrl,
        maxGuests: numericLimit,
        isWedding: hasPairNames,
        isPairInvite: hasPairNames,
        eventLabel: getTemplateEventLabel(templateKey, lang),
        template: templateKey,
        lang,
        features: {
            pairNames: hasPairNames,
            gallery: supportsGallery,
            music: supportsMusic,
            map: supportsMap,
        },
    };
}

export function applyPalette(html, palette) {
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

export function injectPhoto(html, url) {
    if (!url) return html;

    const absoluteUrl = normalizeUrl(url);
    const safeUrl = absoluteUrl.replace(/"/g, '&quot;');

    let out = html.replace(
        /<div\s+class="hero-photo-placeholder"[^>]*>[\s\S]*?<\/div>/i,
        `<img class="hero-photo-img" src="${safeUrl}" alt="photo">`
    );

    out = out.replace(
        /(<div\s+[^>]*?id="heroPhoto"[^>]*>)([\s\S]*?)(<\/div>)/i,
        (match, open, inner, close) => {
            if (inner.includes('<img')) {
                const updatedInner = inner.replace(
                    /(<img\s+[^>]*?src=")([^"]*)("[^>]*>)/i,
                    (m) => {
                        let res = m;
                        if (!m.includes('hero-photo-img')) {
                            res = m.replace(/<img/i, '<img class="hero-photo-img"');
                        }
                        return res.replace(/(src=")([^"]*)(")/i, `$1${safeUrl}$3`);
                    }
                );
                return open + updatedInner + close;
            }

            return (
                open +
                `<img class="hero-photo-img" src="${safeUrl}" alt="photo" style="width:100%;height:100%;object-fit:cover;display:block;">` +
                close
            );
        }
    );

    if (out === html) {
        out = html.replace(
            /(<img[^>]+class="[^"]*hero-photo-img[^"]*"[^>]*src=")([^"]*)(")/i,
            `$1${safeUrl}$3`
        );
    }

    return out;
}

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

export function injectLiveBridge(html) {
    const bridge = `
<script>
(function(){
    const qs = (sel) => document.querySelector(sel);
    const byId = (id) => document.getElementById(id);
    const setText = (id, text) => {
        const el = byId(id);
        if (el) el.textContent = text ?? '';
    };

    function apply(cfg){
        if (!cfg) return;

        const dayParts = (cfg.day || '').split('-');
        const dd = dayParts[0] || '';
        const mm = dayParts[1] || '';
        const yy = dayParts[2] || '';
        const lang = (cfg.lang || 'kk').toString();
        const isPairInvite = !!cfg.isPairInvite;

        const primary = cfg.childName || cfg.names?.child || cfg.names?.groom || cfg.names?.bride || cfg.title || '';
        const pair = cfg.names?.bride || '';
        const photoUrl = cfg.heroPhotoUrl || cfg.previewPhotoUrl || cfg.heroPhoto || (cfg.gallery && cfg.gallery[0]) || '';

        const namesLine = (isPairInvite && pair)
            ? (pair + ' & ' + (cfg.names?.groom || '')).trim()
            : primary;

        const dateLine = [dd, mm, yy].filter(Boolean).join('.') + (cfg.hour ? ' · ' + cfg.hour : '');
        const ownersVal = cfg.toiOwners || '';

        setText('heroName', primary);
        setText('heroNames', namesLine);
        setText('heroNamesLine', (isPairInvite && pair) ? (cfg.names?.groom + ' & ' + pair) : primary);
        setText('heroNamesInline', (isPairInvite && pair) ? (cfg.names?.groom + ' & ' + pair) : primary);
        setText('hBride', isPairInvite ? pair : primary);
        setText('hGroom', isPairInvite ? primary : '');
        setText('heroDateLine', dateLine);
        setText('hDate', dateLine);
        setText('evDate', [dd, mm, yy].filter(Boolean).join('.'));
        setText('evTime', cfg.hour || '');
        setText('eventText', cfg.description || '');
        setText('locationName', cfg.location || '');
        setText('footLine', (isPairInvite && pair) ? (pair + ' & ' + primary + '  ·  ' + yy) : (primary + ' · ' + yy));
        setText('footerName', cfg.eventLabel || (lang === 'ru' ? 'Той' : 'Той'));

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

        if (photoUrl) {
            const ph = qs('.hero-photo-placeholder') || byId('heroPhoto');
            if (ph) {
                let img = ph.querySelector('img') || (ph.tagName.toLowerCase() === 'img' ? ph : null);
                if (img) {
                    img.src = photoUrl;
                    if (!img.classList.contains('hero-photo-img')) img.classList.add('hero-photo-img');
                } else {
                    ph.innerHTML = '';
                    const newImg = document.createElement('img');
                    newImg.className = 'hero-photo-img';
                    newImg.id = 'heroPhotoImg';
                    newImg.src = photoUrl;
                    newImg.alt = 'photo';
                    newImg.style.width = '100%';
                    newImg.style.height = '100%';
                    newImg.style.objectFit = 'cover';
                    ph.appendChild(newImg);
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
                slides.textContent = lang === 'ru' ? 'Добавьте фото в галерею' : 'Галереяға фото қосыңыз';
            }
        }
    }

    window.__APPLY_DYNAMIC_CONFIG = apply;

    setTimeout(function(){
        if (typeof CONFIG !== 'undefined') apply(CONFIG);
    }, 0);

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'UPDATE_CONFIG') {
            apply(e.data.config);
        }
    });
})();
</script>`;

    return html.replace('</body>', `${bridge}\n</body>`);
}

export function injectConfig(html, config) {
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

export function injectRsvpApi(html, inviteId, maxGuests, lang = 'kk') {
    const limitText = lang === 'ru' ? 'Лимит гостей: ' : 'Қонақ саны лимиті: ';
    const sendFailText = lang === 'ru' ? 'Отправка не удалась' : 'Жіберу сәтсіз болды';
    const genericErrorText = lang === 'ru' ? 'Произошла ошибка' : 'Қате орын алды';
    if (!inviteId) return html;

    const limit = maxGuests || 0;
    const script = `
<script>
(function () {
    var MAX_GUESTS = ${limit};

    window.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.guest-opt').forEach(function(b) {
            b.style.display = 'none';
        });

        var gInput = document.getElementById('rGuests');
        if (gInput) {
            gInput.removeAttribute('readonly');
            gInput.type = 'number';
            gInput.min = '1';

            if (MAX_GUESTS > 0) {
                gInput.max = String(MAX_GUESTS);
            } else {
                gInput.removeAttribute('max');
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

        if (!name) {
            nameEl.focus();
            return;
        }

        if (!phone) {
            phoneEl.focus();
            return;
        }

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

        if (MAX_GUESTS > 0 && guestsCount > MAX_GUESTS) {
            err.textContent = '${limitText}' + MAX_GUESTS;
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
                throw new Error(data.message || '${sendFailText}');
            }

            formEl.style.display = 'none';
            successEl.style.display = 'block';
        } catch (e) {
            err.textContent = e.message || '${genericErrorText}';
        }
    };
})();
</script>`;

    return html.replace('</body>', `${script}\n</body>`);
}

export function localizeTemplate(html, lang) {
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

export function pickPalette(invite) {
    const tpl = getNormalizedTemplate(invite);
    const parts = tpl.split('/');
    const category = parts[0] || '';
    const fileName = (parts[parts.length - 1] || '').replace('.html', '');

    const candidates = [
        fileName,
        category,
        'classic',
    ].filter(Boolean);

    const key = candidates.find(k => PALETTES[k]);
    return PALETTES[key] || PALETTES.classic;
}

export function buildTemplate2Html(invite, htmlSource, { enableRsvp = false, inviteId = null, lang = 'kk', mode = 'edit' } = {}) {
    const palette = pickPalette(invite);
    const isViewMode = mode === 'view';
    const config = { ...buildConfig(invite || {}, lang), autoplay: isViewMode };
    const heroUrl = invite?.previewPhotoUrl || config.gallery?.[0] || '';

    const tplKey = resolveTemplateId(
        invite?.template,
        getCategoryFromTemplateId(invite?.template)
    );

    const skipPalette =
        tplKey === 'wedding/template4.html' ||
        (htmlSource && /NO_PALETTE/i.test(htmlSource));

    let html = htmlSource;
    html = skipPalette ? html : applyPalette(html, palette);
    html = injectConfig(html, config);
    html = injectPhoto(html, heroUrl);

    if (enableRsvp) {
        html = injectRsvpApi(html, inviteId, config.maxGuests, lang);
    }

    html = injectAutoplay(html, isViewMode);
    html = injectLiveBridge(html);
    html = localizeTemplate(html, lang);
    return html;
}