import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Toiga Shaqyru';
const SITE_URL = 'https://toi.com.kz';
const DEFAULT_DESCRIPTION = 'Toiga Shaqyru - Тойға, ұзатуға, сүндетке тегін онлайн шақырту жасаңыз. 30+ дайын шаблон.';
const DEFAULT_LOCALE = 'kk_KZ';

const toAbsoluteUrl = (value) => {
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `${SITE_URL}${value}`;
};

const toHtmlLang = (locale) => {
    if (!locale) return 'kk';
    return locale.split(/[-_]/)[0] || 'kk';
};

const normalizeJsonLd = (jsonLd) => {
    if (!jsonLd) return [];
    return Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : [jsonLd];
};

const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    canonical = '/',
    keywords,
    robots = 'index,follow',
    locale = DEFAULT_LOCALE,
    alternates = [],
    og = {},
    twitter = {},
    jsonLd,
}) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const hasCanonical = canonical !== null && canonical !== false;
    const fullCanonical = hasCanonical ? toAbsoluteUrl(canonical || '/') : '';
    const htmlLang = toHtmlLang(locale);
    const ogTitle = og.title || fullTitle;
    const ogDescription = og.description || description;
    const ogType = og.type || 'website';
    const ogUrl = toAbsoluteUrl(og.url || fullCanonical);
    const ogImage = toAbsoluteUrl(og.image || '');
    const twitterCard = twitter.card || (ogImage ? 'summary_large_image' : 'summary');
    const twitterTitle = twitter.title || ogTitle;
    const twitterDescription = twitter.description || ogDescription;
    const twitterImage = toAbsoluteUrl(twitter.image || ogImage);
    const jsonLdItems = normalizeJsonLd(jsonLd);

    return (
        <Helmet htmlAttributes={{ lang: htmlLang }}>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {hasCanonical && <link rel="canonical" href={fullCanonical} />}
            {alternates.map((alternate) => (
                <link
                    key={`${alternate.hrefLang}-${alternate.href}`}
                    rel="alternate"
                    hrefLang={alternate.hrefLang}
                    href={toAbsoluteUrl(alternate.href)}
                />
            ))}
            {keywords && <meta name="keywords" content={keywords} />}
            {robots && <meta name="robots" content={robots} />}

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:type" content={ogType} />
            <meta property="og:locale" content={og.locale || locale} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={twitterTitle} />
            <meta name="twitter:description" content={twitterDescription} />
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}

            {jsonLdItems.map((payload, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                >
                    {safeJson(payload)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
