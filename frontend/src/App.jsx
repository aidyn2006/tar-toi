import { lazy, Suspense, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
    useParams,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { authService } from './api/authService';
import { LanguageProvider, useLang } from './context/LanguageContext';
import NoIndexSEO from './components/NoIndexSEO';

import Home from './pages/Home';
import CategoriesPage from './pages/CategoriesPage';
import CategoryLandingPage from './pages/CategoryLandingPage';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import ContactPage from './pages/ContactPage';
import LegacyLocaleRedirectPage from './pages/LegacyLocaleRedirectPage';
import NotFoundPage from './pages/NotFoundPage';
import {
    DEFAULT_LOCALE,
    PUBLIC_ROUTE_KEYS,
    buildAlternateLinks,
    buildLocalizedPath,
    getInitialLangForPathname,
    isSupportedLocale,
} from './seo/publicRoutes';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EditInvitePage = lazy(() => import('./pages/EditInvitePage'));
const PublicInvitePage = lazy(() => import('./pages/PublicInvitePage'));
const GuestListPage = lazy(() => import('./pages/GuestListPage'));

const STORAGE_KEY = 'shaqyrtu_lang';

const getStoredLocale = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_LOCALE;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && isSupportedLocale(stored)) {
            return stored;
        }
    } catch (_) {
        // Ignore storage failures and fall back to the default locale.
    }

    return DEFAULT_LOCALE;
};

