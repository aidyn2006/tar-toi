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
                const parsed = new URL(url);
                if (
                    parsed.hostname === 'localhost' ||
                    parsed.hostname === '127.0.0.1'
                ) {
                    return `${window.location.protocol}//${window.location.host}${parsed.pathname}${parsed.search}`;
                }
            } catch (_) {
                // Ignore malformed URLs and fall back to the raw value.
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
    const numericLimit = Number(invite?.maxGuests) || 0;

    return {
        names: { bride, groom },
        day: eventDate
            ? `${pad2(eventDate.getDate())}-${pad2(eventDate.getMonth() + 1)}-${eventDate.getFullYear()}`
            : '01-01-2027',
        hour: eventDate
            ? `${pad2(eventDate.getHours())}:${pad2(eventDate.getMinutes())}`
            : '19:00',
        location: (invite?.locationName || 'Astana, Farhi Hall').trim(),
        locationUrl: supportsMap ? (invite?.locationUrl || '').trim() : '',
        music: {
            title: supportsMusic
                ? (
                    musicResolved.title ||
                    invite?.title ||
                    trByLang(lang, 'Біздің ән', 'Наша песня')
                ).trim()
                : '',
            artist: supportsMusic
                ? (
                    musicResolved.artist ||
                    trByLang(
                        lang,
                        '— аудио файлын жүктеңіз —',
                        '— загрузите аудио файл —'
                    )
                ).trim()
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

export function pickPalette(invite) {
    const paletteKey = getTemplateMetaForInvite(invite)?.palette;
    return PALETTES[paletteKey] || PALETTES.classic;
}
