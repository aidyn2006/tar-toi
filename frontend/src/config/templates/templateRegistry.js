// src/config/templates/templateRegistry.js
const TEMPLATE_LOADERS = import.meta.glob('../../templates/**/*.html', { as: 'raw' });

const CATEGORY_ALIASES = {
    tusau: 'tusaukeser',
};

const CATEGORY_EVENT_LABELS = {
    wedding: {
        kk: 'Үйлену тойы',
        ru: 'Свадьба',
    },
    uzatu: {
        kk: 'Ұзату тойы',
        ru: 'Проводы невесты',
    },
    tusaukeser: {
        kk: 'Тұсаукесер тойы',
        ru: 'Тусау кесер',
    },
    besik: {
        kk: 'Бесік тойы',
        ru: 'Бесік той',
    },
    merei: {
        kk: 'Мерейтой',
        ru: 'Юбилей',
    },
    sundet: {
        kk: 'Сүндет тойы',
        ru: 'Сүндет той',
    },
};

export function getTemplateCountByCategory(category) {
    return getTemplatesByCategory(category).length;
}

const LEGACY_TEMPLATE_REDIRECTS = {
  'uzatu/default.html': 'uzatu/template1.html',
  'sundet/default.html': 'sundet/template1.html',
  'tusaukeser/default.html': 'tusaukeser/template1.html',
  'merei/default.html': 'merei/template1.html',
  'besik/default.html': 'besik/template1.html',
};
const GLOBAL_FALLBACK_TEMPLATE_ID = 'wedding/template1.html';
const TEMPLATE_LABELS = {
  'wedding/template1.html': 'Classic Wedding',
  'wedding/template2.html': 'Modern Love',
  'wedding/template3.html': 'Elegant Story',
  'wedding/template4.html': 'Golden Evening',
  'wedding/template5.html': 'Wedding Modern Pearl',
  'wedding/template6.html': 'Wedding Modern Ivory',
  'wedding/template7.html': 'Wedding Modern Ivory',
  'wedding/template8.html': 'Wedding Modern Ivory',
  'wedding/template9.html': 'Wedding Minimalizm',
  'wedding/template10.html': 'Wedding Minimalizm',
  'wedding/template11.html': 'Dark Cinematic',
  'wedding/template12.html': 'Editorial Black & White',
  'wedding/template13.html': 'Editorial Black & Whita',

  'uzatu/template1.html': 'Uzatu Classic Gold',
  'uzatu/template2.html': 'Uzatu Royal Blue',
  'uzatu/template3.html': 'Uzatu Romantic Rose',
  'uzatu/template4.html': 'Uzatu Burgundy Classic',
  'uzatu/template6.html': 'Modern Modern Ivory',
  'uzatu/template10.html': 'Uzatu Traditional',
  'uzatu/template5.html': 'Emerald Elegance',
  'uzatu/template7.html': 'Dusty Rose',

  'sundet/template1.html': 'Sundet Heritage Sage',
  'sundet/template2.html': 'Sundet Classic Navy',
  'sundet/template3.html': 'Sundet Modern Terra',
  'sundet/template4.html': 'Sundet Elegant Sage',
  'sundet/template5.html': 'Heritage Navy',

  'tusaukeser/template1.html': 'Tusaukeser Traditional Gold',
  'tusaukeser/template2.html': 'Tusaukeser Royal Night',
  'tusaukeser/template3.html': 'Tusaukeser Mint Editorial',
  'tusaukeser/template4.html': 'Tusaukeser Warm Peach',

  'merei/template1.html': 'Merei Royal Night',
  'merei/template2.html': 'Merei Rose Blossom',
  'merei/template3.html': 'Merei Grand Black Gold',
  'merei/template4.html': 'Merei Soft Peach Jubilee',
  'merei/template5.html': 'Merei Midnight Gold V2',
  'merei/template6.html': 'Merei Royal Emerald',
  'merei/template7.html': 'Grand Black Gold',

  'besik/template1.html': 'Besik Classic Gold',
  'besik/template2.html': 'Besik Mint Family',
  'besik/template3.html': 'Besik Editorial Gold',
  'besik/template4.html': 'Besik Sky Blue',
  'besik/template5.html': 'Besik Modern Style',
  'besik/template6.html': 'Soft Sky',
};

const DEFAULT_TEMPLATE_FEATURES = {
    pairNames: false,
    gallery: true,
    music: true,
    map: true,
    program: false,
};

