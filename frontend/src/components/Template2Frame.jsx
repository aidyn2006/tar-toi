import React, { useMemo, useRef, useEffect, useState } from 'react';

const TEMPLATE_RAW_MAP = import.meta.glob('../templates/**/*.html', { as: 'raw', eager: true });
const DEFAULT_TEMPLATE_KEY = '../templates/common/default.html';
const LEGACY_KEYS = ['classic', 'royal', 'nature', 'modern'];

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
    const groom = (invite?.topic1 || '').trim();
    const bride = (invite?.topic2 || '').trim();
    if (groom || bride) {
        return {
            groom: groom || 'Жігіт',
            bride: bride || 'Қалыңдық',
        };
    }

    const title = (invite?.title || '').trim();
    const m = title.match(/(.+?)\s*&\s*(.+)/);
    if (m) {
        return { groom: m[1].trim(), bride: m[2].trim() };
    }
    return { groom: 'Жігіт', bride: 'Қалыңдық' };
}

function normalizeUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (typeof window === 'undefined') return url;
    const isUpload = url.startsWith('/uploads/');
    const origin = isUpload
        ? `${window.location.protocol}//${window.location.hostname}:9191`
        : window.location.origin;
    return origin + url;
}

function normalizeTemplateKey(key) {
    if (!key) return DEFAULT_TEMPLATE_KEY;
    if (LEGACY_KEYS.includes(key)) return DEFAULT_TEMPLATE_KEY;
    if (key.startsWith('../templates/')) return key;
    if (key.startsWith('templates/')) return `../${key}`;
    return `../templates/${key}`;
}

function buildConfig(invite) {
    const eventDate = invite?.eventDate ? new Date(invite.eventDate) : null;
    const { groom, bride } = parseNames(invite);

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

    return {
        names: { bride, groom },
        day,
        hour,
        location: (invite?.locationName || 'Astana, Farhi Hall').trim(),
        locationUrl: (invite?.locationUrl || '').trim(),
        music: {
            title: (invite?.musicTitle || invite?.title || 'Наша Песня').trim(),
            artist: (invite?.toiOwners || '— загрузите аудио файл —').trim(),
            url: normalizeUrl(invite?.musicUrl || ''),
        },
        gallery,
        description: invite?.description || 'Құрметті ағайын-туыс, сізді тойымызға шақырамыз...',
        toiOwners: invite?.toiOwners || 'Той иелері (толтырыңыз)',
        heroPhotoUrl,
    };
}

function applyPalette(html, palette) {
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
    return html.replace(
        /<div class="hero-photo-placeholder">[\s\S]*?<\/div>/,
        `<img class="hero-photo-img" src="${safeUrl}" alt="photo">`
    );
}

