import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import Button from '../components/Button';
import { categories } from '../config/categories';
import { getCategoryLandingById } from '../content/categoryLandingContent';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, getPublicSeoConfig } from '../seo/publicRoutes';

const CategoriesPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.categories);
    const categoryCards = categories
        .map((category) => ({
            ...category,
            landing: getCategoryLandingById(category.id),
        }))
        .filter((item) => item.landing);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Toiga Shaqyru',
                item: 'https://toi.com.kz',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: tr('Шақырту санаттары', 'Категории приглашений'),
                item: `https://toi.com.kz${seo.canonical}`,
            },
        ],
    };

    return (
        <Layout>
            <SEO
                title={tr('Шақырту санаттары', 'Категории приглашений')}
                description={tr(
                    'Той түріне қарай бөлек landing беттерін ашып, нақты санаттан онлайн шақырту жасауға өтіңіз.',
                    'Откройте отдельные посадочные страницы по типу мероприятия и переходите к созданию онлайн-приглашения из нужной категории.'
                )}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                        {tr('Шақырту санаттары', 'Категории приглашений')}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '44rem', margin: '0 auto', lineHeight: 1.7 }}>
                        {tr(
                            'Енді әр негізгі той түрі үшін жеке landing беті бар. Алдымен санатты ашып, сол жерден мазмұн мен үлгіні қарап шығыңыз, содан кейін ғана конструкторға өтіңіз.',
                            'Теперь для каждого ключевого формата мероприятия есть отдельная посадочная страница. Сначала откройте нужную категорию, изучите контент и шаблоны, а затем переходите в конструктор.'
                        )}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {categoryCards.map((item) => (
                        <article
                            key={item.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                padding: '2rem',
                                borderRadius: '1.75rem',
                                background: item.bg,
                                border: '1px solid rgba(16,185,129,0.12)',
                            }}
                        >
                            <div style={{ fontSize: '2.5rem' }}>{item.icon}</div>
                            <div>
                                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', color: '#064e3b', marginBottom: '0.5rem' }}>
                                    {tr(item.landing.h1.kk, item.landing.h1.ru)}
                                </h2>
                                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                    {tr(item.landing.intro.kk, item.landing.intro.ru)}
                                </p>
                                <div style={{ color: '#10b981', fontWeight: 700 }}>
                                    {item.count} {tr('дайын үлгі', 'готовых шаблонов')}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '0.75rem', marginTop: 'auto' }}>
                                <Button
                                    to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: item.landing.slug })}
                                    style={{ width: '100%', height: '3.15rem' }}
                                >
                                    {tr('Санат бетін ашу', 'Открыть категорию')}
                                </Button>
                                <Button
                                    variant="outline"
                                    to={`/invite/new?category=${item.id}`}
                                    style={{ width: '100%', height: '3.15rem' }}
                                >
                                    {tr('Осы санатпен шақырту жасау', 'Создать приглашение в этой категории')}
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                <div style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '1.75rem', background: 'white', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.45rem', color: '#064e3b', marginBottom: '1rem' }}>
                        {tr('Бұл архитектура не үшін өзгерді', 'Зачем меняется архитектура страницы')}
                    </h2>
                    <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '0.9rem' }}>
                        {tr(
                            'Бұрын барлық санаттар бір жалпы бетте ғана жиналып тұрды. Енді әр коммерциялық сұранысқа жеке URL, жеке H1, жеке мәтін және нақты әрекетке шақыру берілді.',
                            'Раньше все категории были собраны только в одном общем листинге. Теперь у каждого коммерческого запроса есть отдельный URL, свой H1, собственный текст и понятный CTA.'
                        )}
                    </p>
                    <p style={{ color: '#64748b', lineHeight: 1.8, margin: 0 }}>
                        {tr(
                            'Бұл Google үшін санаттардың мақсатын айқынырақ етеді және пайдаланушыны жалпы каталогтан гөрі нақты бетке апарады.',
                            'Это делает назначение категории понятнее для Google и отправляет пользователя не в обезличенный каталог, а на релевантную посадочную страницу.'
                        )}
                    </p>
                </div>
            </section>
        </Layout>
    );
};

export default CategoriesPage;
