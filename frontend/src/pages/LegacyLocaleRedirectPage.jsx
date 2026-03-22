import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import {
    DEFAULT_LOCALE,
    LOCALE_META,
    buildAlternateLinks,
    buildLocalizedPath,
} from '../seo/publicRoutes';

const STORAGE_KEY = 'shaqyrtu_lang';

const detectPreferredLocale = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_LOCALE;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && LOCALE_META[stored]) {
            return stored;
        }
    } catch (_) {
        // Ignore storage access issues and fall back to browser language.
    }

    return window.navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : DEFAULT_LOCALE;
};

const LegacyLocaleRedirectPage = ({
    targetPath,
    title,
    description,
    smartLocale = false,
    alternates,
}) => {
    const clientTarget = useMemo(() => {
        if (!smartLocale) {
            return targetPath;
        }

        return buildLocalizedPath(detectPreferredLocale(), 'home');
    }, [smartLocale, targetPath]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const nextUrl = `${clientTarget}${window.location.search}${window.location.hash}`;

        if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
            window.location.replace(nextUrl);
        }
    }, [clientTarget]);

    return (
        <Layout>
            <SEO
                title={title}
                description={description}
                canonical={targetPath}
                locale={LOCALE_META[DEFAULT_LOCALE].ogLocale}
                alternates={alternates || buildAlternateLinks('home', {}, { xDefault: '/' })}
                robots="noindex,follow"
            />
            <Helmet>
                <meta httpEquiv="refresh" content={`0;url=${targetPath}`} />
            </Helmet>

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#064e3b', marginBottom: '1rem' }}>
                    {title}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    {description}
                </p>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                    Егер автоматты түрде өтпесе, төмендегі сілтемені ашыңыз.
                </p>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                    Если переход не произошел автоматически, откройте нужную локаль вручную.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/kk/" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>
                        Қазақша
                    </Link>
                    <Link to="/ru/" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>
                        Русский
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export default LegacyLocaleRedirectPage;
