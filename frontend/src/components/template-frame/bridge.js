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
        const ownerTargets = ['ownersLine', 'ownersName', 'ownersLabel', 'ownersLabelTxt'];

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
            const hasLocation = cfg.locationUrl || cfg.location;
            mapBtnWrap.style.display = hasLocation ? 'block' : 'none';
            mapBtn.href = cfg.locationUrl || '#';
            mapBtn.style.pointerEvents = cfg.locationUrl ? 'auto' : 'none';
            mapBtn.style.opacity = cfg.locationUrl ? '1' : '0.55';
        }

        if (photoUrl) {
            const placeholder = qs('.hero-photo-placeholder') || byId('heroPhoto');
            if (placeholder) {
                let img = placeholder.querySelector('img') || (placeholder.tagName.toLowerCase() === 'img' ? placeholder : null);
                if (img) {
                    img.src = photoUrl;
                    if (!img.classList.contains('hero-photo-img')) img.classList.add('hero-photo-img');
                } else {
                    placeholder.innerHTML = '';
                    const newImg = document.createElement('img');
                    newImg.className = 'hero-photo-img';
                    newImg.id = 'heroPhotoImg';
                    newImg.src = photoUrl;
                    newImg.alt = 'photo';
                    newImg.style.width = '100%';
                    newImg.style.height = '100%';
                    newImg.style.objectFit = 'cover';
                    placeholder.appendChild(newImg);
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
                slides.textContent = lang === 'ru'
                    ? 'Добавьте фото в галерею'
                    : 'Галереяға фото қосыңыз';
            }
        }
    }

    function applyWithTemplateHandler(cfg) {
        const templateApply =
            typeof window.__APPLY_DYNAMIC_CONFIG === 'function' &&
            window.__APPLY_DYNAMIC_CONFIG !== apply
                ? window.__APPLY_DYNAMIC_CONFIG
                : null;

        if (templateApply) {
            templateApply(cfg);
            return;
        }

        apply(cfg);
    }

    if (typeof window.__APPLY_DYNAMIC_CONFIG !== 'function') {
        window.__APPLY_DYNAMIC_CONFIG = apply;
    }

    setTimeout(function(){
        if (typeof CONFIG !== 'undefined') applyWithTemplateHandler(CONFIG);
    }, 0);

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_CONFIG') {
            applyWithTemplateHandler(event.data.config);
        }
    });
})();
</script>`;

    return html.replace('</body>', `${bridge}\n</body>`);
}

export function postFrameConfig(iframe, config) {
    if (!iframe?.contentWindow) return false;

    iframe.contentWindow.postMessage(
        { type: 'UPDATE_CONFIG', config },
        '*'
    );

    return true;
}

export function syncFrameConfig(iframe, config, prevHashRef) {
    if (!iframe?.contentWindow) return false;

    const nextHash = JSON.stringify(config);
    if (prevHashRef?.current === nextHash) return false;

    if (prevHashRef) {
        prevHashRef.current = nextHash;
    }

    return postFrameConfig(iframe, config);
}

export function mountFrame(iframe, config, prevHashRef) {
    if (prevHashRef) {
        prevHashRef.current = '';
    }

    return postFrameConfig(iframe, config);
}
