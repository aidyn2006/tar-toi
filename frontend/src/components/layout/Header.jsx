import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../Button';
import LanguageSwitch from '../LanguageSwitch';
import { useLang } from '../../context/LanguageContext';
import { SITE_META } from '../../config/siteMeta';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, isLocalizedHomePath } from '../../seo/publicRoutes';

const Header = ({ onAuthClick }) => {
    const { lang } = useLang();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const homePath = buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home);
    const isHome = isLocalizedHomePath(location.pathname);

    const navLinks = [
        { name: tr('Мүмкіндіктер', 'Возможности'), path: isHome ? '#features' : `${homePath}#features` },
        { name: tr('Үлгілер', 'Шаблоны'), path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories) },
        { name: tr('Мерейтой', 'Юбилей'), path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' }) },
        { name: tr('Блог', 'Блог'), path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex) },
        { name: 'FAQ', path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.faq) },
        { name: tr('Байланыс', 'Контакты'), path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.contact) },
    ];

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        if (!mobileMenuOpen) return undefined;

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflow;
        };
    }, [mobileMenuOpen]);

    const renderNavItem = (link, className, onClick) => (
        link.path.includes('#') ? (
            <a
                key={link.path}
                className={className}
                href={link.path}
                onClick={onClick}
                style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}
            >
                {link.name}
            </a>
        ) : (
            <Link
                key={link.path}
                className={className}
                to={link.path}
                onClick={onClick}
                style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}
            >
                {link.name}
            </Link>
        )
    );

    return (
        <>
            <header
                className="home-header"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 200,
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(248,255,254,0.92)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(16,185,129,0.1)',
                }}
            >
                <Link to={homePath} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                    <img
                        src={SITE_META.logoPath}
                        alt={`${SITE_META.brandName} logo`}
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', objectFit: 'cover' }}
                    />
                    <span
                        className="home-logo-text"
                        style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#064e3b' }}
                    >
                        {SITE_META.brandName}
                    </span>
                </Link>

                <nav className="home-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {navLinks.map((link) => renderNavItem(link, 'home-nav-link'))}

                    <LanguageSwitch compact />

                    <Button
                        className="home-nav-btn desktop-only"
                        variant="outline"
                        onClick={() => onAuthClick('login')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                    >
                        {tr('Кіру', 'Войти')}
                    </Button>
                    <Button
                        className="home-nav-btn desktop-only"
                        onClick={() => onAuthClick('register')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                    >
                        {tr('Тіркелу', 'Регистрация')}
                    </Button>
                </nav>

                <button
                    type="button"
                    className="home-menu-toggle"
                    aria-label={mobileMenuOpen ? tr('Мәзірді жабу', 'Закрыть меню') : tr('Мәзірді ашу', 'Открыть меню')}
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((value) => !value)}
                    style={{
                        display: 'none',
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '0.9rem',
                        border: '1px solid rgba(16,185,129,0.16)',
                        background: '#ffffff',
                        color: '#064e3b',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 24px rgba(16,185,129,0.08)',
                    }}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {mobileMenuOpen && (
                <div
                    className="home-mobile-menu-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 190,
                        background: 'rgba(6,78,59,0.2)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <div
                        className="home-mobile-menu"
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: '4.75rem',
                            left: '1rem',
                            right: '1rem',
                            padding: '1rem',
                            borderRadius: '1.5rem',
                            background: '#ffffff',
                            border: '1px solid rgba(16,185,129,0.14)',
                            boxShadow: '0 24px 60px rgba(16,185,129,0.16)',
                            display: 'grid',
                            gap: '0.25rem',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                padding: '0.25rem 0.25rem 0.75rem',
                                borderBottom: '1px solid rgba(16,185,129,0.1)',
                                marginBottom: '0.25rem',
                            }}
                        >
                            <div style={{ fontWeight: 700, color: '#064e3b' }}>{SITE_META.brandName}</div>
                            <LanguageSwitch compact />
                        </div>

                        {navLinks.map((link) => renderNavItem(link, 'home-mobile-nav-link', () => setMobileMenuOpen(false)))}

                        <div
                            style={{
                                display: 'grid',
                                gap: '0.75rem',
                                paddingTop: '0.9rem',
                                marginTop: '0.5rem',
                                borderTop: '1px solid rgba(16,185,129,0.1)',
                            }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onAuthClick('login');
                                }}
                                style={{ width: '100%', height: '3rem' }}
                            >
                                {tr('Кіру', 'Войти')}
                            </Button>
                            <Button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onAuthClick('register');
                                }}
                                style={{ width: '100%', height: '3rem' }}
                            >
                                {tr('Тіркелу', 'Регистрация')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .home-header {
                        padding: 0.75rem 1rem !important;
                    }

                    .desktop-only,
                    .home-nav-link {
                        display: none !important;
                    }

                    .home-menu-toggle {
                        display: inline-flex !important;
                    }

                    .home-logo-text {
                        font-size: 0.98rem !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Header;