const ProtectedRoute = ({ children, seoTitle, seoDescription, robots = 'noindex,nofollow' }) => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru ?? kk ?? '' : kk ?? ru ?? '');

    if (authService.isLoggedIn()) {
        return (
            <>
                <NoIndexSEO
                    title={typeof seoTitle === 'string' ? seoTitle : tr(seoTitle?.kk, seoTitle?.ru)}
                    description={typeof seoDescription === 'string' ? seoDescription : tr(seoDescription?.kk, seoDescription?.ru)}
                    robots={robots}
                />
                {children}
            </>
        );
    }

    const next = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`
    );
    const locale = getStoredLocale();

    return (
        <Navigate
            to={`${buildLocalizedPath(locale, PUBLIC_ROUTE_KEYS.home)}?auth=login&reason=unauthorized&next=${next}`}
            replace
        />
    );
};

const PageLoader = () => (
    <div style={{
        height: '100vh', width: '100vw', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fffe', color: '#10b981',
        fontFamily: 'Unbounded, sans-serif'
    }}>
        Жүктелуде...
    </div>
);

const LocalizedPublicBoundary = () => {
    const { locale } = useParams();
    const { setLang } = useLang();

    useEffect(() => {
        if (isSupportedLocale(locale)) {
            setLang(locale);
        }
    }, [locale, setLang]);

    if (!isSupportedLocale(locale)) {
        return <Navigate to={buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.home)} replace />;
    }

    return <Outlet />;
};

const RootLocaleGateway = () => (
    <LegacyLocaleRedirectPage
        targetPath={buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.home)}
        smartLocale
        title="Toiga Shaqyru"
        description="Тілді таңдаңыз немесе әдепкі локальға өтіңіз. Выберите язык или перейдите на локализованную версию сайта."
        alternates={[
            { hrefLang: 'kk-KZ', href: buildLocalizedPath('kk', PUBLIC_ROUTE_KEYS.home) },
            { hrefLang: 'ru-KZ', href: buildLocalizedPath('ru', PUBLIC_ROUTE_KEYS.home) },
            { hrefLang: 'x-default', href: '/' },
        ]}
    />
);

const LegacyRouteRedirect = ({ routeKey, title, description }) => (
    <LegacyLocaleRedirectPage
        targetPath={buildLocalizedPath(DEFAULT_LOCALE, routeKey)}
        title={title}
        description={description}
        alternates={buildAlternateLinks(routeKey)}
    />
);

const LegacyCategoryRedirect = () => {
    const { slug } = useParams();

    return (
        <LegacyLocaleRedirectPage
            targetPath={buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.category, { slug })}
            title="Санат беті"
            description="Бұл бет локальмен бірге жаңа санат URL-іне көшірілді. Страница перенесена на новую локализованную категорию."
            alternates={buildAlternateLinks(PUBLIC_ROUTE_KEYS.category, { slug })}
        />
    );
};

const LegacyBlogArticleRedirect = () => {
    const { slug } = useParams();

    return (
        <LegacyLocaleRedirectPage
            targetPath={buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.blogArticle, { slug })}
            title="Блог мақаласы"
            description="Мақала локальмен бірге жаңа URL-ге көшірілді. Статья перенесена на новый локализованный URL."
            alternates={buildAlternateLinks(PUBLIC_ROUTE_KEYS.blogArticle, { slug })}
        />
    );
};

const LocalizedMereiAliasRedirect = () => {
    const { locale } = useParams();
    const safeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

    return (
        <LegacyLocaleRedirectPage
            targetPath={buildLocalizedPath(safeLocale, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })}
            title="Мерейтой"
            description="Мерейтой беті енді толық категория бетіне ауыстырылды. Страница юбилея перенесена в полноценную категорию."
            alternates={buildAlternateLinks(PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })}
        />
    );
};

const LegacyMereiRedirect = () => (
    <LegacyLocaleRedirectPage
        targetPath={buildLocalizedPath(DEFAULT_LOCALE, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })}
        title="Мерейтой"
        description="Мерейтой беті енді локальмен бірге жаңа категориялық URL-ге көшірілді. Страница юбилея перенесена на новый локализованный URL."
        alternates={buildAlternateLinks(PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })}
    />
);

export const AppProviders = ({ children, helmetContext, initialLang }) => (
    <HelmetProvider context={helmetContext}>
        <LanguageProvider initialLang={initialLang}>
            {children}
        </LanguageProvider>
    </HelmetProvider>
);

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<RootLocaleGateway />} />
        <Route path="/categories" element={<LegacyRouteRedirect routeKey={PUBLIC_ROUTE_KEYS.categories} title="Шақырту санаттары" description="Жаңа локальмен бірге санаттар бетіне өтіңіз. Перейдите на новую локализованную страницу категорий." />} />
        <Route path="/categories/:slug" element={<LegacyCategoryRedirect />} />
        <Route path="/faq" element={<LegacyRouteRedirect routeKey={PUBLIC_ROUTE_KEYS.faq} title="FAQ" description="FAQ беті енді локальмен бірге жаңа URL-ге көшірілді. FAQ перенесен на новый локализованный URL." />} />
        <Route path="/contact" element={<LegacyRouteRedirect routeKey={PUBLIC_ROUTE_KEYS.contact} title="Байланыс" description="Контакт беті енді локальмен бірге жаңа URL-ге көшірілді. Страница контактов перенесена на новый локализованный URL." />} />
        <Route path="/blog" element={<LegacyRouteRedirect routeKey={PUBLIC_ROUTE_KEYS.blogIndex} title="Блог" description="Блог беті енді локальмен бірге жаңа URL-ге көшірілді. Блог перенесен на новый локализованный URL." />} />
        <Route path="/blog/:slug" element={<LegacyBlogArticleRedirect />} />
        <Route path="/meretoi-shakyru" element={<LegacyMereiRedirect />} />

        <Route path="/:locale" element={<LocalizedPublicBoundary />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryLandingPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogArticlePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="meretoi-shakyru" element={<LocalizedMereiAliasRedirect />} />
        </Route>

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute
                    seoTitle={{ kk: 'Жеке кабинет', ru: 'Личный кабинет' }}
                    seoDescription={{ kk: 'Пайдаланушының шақырту панелі.', ru: 'Внутренняя панель пользователя.' }}
                >
                    <Dashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/invite/:id/guests"
            element={
                <ProtectedRoute
                    seoTitle={{ kk: 'Қонақтар тізімі', ru: 'Список гостей' }}
                    seoDescription={{ kk: 'Шақыртуға келген жауаптарды басқару беті.', ru: 'Внутренняя страница управления ответами гостей.' }}
                >
                    <GuestListPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/invite/edit/:id"
            element={
                <ProtectedRoute
                    seoTitle={{ kk: 'Шақыртуды редакциялау', ru: 'Редактирование приглашения' }}
                    seoDescription={{ kk: 'Шақырту редакторының ішкі беті.', ru: 'Внутренняя страница редактора приглашений.' }}
                >
                    <EditInvitePage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/invite/new"
            element={
                <ProtectedRoute
                    seoTitle={{ kk: 'Жаңа шақырту', ru: 'Новое приглашение' }}
                    seoDescription={{ kk: 'Жаңа шақырту құрастырушысының ішкі беті.', ru: 'Внутренняя страница создания приглашения.' }}
                >
                    <EditInvitePage />
                </ProtectedRoute>
            }
        />
        <Route path="/invite/:slug" element={<PublicInvitePage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

const AppRouteTree = () => (
    <Suspense fallback={<PageLoader />}>
        <AppRoutes />
    </Suspense>
);

function App({ initialLang }) {
    const derivedInitialLang = initialLang ?? (
        typeof window !== 'undefined'
            ? getInitialLangForPathname(window.location.pathname)
            : DEFAULT_LOCALE
    );

    return (
        <AppProviders initialLang={derivedInitialLang}>
            <Router>
                <AppRouteTree />
            </Router>
        </AppProviders>
    );
}

export default App;
