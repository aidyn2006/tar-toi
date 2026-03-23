export const SUPPORTED_LOCALES = ['kk', 'ru'];
export const DEFAULT_LOCALE = 'kk';

export const LOCALE_META = {
    kk: {
        hreflang: 'kk-KZ',
        ogLocale: 'kk_KZ',
        label: 'Қаз',
        longLabel: 'Қазақша',
    },
    ru: {
        hreflang: 'ru-KZ',
        ogLocale: 'ru_RU',
        label: 'Рус',
        longLabel: 'Русский',
    },
};

export const PUBLIC_ROUTE_KEYS = {
    home: 'home',
    categories: 'categories',
    category: 'category',
    faq: 'faq',
    contact: 'contact',
    blogIndex: 'blogIndex',
    blogArticle: 'blogArticle',
};

const APP_PATH_PREFIXES = ['/dashboard', '/invite'];

export const isSupportedLocale = (locale) => SUPPORTED_LOCALES.includes(locale);

export const normalizeLocale = (locale) => (
    isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
);

export const getLocaleMeta = (locale) => LOCALE_META[normalizeLocale(locale)];

export const getLocaleFromPathname = (pathname = '/') => {
    const match = pathname.match(/^\/(kk|ru)(?:\/|$)/);
    return match ? match[1] : null;
};

export const isLocalizedHomePath = (pathname = '/') => /^\/(kk|ru)\/?$/.test(pathname);

export const isAppPath = (pathname = '/') => (
    APP_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
);

export const buildLocalizedPath = (locale, routeKey, params = {}) => {
    const safeLocale = normalizeLocale(locale);

    switch (routeKey) {
        case PUBLIC_ROUTE_KEYS.home:
            return `/${safeLocale}/`;
        case PUBLIC_ROUTE_KEYS.categories:
            return `/${safeLocale}/categories`;
        case PUBLIC_ROUTE_KEYS.category:
            return `/${safeLocale}/categories/${params.slug}`;
        case PUBLIC_ROUTE_KEYS.faq:
            return `/${safeLocale}/faq`;
        case PUBLIC_ROUTE_KEYS.contact:
            return `/${safeLocale}/contact`;
        case PUBLIC_ROUTE_KEYS.blogIndex:
            return `/${safeLocale}/blog`;
        case PUBLIC_ROUTE_KEYS.blogArticle:
            return `/${safeLocale}/blog/${params.slug}`;
        default:
            return `/${safeLocale}/`;
    }
};

export const buildLegacyPath = (routeKey, params = {}) => {
    switch (routeKey) {
        case PUBLIC_ROUTE_KEYS.home:
            return '/';
        case PUBLIC_ROUTE_KEYS.categories:
            return '/categories';
        case PUBLIC_ROUTE_KEYS.category:
            return `/categories/${params.slug}`;
        case PUBLIC_ROUTE_KEYS.faq:
            return '/faq';
        case PUBLIC_ROUTE_KEYS.contact:
            return '/contact';
        case PUBLIC_ROUTE_KEYS.blogIndex:
            return '/blog';
        case PUBLIC_ROUTE_KEYS.blogArticle:
            return `/blog/${params.slug}`;
        default:
            return '/';
    }
};

export const buildAlternateLinks = (routeKey, params = {}, options = {}) => {
    const xDefault = options.xDefault ?? buildLocalizedPath(DEFAULT_LOCALE, routeKey, params);

    return [
        ...SUPPORTED_LOCALES.map((locale) => ({
            hrefLang: getLocaleMeta(locale).hreflang,
            href: buildLocalizedPath(locale, routeKey, params),
        })),
        { hrefLang: 'x-default', href: xDefault },
    ];
};

export const getPublicSeoConfig = (locale, routeKey, params = {}, options = {}) => {
    const safeLocale = normalizeLocale(locale);

    return {
        canonical: buildLocalizedPath(safeLocale, routeKey, params),
        locale: getLocaleMeta(safeLocale).ogLocale,
        alternates: buildAlternateLinks(routeKey, params, options),
    };
};

export const resolveLocalizedPathname = (pathname = '/', nextLocale = DEFAULT_LOCALE) => {
    const safeLocale = normalizeLocale(nextLocale);
    const currentLocale = getLocaleFromPathname(pathname);

    if (currentLocale) {
        return pathname.replace(/^\/(kk|ru)(?=\/|$)/, `/${safeLocale}`);
    }

    if (pathname === '/' || pathname === '') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.home);
    }

    if (pathname === '/categories') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.categories);
    }

    if (pathname.startsWith('/categories/')) {
        const slug = pathname.slice('/categories/'.length);
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.category, { slug });
    }

    if (pathname === '/faq') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.faq);
    }

    if (pathname === '/contact') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.contact);
    }

    if (pathname === '/blog') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.blogIndex);
    }

    if (pathname.startsWith('/blog/')) {
        const slug = pathname.slice('/blog/'.length);
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.blogArticle, { slug });
    }

    if (pathname === '/meretoi-shakyru') {
        return buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' });
    }

    return null;
};

export const getInitialLangForPathname = (pathname = '/') => {
    const routeLocale = getLocaleFromPathname(pathname);

    if (routeLocale) {
        return routeLocale;
    }

    if (isAppPath(pathname)) {
        return undefined;
    }

    return DEFAULT_LOCALE;
};