const TEMPLATE_META = {
  'wedding/template1.html': {
    palette: 'classic',
    tags: ['classic', 'formal'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/wedding/template1.jpg',
  },
  'wedding/template2.html': {
    palette: 'classic',
    tags: ['modern', 'clean'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/wedding/template2.jpg',
  },
  'wedding/template3.html': {
    palette: 'classic',
    tags: ['elegant', 'story'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/wedding/template3.jpg',
  },
  'wedding/template4.html': {
    palette: 'classic',
    tags: ['premium', 'gold'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/wedding/template4.jpg',
  },
  'wedding/template5.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template5.jpg',
  },
  'wedding/template6.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template6.jpg',
  },
  'wedding/template7.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template7.jpg',
  },
  'wedding/template8.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template8.jpg',
  },
  'wedding/template9.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true, program: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template9.jpg',
  },
  'wedding/template10.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true, program: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template10.jpg',
  },
  'wedding/template11.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template11.jpg',
  },
  'wedding/template12.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/wedding/template12.jpg',
  },
  'wedding/template13.html': {
    palette: 'classic',
    tags: ['generated'],
    features: { pairNames: true, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/wedding/template13.jpg',
  },

  'uzatu/template1.html': {
    palette: 'classic',
    tags: ['traditional', 'gold', 'classic'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/uzatu/template1.jpg',
  },
  'uzatu/template2.html': {
    palette: 'classic',
    tags: ['royal', 'blue', 'clean'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/uzatu/template2.jpg',
  },
  'uzatu/template3.html': {
    palette: 'classic',
    tags: ['romantic', 'soft', 'pink'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/uzatu/template3.jpg',
  },
  'uzatu/template4.html': {
    palette: 'classic',
    tags: ['premium', 'burgundy', 'formal'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/uzatu/template4.jpg',
  },
  'uzatu/template6.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/uzatu/template6.jpg',
  },
  'uzatu/template10.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true, program: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/uzatu/template10.jpg',
  },
  'uzatu/template5.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/uzatu/template5.jpg',
  },
  'uzatu/template7.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/uzatu/template7.jpg',
  },

  'tusaukeser/template1.html': {
    palette: 'classic',
    tags: ['traditional', 'family', 'ornament'],
    features: { pairNames: false, gallery: true, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/tusaukeser/template1.jpg',
  },
  'tusaukeser/template2.html': {
    palette: 'classic',
    tags: ['royal', 'dark', 'full-screen'],
    features: { pairNames: false, gallery: true, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/tusaukeser/template2.jpg',
  },
  'tusaukeser/template3.html': {
    palette: 'classic',
    tags: ['editorial', 'mint', 'minimal'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/tusaukeser/template3.jpg',
  },
  'tusaukeser/template4.html': {
    palette: 'classic',
    tags: ['warm', 'playful', 'modern'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/tusaukeser/template4.jpg',
  },

  'sundet/template1.html': {
    palette: 'classic',
    tags: ['heritage', 'sage', 'ornament'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/sundet/template1.jpg',
  },
  'sundet/template2.html': {
    palette: 'classic',
    tags: ['classic', 'navy', 'formal'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/sundet/template2.jpg',
  },
  'sundet/template3.html': {
    palette: 'classic',
    tags: ['modern', 'terra', 'clean'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/sundet/template3.jpg',
  },
  'sundet/template4.html': {
    palette: 'classic',
    tags: ['elegant', 'sage', 'soft'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/sundet/template4.jpg',
  },
  'sundet/template5.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/sundet/template5.jpg',
  },

  'merei/template1.html': {
    palette: 'classic',
    tags: ['royal', 'dark', 'jubilee'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/merei/template1.jpg',
  },
  'merei/template2.html': {
    palette: 'classic',
    tags: ['rose', 'soft', 'floral'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/merei/template2.jpg',
  },
  'merei/template3.html': {
    palette: 'classic',
    tags: ['black', 'gold', 'grand'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/merei/template3.jpg',
  },
  'merei/template4.html': {
    palette: 'classic',
    tags: ['peach', 'soft', 'classic'],
    features: { pairNames: false, gallery: false, music: false, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/merei/template4.jpg',
  },
  'merei/template5.html': {
    palette: 'classic',
    tags: ['premium', 'dark', 'gold', 'jubilee', 'v2'],
    features: { pairNames: false, gallery: true, music: false, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/merei/template5.jpg',
  },
  'merei/template6.html': {
    palette: 'classic',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/merei/template6.jpg',
  },
  'merei/template7.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/merei/template7.jpg',
  },

  'besik/template1.html': {
    palette: 'classic',
    tags: ['classic', 'gold', 'family'],
    features: { pairNames: false, gallery: false, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/besik/template1.jpg',
  },
  'besik/template2.html': {
    palette: 'classic',
    tags: ['mint', 'soft', 'family'],
    features: { pairNames: false, gallery: false, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/besik/template2.jpg',
  },
  'besik/template3.html': {
    palette: 'classic',
    tags: ['editorial', 'gold', 'formal'],
    features: { pairNames: false, gallery: false, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/besik/template3.jpg',
  },
  'besik/template4.html': {
    palette: 'classic',
    tags: ['blue', 'soft', 'modern'],
    features: { pairNames: false, gallery: false, music: true, map: true },
    isActive: true,
    isPremium: false,
    preview: '/previews/besik/template4.jpg',
  },
  'besik/template5.html': {
    palette: 'classic',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/besik/template5.jpg',
  },
  'besik/template6.html': {
    palette: 'royal',
    tags: ['generated'],
    features: { pairNames: false, gallery: true, music: true, map: true },
    isActive: true,
    isPremium: true,
    preview: '/previews/besik/template6.jpg',
  },
};

function prettifyFileName(fileName) {
    return fileName
        .replace(/\.html$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (s) => s.toUpperCase());
}

export function normalizeCategory(category) {
    if (!category) return '';
    return CATEGORY_ALIASES[category] || category;
}

export function normalizeTemplateId(templateId) {
    if (!templateId) return '';

    let normalized = templateId.trim();

    if (normalized.startsWith('../templates/')) {
        normalized = normalized.replace('../templates/', '');
    } else if (normalized.startsWith('templates/')) {
        normalized = normalized.replace('templates/', '');
    }

    const [category, ...rest] = normalized.split('/');
    if (!category || rest.length === 0) {
        return LEGACY_TEMPLATE_REDIRECTS[normalized] || normalized;
    }

    const normalizedCategory = normalizeCategory(category);
    const rebuilt = [normalizedCategory, ...rest].join('/');

    return LEGACY_TEMPLATE_REDIRECTS[rebuilt] || rebuilt;
}

export function getTemplatePath(templateId) {
    const normalizedId = normalizeTemplateId(templateId);
    return normalizedId ? `../../templates/${normalizedId}` : '';
}

function buildTemplateRecord(fullPath) {
    const match = fullPath.match(/templates\/([^/]+)\/(.+\.html)$/);
    if (!match) return null;

    const rawCategory = match[1];
    const fileName = match[2];
    const category = normalizeCategory(rawCategory);
    const id = `${category}/${fileName}`;
    const meta = TEMPLATE_META[id] || {};

    return {
        id,
        category,
        fileName,
        label: TEMPLATE_LABELS[id] || prettifyFileName(fileName),
        loader: TEMPLATE_LOADERS[fullPath],
        path: fullPath,
        tags: meta.tags || [],
        palette: meta.palette || 'classic',
        preview: meta.preview || '',
        isActive: meta.isActive ?? true,
        isPremium: meta.isPremium ?? false,
        eventLabel: meta.eventLabel || CATEGORY_EVENT_LABELS[category] || {
            kk: 'Той',
            ru: 'Той',
        },
        features: {
            ...DEFAULT_TEMPLATE_FEATURES,
            ...(meta.features || {}),
        },
    };
}

const ALL_TEMPLATES = Object.keys(TEMPLATE_LOADERS)
    .map(buildTemplateRecord)
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label, 'ru'));

export function getAllTemplates() {
    return ALL_TEMPLATES;
}

export function getActiveTemplates() {
    return ALL_TEMPLATES.filter((tpl) => tpl.isActive);
}

export function getTemplatesByCategory(category) {
    const normalizedCategory = normalizeCategory(category);
    return getActiveTemplates().filter((tpl) => tpl.category === normalizedCategory);
}

export function getTemplateById(templateId) {
    const normalizedId = normalizeTemplateId(templateId);
    return ALL_TEMPLATES.find((tpl) => tpl.id === normalizedId) || null;
}

export function getTemplateMeta(templateId) {
    return getTemplateById(templateId);
}

export function getTemplateEventLabel(templateId, lang = 'kk') {
    const tpl = getTemplateById(templateId);
    return tpl?.eventLabel?.[lang] || (lang === 'ru' ? 'Той' : 'Той');
}

export function getTemplateLoader(templateId) {
    return getTemplateById(templateId)?.loader || null;
}

export function getCategoryFromTemplateId(templateId) {
    const normalizedId = normalizeTemplateId(templateId);
    return normalizedId.split('/')[0] || '';
}

export function getDefaultTemplateId(category) {
    const normalizedCategory = normalizeCategory(category);
    const templates = getTemplatesByCategory(normalizedCategory);

    if (templates.length) {
        const template1 = templates.find((tpl) => tpl.fileName === 'template1.html');
        if (template1) return template1.id;

        const defaultFile = templates.find((tpl) => tpl.fileName === 'default.html');
        if (defaultFile) return defaultFile.id;

        return templates[0].id;
    }

    if (getTemplateById(GLOBAL_FALLBACK_TEMPLATE_ID)) {
        return GLOBAL_FALLBACK_TEMPLATE_ID;
    }

    return getActiveTemplates()[0]?.id || '';
}

export function resolveTemplateId(templateId, fallbackCategory = '') {
    const normalizedId = normalizeTemplateId(templateId);

    if (normalizedId && getTemplateById(normalizedId)) {
        return normalizedId;
    }

    const redirected = LEGACY_TEMPLATE_REDIRECTS[normalizedId];
    if (redirected && getTemplateById(redirected)) {
        return redirected;
    }

    return getDefaultTemplateId(fallbackCategory || getCategoryFromTemplateId(normalizedId));
}
