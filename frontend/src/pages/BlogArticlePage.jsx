import { Link, Navigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import Layout from '../components/layout/Layout';
import { getBlogPostBySlug } from '../content/blogPosts';
import { getCategoryLandingById } from '../content/categoryLandingContent';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, getPublicSeoConfig } from '../seo/publicRoutes';

const BlogArticlePage = () => {
    const { slug } = useParams();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const pick = (value) => (lang === 'ru' ? value.ru : value.kk);
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return <Navigate to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex)} replace />;
    }

    const category = getCategoryLandingById(post.categoryId);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.blogArticle, { slug: post.slug });
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
                    name: tr('Блог', 'Блог'),
                    item: `https://toi.com.kz${buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex)}`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: pick(post.title),
                    item: `https://toi.com.kz${seo.canonical}`,
                },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: pick(post.title),
            description: pick(post.description),
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            inLanguage: lang,
            author: {
                '@type': 'Organization',
                name: 'Toiga Shaqyru',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Toiga Shaqyru',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://toi.com.kz/logo.png',
                },
            },
            mainEntityOfPage: `https://toi.com.kz${seo.canonical}`,
        },
    ];

    return (
        <Layout>
            <SEO
                title={pick(post.title)}
                description={pick(post.description)}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <article style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '56rem', margin: '0 auto' }}>
                <Link to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.blogIndex)} style={{ display: 'inline-block', color: '#10b981', fontWeight: 700, textDecoration: 'none', marginBottom: '1.25rem' }}>
                    ← {tr('Блогқа оралу', 'Назад в блог')}
                </Link>

                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginBottom: '0.85rem' }}>
                    {post.dateLabel}
                </div>

                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.2, color: '#064e3b', marginBottom: '1rem' }}>
                    {pick(post.title)}
                </h1>

                <p style={{ color: '#64748b', fontSize: '1.08rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                    {pick(post.intro)}
                </p>

                <div style={{ height: '220px', borderRadius: '2rem', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '2rem' }}>
                    {post.image}
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {post.sections.map((section) => (
                        <section key={pick(section.heading)} style={{ padding: '2rem', borderRadius: '1.75rem', background: 'white', border: '1px solid rgba(16,185,129,0.1)' }}>
                            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.3rem', color: '#064e3b', marginBottom: '1rem' }}>
                                {pick(section.heading)}
                            </h2>
                            <div style={{ display: 'grid', gap: '0.9rem' }}>
                                {pick(section.paragraphs).map((paragraph) => (
                                    <p key={paragraph} style={{ color: '#475569', lineHeight: 1.8, margin: 0 }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1.75rem', background: '#064e3b', color: 'white' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                        {tr('Мақаладан кейінгі әрекет', 'Что делать дальше')}
                    </h2>
                    <p style={{ color: '#d1fae5', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                        {tr(
                            'Егер осы тақырып сіздің шараңызға сәйкес келсе, енді нақты санат бетіне өтіп, сол жерден шақырту үлгісін таңдаңыз.',
                            'Если тема статьи совпадает с вашим мероприятием, переходите на соответствующую категорию и выбирайте шаблон уже там.'
                        )}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {category && (
                            <Button
                                to={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: category.slug })}
                                style={{ height: '3.2rem', padding: '0.9rem 2rem' }}
                            >
                                {tr('Санат бетін ашу', 'Открыть страницу категории')}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            to={`/invite/new?category=${post.categoryId}`}
                            style={{ height: '3.2rem', padding: '0.9rem 2rem', borderColor: '#d1fae5', color: '#d1fae5' }}
                        >
                            {tr('Шақырту жасау', 'Создать приглашение')}
                        </Button>
                    </div>
                </div>
            </article>
        </Layout>
    );
};

export default BlogArticlePage;
