import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath } from '../../seo/publicRoutes';

const Footer = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <footer style={{ background: '#022c22', color: '#a7f3d0', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <div className="home-footer-inner" style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: '#10b981', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>sh</div>
                    <span style={{ color: 'white', fontWeight: 700 }}>Toiga Shaqyru</span>
                </Link>
                <div>{tr('© 2025 Toiga Shaqyru — Барлық құқықтар қорғалған', '© 2025 Toiga Shaqyru — Все права защищены')}</div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>{tr('Үлгілер', 'Шаблоны')}</Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })} style={{ color: '#a7f3d0', textDecoration: 'none' }}>{tr('Мерейтой', 'Юбилей')}</Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>{tr('Блог', 'Блог')}</Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.faq)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>FAQ</Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.contact)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>{tr('Байланыс', 'Контакты')}</Link>
                    <a href="https://wa.me/77056842747" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>WhatsApp</a>
                    <a href="https://instagram.com/codejaz.kz" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>Instagram</a>
                </div>
            </div>
            <style>{`
                @media (max-width: 640px) {
                    .home-footer-inner {
                        justify-content: center !important;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
