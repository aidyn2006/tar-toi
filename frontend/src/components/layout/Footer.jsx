import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { SITE_META } from '../../config/siteMeta';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath } from '../../seo/publicRoutes';

const Footer = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ background: '#022c22', color: '#a7f3d0', padding: '2.4rem 1.5rem', fontSize: '0.875rem' }}>
            <div
                className="home-footer-inner"
                style={{
                    maxWidth: '72rem',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
            >
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <Link
                        to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
                    >
                        <img
                            src={SITE_META.logoPath}
                            alt={`${SITE_META.brandName} logo`}
                            style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem', objectFit: 'cover' }}
                        />
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{SITE_META.brandName}</span>
                    </Link>

                    <p style={{ margin: 0, color: '#d1fae5', lineHeight: 1.7, maxWidth: '30rem' }}>
                        {tr(
                            'Қазақ тойына арналған онлайн шақырту сервисі: шаблон таңдау, мәтін өңдеу, WhatsApp арқылы жіберу және RSVP бақылау бір жерде.',
                            'Сервис онлайн-приглашений для казахских мероприятий: выбор шаблона, редактирование текста, отправка через WhatsApp и сбор RSVP в одном месте.'
                        )}
                    </p>

                    <div style={{ color: '#86efac' }}>
                        {tr(`© ${currentYear} ${SITE_META.brandName}. Барлық құқықтар қорғалған.`, `© ${currentYear} ${SITE_META.brandName}. Все права защищены.`)}
                    </div>
                </div>

                <div
                    className="home-footer-links"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '0.85rem 1.25rem',
                    }}
                >
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        {tr('Үлгілер', 'Шаблоны')}
                    </Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' })} style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        {tr('Мерейтой', 'Юбилей')}
                    </Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        {tr('Блог', 'Блог')}
                    </Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.faq)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        FAQ
                    </Link>
                    <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.contact)} style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        {tr('Байланыс', 'Контакты')}
                    </Link>
                    <a href={SITE_META.supportWhatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        WhatsApp
                    </a>
                    <a href={SITE_META.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>
                        Instagram
                    </a>
                </div>
            </div>

            <style>{`
                @media (max-width: 720px) {
                    .home-footer-inner {
                        grid-template-columns: 1fr !important;
                    }

                    .home-footer-links {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }

                @media (max-width: 520px) {
                    .home-footer-links {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
