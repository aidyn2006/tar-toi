import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../Button';
import LanguageSwitch from '../LanguageSwitch';
import { useLang } from '../../context/LanguageContext';

const Header = ({ onAuthClick }) => {
    const { lang } = useLang();
    const location = useLocation();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const isHome = location.pathname === '/';

    const navLinks = [
        { name: tr('Мүмкіндіктер', 'Возможности'), path: isHome ? '#features' : '/#features' },
        { name: tr('Үлгілер', 'Шаблоны'), path: '/categories' },
        { name: tr('Блог', 'Блог'), path: '/blog' },
        { name: 'FAQ', path: '/faq' },
        { name: tr('Байланыс', 'Контакты'), path: '/contact' },
    ];

    return (
        <header className="home-header" style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(248,255,254,0.9)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(16,185,129,0.1)'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#10b981', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,0.3)', fontSize: '0.875rem' }}>TS</div>
                <span className="home-logo-text" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#064e3b' }}>Toiga Shaqyru</span>
            </Link>

            <nav className="home-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {navLinks.map((link, i) => (
                    link.path.startsWith('#') || (link.path.startsWith('/#')) ? (
                        <a key={i} className="home-nav-link" href={link.path} style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>
                            {link.name}
                        </a>
                    ) : (
                        <Link key={i} className="home-nav-link" to={link.path} style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>
                            {link.name}
                        </Link>
                    )
                ))}

                <LanguageSwitch compact />

                <Button className="home-nav-btn desktop-only" variant="outline" onClick={() => onAuthClick('login')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                    {tr('Кіру', 'Войти')}
                </Button>
                <Button className="home-nav-btn desktop-only" onClick={() => onAuthClick('register')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                    {tr('Тіркелу', 'Регистрация')}
                </Button>
            </nav>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .home-nav-link { display: none !important; }
                    .home-header { padding: 0.75rem 1rem !important; }
                }
            `}</style>
        </header>
    );
};

export default Header;
