import Button from '../components/Button';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { blogPosts } from '../content/blogPosts';
import { getCategoryLandingById } from '../content/categoryLandingContent';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, getPublicSeoConfig } from '../seo/publicRoutes';

const BlogPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const pick = (value) => (lang === 'ru' ? value.ru : value.kk);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.blogIndex);
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
                name: tr('Блог', 'Блог'),
                item: `https://toi.com.kz${seo.canonical}`,
            },
        ],
    };

    return (
        <Layout>
            <SEO
                title={tr('Блог', 'Блог')}
                description={tr(
                    'Онлайн шақырту, тойға дайындық және санаттық landing беттер туралы практикалық мақалалар.',
                    'Практические статьи об онлайн-приглашениях, подготовке к тою и правильной структуре посадочных страниц.'
                )}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                        {tr('Toiga Shaqyru блогы', 'Блог Toiga Shaqyru')}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.7 }}>
                        {tr(
                            'Бұл бөлім енді тек teaser карталар емес. Әр мақалада нақты URL, толық мәтін, құрылымды тақырыптар және тиісті санаттарға ішкі сілтемелер бар.',
                            'Этот раздел больше не является пустой витриной. У каждой статьи теперь есть отдельный URL, полный текст, структурированные заголовки и внутренние ссылки на релевантные категории.'
                        )}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {blogPosts.map((post) => {
                        const category = getCategoryLandingById(post.categoryId);

                        return (
                            <article key={post.id} style={{ background: 'white', borderRadius: '2rem', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '200px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                                    {post.image}
                                </div>
                                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginBottom: '0.75rem' }}>
                                        {post.dateLabel}
                                    </div>
                                    <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#064e3b', marginBottom: '1rem', lineHeight: 1.4 }}>
                                        {pick(post.title)}
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                                        {pick(post.excerpt)}
                                    </p>
                                    {category && (
                                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                            {tr('Негізгі санат:', 'Основная категория:')} {tr(category.h1.kk, category.h1.ru)}
                                        </div>
                                    )}
                                    <div style={{ marginTop: 'auto', display: 'grid', gap: '0.75rem' }}>
                                        <Button
                                            to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogArticle, { slug: post.slug })}
                                            style={{ width: '100%' }}
                                        >
                                            {tr('Мақаланы оқу', 'Читать статью')}
                                        </Button>
                                        {category && (
                                            <Button
                                                variant="outline"
                                                to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: category.slug })}
                                                style={{ width: '100%' }}
                                            >
                                                {tr('Санат бетін ашу', 'Открыть категорию')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </Layout>
    );
};

export default BlogPage;