function injectAutoplay(html, enableRsvp) {
    if (!enableRsvp) return html;
    const script = `
<script>
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof CONFIG === 'undefined') return;
        const isMobile = window.innerWidth < 920;
        if (isMobile && CONFIG.music && (CONFIG.music.url || (CONFIG.music.playlist||[]).length)) {
            const audio = new Audio(CONFIG.music.url);
            audio.volume = 0.4;
            const start = () => { audio.play().catch(() => {}); };
            setTimeout(start, 300);
            document.body.addEventListener('click', start, { once: true });
        }
        const block = document.getElementById('musicBlock');
        if (block && isMobile) {
            setTimeout(() => { block.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 800);
        }
    });
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
        setText('heroNames', \`\${cfg.names?.bride || ''} & \${cfg.names?.groom || ''}\`);
        setText('heroDateLine', [dd, mm, yy].filter(Boolean).join('.') + (cfg.hour ? ' · ' + cfg.hour : ''));
        setText('eventText', cfg.description || '');
        setText('locationName', cfg.location || '');
        setText('footLine', \`\${cfg.names?.bride || ''} & \${cfg.names?.groom || ''}  ·  \${yy}\`);

        const ownersBlock = byId('ownersBlock');
        const ownersText = byId('ownersText');
        if (ownersBlock) {
            if (cfg.toiOwners) {
                if (ownersText) ownersText.textContent = cfg.toiOwners;
                ownersBlock.style.display = 'block';
            } else {
                ownersBlock.style.display = 'none';
            }
        }

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

function injectRsvpApi(html, inviteId) {
    if (!inviteId) return html;
    const script = `
<script>
    (function () {
        window.submitRSVP = async function submitRSVP() {
            const nameEl = document.getElementById('rName');
            const phoneEl = document.getElementById('rPhone');
            const noteEl = document.getElementById('rNote');
            const formEl = document.getElementById('rsvpForm');
            const successEl = document.getElementById('successMsg');
            if (!nameEl || !phoneEl || !formEl || !successEl) return;

            const name = (nameEl.value || '').trim();
            const phone = (phoneEl.value || '').trim();
            if (!name) { nameEl.focus(); return; }
            if (!phone) { phoneEl.focus(); return; }

            let err = document.getElementById('rsvpError');
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

            const active = document.querySelector('.guest-opt.selected');
            const guestsInput = document.getElementById('rGuests');
            const guestsCount = Number(guestsInput?.value || active?.dataset?.val || 1);

            try {
                const res = await fetch('/api/v1/invites/${inviteId}/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        guestName: name,
                        phone: phone || null,
                        guestsCount: Number.isNaN(guestsCount) ? 1 : guestsCount,
                        attending: true,
                        note: (noteEl?.value || '').trim() || null
                    })
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.message || 'Не удалось отправить ответ');
                }

                formEl.style.display = 'none';
                successEl.style.display = 'block';
            } catch (e) {
                err.textContent = e?.message || 'Ошибка отправки';
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
        /<span>Пн<\/span><span>Вт<\/span><span>Ср<\/span>\s*<span>Чт<\/span><span>Пт<\/span><span>Сб<\/span><span>Вс<\/span>/,
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

function buildTemplate2Html(invite, { enableRsvp = false, inviteId = null, lang = 'kk' } = {}) {
    const palette = pickPalette(invite);
    const config = buildConfig(invite || {});
    const heroUrl = invite?.previewPhotoUrl || config.gallery?.[0] || '';

    const tplKey = normalizeTemplateKey(invite?.template);
    const htmlSource = TEMPLATE_RAW_MAP[tplKey] || TEMPLATE_RAW_MAP[DEFAULT_TEMPLATE_KEY];
    const skipPalette = tplKey.includes('/wedding/test.html') || (htmlSource && /NO_PALETTE/i.test(htmlSource));
    let html = htmlSource;
    html = skipPalette ? html : applyPalette(html, palette);
    html = injectConfig(html, config);
    html = injectPhoto(html, heroUrl);
    if (enableRsvp) {
        html = injectRsvpApi(html, inviteId);
    }
    html = injectAutoplay(html, enableRsvp);
    html = injectLiveBridge(html);
    html = localizeTemplate(html, lang);
    return html;
}

const Template2Frame = ({ invite, inviteId = null, enableRsvp = false, style, className, lang = 'kk', mobileZoom = false }) => {
    const iframeRef = useRef(null);
    const templateKey = useMemo(() => normalizeTemplateKey(invite?.template), [invite?.template]);
    const initialDoc = useMemo(
        () => buildTemplate2Html(invite, { enableRsvp, inviteId, lang }),
        [templateKey, enableRsvp, inviteId, lang]
    );
    const liveConfig = useMemo(() => buildConfig(invite || {}), [invite]);
    const [debouncedConfig, setDebouncedConfig] = useState(liveConfig);
    const prevHashRef = useRef('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedConfig(liveConfig), 500);
        return () => clearTimeout(t);
    }, [liveConfig]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;
        const hash = JSON.stringify(debouncedConfig);
        if (hash === prevHashRef.current) return;
        prevHashRef.current = hash;
        iframe.contentWindow.postMessage({ type: 'UPDATE_CONFIG', config: debouncedConfig }, '*');
    }, [debouncedConfig]);

    return (
        <iframe
            ref={iframeRef}
            title="template-2-preview"
            srcDoc={initialDoc}
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
