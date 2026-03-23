import { blogPosts } from '../content/blogPosts.js';
import { getAllCategorySlugs } from '../content/categoryLandingContent.js';
import {
    DEFAULT_LOCALE,
    PUBLIC_ROUTE_KEYS,
    SUPPORTED_LOCALES,
    buildLegacyPath,
    buildLocalizedPath,
} from './publicRoutes.js';

const baseLocalizedRoutes = [
    {
        key: PUBLIC_ROUTE_KEYS.home,
        priority: '1.0',
        changefreq: 'daily',
    },
    {
        key: PUBLIC_ROUTE_KEYS.categories,
        priority: '0.9',
        changefreq: 'weekly',
    },
    {
        key: PUBLIC_ROUTE_KEYS.faq,
        priority: '0.8',
        changefreq: 'monthly',
    },
    {
        key: PUBLIC_ROUTE_KEYS.contact,
        priority: '0.7',
        changefreq: 'monthly',
    },
    {
        key: PUBLIC_ROUTE_KEYS.blogIndex,
        priority: '0.7',
        changefreq: 'monthly',
    },
];

export const localizedIndexableRoutes = [
    ...SUPPORTED_LOCALES.flatMap((locale) => (
        [
            ...baseLocalizedRoutes.map((route) => ({
                loc: buildLocalizedPath(locale, route.key),
                priority: route.priority,
                changefreq: route.changefreq,
            })),
            ...getAllCategorySlugs().map((slug) => ({
                loc: buildLocalizedPath(locale, PUBLIC_ROUTE_KEYS.category, { slug }),
                priority: '0.8',
                changefreq: 'weekly',
            })),
            ...blogPosts.map((post) => ({
                loc: buildLocalizedPath(locale, PUBLIC_ROUTE_KEYS.blogArticle, { slug: post.slug }),
                priority: '0.7',
                changefreq: 'monthly',
            })),
        ]
    )),
];

export const legacyRedirectRoutes = [
    buildLegacyPath(PUBLIC_ROUTE_KEYS.home),
    buildLegacyPath(PUBLIC_ROUTE_KEYS.categories),
    ...getAllCategorySlugs().map((slug) => buildLegacyPath(PUBLIC_ROUTE_KEYS.category, { slug })),
    buildLegacyPath(PUBLIC_ROUTE_KEYS.faq),
    buildLegacyPath(PUBLIC_ROUTE_KEYS.contact),
    buildLegacyPath(PUBLIC_ROUTE_KEYS.blogIndex),
    ...blogPosts.map((post) => buildLegacyPath(PUBLIC_ROUTE_KEYS.blogArticle, { slug: post.slug })),
    '/meretoi-shakyru',
    ...SUPPORTED_LOCALES.map((locale) => `/${locale}/meretoi-shakyru`),
];

export const prerenderRoutes = [
    ...new Set([
        ...localizedIndexableRoutes.map((route) => route.loc),
        ...legacyRedirectRoutes,
    ]),
];

export const defaultLocaleRoot = buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.home);
