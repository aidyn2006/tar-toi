import React, { useMemo } from 'react';
import templateHtmlRaw from '../templates/template2.0.html?raw';

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

function buildConfig(invite) {
    const eventDate = invite?.eventDate ? new Date(invite.eventDate) : null;
    const { groom, bride } = parseNames(invite);

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
        location: (invite?.locationName || 'Зал мерекесі').trim(),
        music: {
            title: (invite?.title || 'Наша Песня').trim(),
            artist: (invite?.toiOwners || '— загрузите аудио файл —').trim(),
        },
    };
}

function applyPalette(html, palette) {
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
    return html.replace(
        /<div class="hero-photo-placeholder">[\s\S]*?<\/div>/,
        `<img class="hero-photo-img" src="${url.replace(/"/g, '&quot;')}" alt="photo">`
    );
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
            const guestsCount = Number(active?.dataset?.val || 1);

            try {
                const res = await fetch('/api/v1/invites/${inviteId}/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        guestName: name,
                        phone: phone || null,
                        guestsCount: Number.isNaN(guestsCount) ? 1 : guestsCount,
                        attending: true
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

function buildTemplate2Html(invite, { enableRsvp = false, inviteId = null } = {}) {
    const palette = PALETTES[invite?.template] || PALETTES.classic;
    const config = buildConfig(invite || {});

    let html = templateHtmlRaw;
    html = applyPalette(html, palette);
    html = injectConfig(html, config);
    html = injectPhoto(html, invite?.previewPhotoUrl || '');
    if (enableRsvp) {
        html = injectRsvpApi(html, inviteId);
    }
    return html;
}

const Template2Frame = ({ invite, inviteId = null, enableRsvp = false, style, className }) => {
    const srcDoc = useMemo(
        () => buildTemplate2Html(invite, { enableRsvp, inviteId }),
        [invite, enableRsvp, inviteId]
    );

    return (
        <iframe
            title="template-2-preview"
            srcDoc={srcDoc}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                ...style,
            }}
        />
    );
};

export default Template2Frame;
