import { Link, Navigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import Layout from '../components/layout/Layout';
import { categories } from '../config/categories';
import { getCategoryLandingBySlug, getCategoryLandingById } from '../content/categoryLandingContent';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, getPublicSeoConfig } from '../seo/publicRoutes';

const CategoryLandingPage = () => {
    const { slug } = useParams();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const pick = (value) => (lang === 'ru' ? value.ru : value.kk);
    const landing = getCategoryLandingBySlug(slug);

    if (!landing) {
        return <Navigate to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories)} replace />;
    }

    const category = categories.find((item) => item.id === landing.id);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.category, { slug: landing.slug });
    const relatedPages = landing.related
        .map((id) => getCategoryLandingById(id))
        .filter(Boolean);

    const jsonLd = [
        {
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
                    name: tr('Шақырту үлгілері', 'Шаблоны приглашений'),
                    item: `https://toi.com.kz${buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories)}`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: pick(landing.h1),
                    item: `https://toi.com.kz${seo.canonical}`,
                },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: pick(landing.h1),
            serviceType: tr('Онлайн шақырту жасау', 'Создание онлайн-пригласительных'),
            areaServed: 'KZ',
            provider: {
                '@type': 'Organization',
                name: 'Toiga Shaqyru',
                url: 'https://toi.com.kz',
            },
            url: `https://toi.com.kz${seo.canonical}`,
            description: pick(landing.seoDescription),
        },
    ];

    return (
        <Layout>
            <SEO
                title={pick(landing.seoTitle)}
                description={pick(landing.seoDescription)}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.9fr)', gap: '2rem', alignItems: 'start' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', borderRadius: '999px', background: '#ecfdf5', color: '#065f46', fontWeight: 700, marginBottom: '1.25rem' }}>
                            <span>{category?.icon || '✨'}</span>
                            <span>{category?.count || 0} {tr('дайын үлгі', 'готовых шаблонов')}</span>
                        </div>
                        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.18, color: '#064e3b', marginBottom: '1.25rem' }}>
                            {pick(landing.h1)}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '44rem', marginBottom: '1.75rem' }}>
                            {pick(landing.intro)}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <Button to={`/invite/new?category=${landing.id}`} style={{ height: '3.4rem', padding: '0.95rem 2rem' }}>
                                {tr('Шақырту жасау', 'Создать приглашение')}
                            </Button>
                            <Button variant="outline" to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories)} style={{ height: '3.4rem', padding: '0.95rem 2rem' }}>
                                {tr('Барлық санаттар', 'Все категории')}
                            </Button>
                        </div>
                    </div>

                    <div style={{ padding: '1.75rem', borderRadius: '1.75rem', background: category?.bg || '#f0fdf4', border: '1px solid rgba(16,185,129,0.12)' }}>
                        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.15rem', color: '#064e3b', marginBottom: '1rem' }}>
                            {tr('Бұл санаттағы артықшылықтар', 'Что важно в этой категории')}
                        </h2>
                        <div style={{ display: 'grid', gap: '0.85rem' }}>
                            {pick(landing.benefits).map((item) => (
                                <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#065f46', lineHeight: 1.6 }}>
                                    <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', display: 'grid', gap: '1.5rem' }}>
                    {landing.sections.map((section) => (
                        <article key={pick(section.heading)} style={{ padding: '2rem', borderRadius: '1.75rem', background: 'white', border: '1px solid rgba(16,185,129,0.1)' }}>
                            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.35rem', color: '#064e3b', marginBottom: '1rem' }}>
                                {pick(section.heading)}
                            </h2>
                            <div style={{ display: 'grid', gap: '0.9rem' }}>
                                {pick(section.paragraphs).map((paragraph) => (
                                    <p key={paragraph} style={{ color: '#475569', lineHeight: 1.8, margin: 0 }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div style={{ marginTop: '4rem', padding: '2rem', borderRadius: '1.75rem', background: '#064e3b', color: 'white' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                        {tr('Келесі қадам', 'Следующий шаг')}
                    </h2>
                    <p style={{ color: '#d1fae5', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        {tr(
                            'Санатты қарап шыққаннан кейін шақырту жасау бөліміне өтіп, мәтін мен деректеріңізді енгізіңіз. Бұл бет іздеу үшін, ал конструктор нақты шақырту құрастыру үшін арналған.',
                            'После выбора категории переходите в конструктор, добавляйте свой текст и данные мероприятия. Эта страница отвечает за поиск и выбор, а редактор - за сборку приглашения.'
                        )}
                    </p>
                    <Button to={`/invite/new?category=${landing.id}`} style={{ height: '3.2rem', padding: '0.9rem 2rem', background: '#fbbf24', color: '#064e3b', boxShadow: '0 4px 14px rgba(251,191,36,0.3)' }}>
                        {tr('Осы санатпен бастау', 'Начать с этой категории')}
                    </Button>
                </div>

                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {relatedPages.map((item) => (
                        <Link
                            key={item.id}
                            to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: item.slug })}
                            style={{ padding: '1.25rem 1.4rem', borderRadius: '1.25rem', border: '1px solid rgba(16,185,129,0.12)', background: 'white', color: '#064e3b', textDecoration: 'none' }}
                        >
                            <div style={{ fontWeight: 800, marginBottom: '0.35rem' }}>
                                {(lang === 'ru' ? item.h1.ru : item.h1.kk)}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                {tr('Ұқсас санатты қарау', 'Посмотреть похожую категорию')}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default CategoryLandingPage;
