// src/config/templates/templateRegistry.js
const TEMPLATE_LOADERS = import.meta.glob('../../templates/**/*.html', { as: 'raw' });

const CATEGORY_ALIASES = {
    tusau: 'tusaukeser',
};

const TEMPLATE_LABELS = {
    'wedding/template1.html': 'Classic Wedding',
    'wedding/template2.html': 'Modern Love',
    'wedding/template3.html': 'Elegant Story',
    'wedding/template4.html': 'Golden Evening',

    'common/default.html': 'Universal Classic',
    'uzatu/default.html': 'Uzatu Classic',
    'sundet/default.html': 'Sundet Celebration',
    'tusaukeser/default.html': 'Tusaukeser',
    'merei/default.html': 'Anniversary',
    'besik/default.html': 'Besik Toy',
};

const DEFAULT_TEMPLATE_FEATURES = {
    pairNames: false,
    gallery: true,
    music: true,
    map: true,
};

const TEMPLATE_META = {
    'wedding/template1.html': {
        tags: ['classic', 'formal'],
        features: { pairNames: true, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/wedding/template1.jpg',
    },
    'wedding/template2.html': {
        tags: ['modern', 'clean'],
        features: { pairNames: true, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/wedding/template2.jpg',
    },
    'wedding/template3.html': {
        tags: ['elegant', 'story'],
        features: { pairNames: true, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/wedding/template3.jpg',
    },
    'wedding/template4.html': {
        tags: ['premium', 'gold'],
        features: { pairNames: true, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/wedding/template4.jpg',
    },

    'uzatu/default.html': {
        tags: ['traditional'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/uzatu/default.jpg',
    },
    'sundet/default.html': {
        tags: ['family'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/sundet/default.jpg',
    },
    'tusaukeser/default.html': {
        tags: ['family', 'traditional'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/tusaukeser/default.jpg',
    },
    'merei/default.html': {
        tags: ['anniversary'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/merei/default.jpg',
    },
    'besik/default.html': {
        tags: ['family', 'baby'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/besik/default.jpg',
    },
    'common/default.html': {
        tags: ['universal'],
        features: { pairNames: false, gallery: true, music: true, map: true },
        isActive: true,
        isPremium: false,
        preview: '/previews/common/default.jpg',
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
    if (!category || rest.length === 0) return normalized;

    const normalizedCategory = normalizeCategory(category);
    return [normalizedCategory, ...rest].join('/');
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
        preview: meta.preview || '',
        isActive: meta.isActive ?? true,
        isPremium: meta.isPremium ?? false,
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

    if (!templates.length) {
        return 'common/default.html';
    }

    const template1 = templates.find((tpl) => tpl.fileName === 'template1.html');
    if (template1) return template1.id;

    const defaultFile = templates.find((tpl) => tpl.fileName === 'default.html');
    if (defaultFile) return defaultFile.id;

    return templates[0].id;
}

export function resolveTemplateId(templateId, fallbackCategory = '') {
    const normalizedId = normalizeTemplateId(templateId);

    if (normalizedId && getTemplateById(normalizedId)) {
        return normalizedId;
    }

    return getDefaultTemplateId(fallbackCategory || getCategoryFromTemplateId(normalizedId));
}