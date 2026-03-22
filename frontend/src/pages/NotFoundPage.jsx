import Layout from '../components/layout/Layout';
import NoIndexSEO from '../components/NoIndexSEO';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath } from '../seo/publicRoutes';

const NotFoundPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const quickLinks = [
        { label: tr('Басты бет', 'Главная'), href: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home) },
        { label: tr('Санаттар', 'Категории'), href: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories) },
        { label: tr('Блог', 'Блог'), href: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex) },
        { label: tr('Байланыс', 'Контакты'), href: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.contact) },
    ];

    return (
        <Layout>
            <NoIndexSEO
                title={tr('Бет табылмады', 'Страница не найдена')}
                description={tr(
                    'Сұралған бет табылмады. Негізгі маркетинг беттеріне оралыңыз.',
                    'Запрошенная страница не найдена. Вернитесь к основным страницам сайта.'
                )}
                robots="noindex,follow"
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#064e3b', marginBottom: '1rem' }}>
                    {tr('Бет табылмады', 'Страница не найдена')}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                    {tr(
                        'Бұл URL жарамсыз, ескірген немесе жылжытылған болуы мүмкін. Төмендегі негізгі беттердің біріне өтіңіз.',
                        'Этот URL может быть неверным, устаревшим или перемещённым. Перейдите на одну из основных страниц ниже.'
                    )}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {quickLinks.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            style={{
                                color: '#10b981',
                                fontWeight: 700,
                                textDecoration: 'none',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '999px',
                                border: '1px solid rgba(16,185,129,0.16)',
                                background: '#f0fdf4',
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default NotFoundPage;
