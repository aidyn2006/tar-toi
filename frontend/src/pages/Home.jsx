import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useLang } from '../context/LanguageContext';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { categories } from '../config/categories';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath, getPublicSeoConfig } from '../seo/publicRoutes';
import { getCategoryLandingById } from '../content/categoryLandingContent';

const features = [
    {
        icon: '⚡',
        title: { kk: 'Жылдам жасау', ru: 'Быстрая сборка' },
        desc: {
            kk: '3 минутта дайын шақырту. Шаблонды таңдап, мәтін жазып, жіберіңіз.',
            ru: 'Готовое приглашение за 3 минуты: выберите шаблон, добавьте текст и отправьте.',
        },
    },
    {
        icon: '📲',
        title: { kk: 'WhatsApp арқылы', ru: 'Через WhatsApp' },
        desc: {
            kk: 'Шақыртуды қатысушыларға WhatsApp-та тікелей жіберіңіз.',
            ru: 'Отправляйте приглашение гостям напрямую в WhatsApp.',
        },
    },
    {
        icon: '📊',
        title: { kk: 'Жауаптарды қадағалау', ru: 'Отслеживание ответов' },
        desc: {
            kk: 'Кім келетінін, кім келмейтінін — барлығын панельде бақылаңыз.',
            ru: 'Отслеживайте, кто придёт и кто отказался, прямо в панели.',
        },
    },
    {
        icon: '🎨',
        title: { kk: 'Дайын үлгілер', ru: 'Готовые шаблоны' },
        desc: {
            kk: 'Әртүрлі той түрлеріне арналған дайын шаблондарды таңдаңыз.',
            ru: 'Выбирайте готовые шаблоны для разных видов торжеств.',
        },
    },
];

const Home = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const navigate = useNavigate();
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.home, {}, { xDefault: '/' });
    const categoriesPath = buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.categories);
    const mereiPath = buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: 'meretoi-shakyru' });
    const registerPath = `${buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home)}#register`;
    const categoryLandingLinks = categories
        .map((category) => {
            const landing = getCategoryLandingById(category.id);

            if (!landing) {
                return null;
            }

            return {
                id: category.id,
                title: tr(category.title.kk, category.title.ru),
                path: buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.category, { slug: landing.slug }),
            };
        })
        .filter(Boolean);
    const homeJsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Toiga Shaqyru',
            url: `https://toi.com.kz${seo.canonical}`,
            logo: 'https://toi.com.kz/logo.png',
            sameAs: ['https://instagram.com/codejaz.kz'],
            contactPoint: [
                {
                    '@type': 'ContactPoint',
                    telephone: '+77056842747',
                    contactType: 'customer support',
                    areaServed: 'KZ',
                    availableLanguage: ['kk', 'ru'],
                },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Toiga Shaqyru',
            url: `https://toi.com.kz${seo.canonical}`,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: tr('Тойға онлайн шақырту жасау', 'Онлайн-приглашения на той'),
            serviceType: tr('Онлайн шақырту сервисі', 'Сервис онлайн-приглашений'),
            areaServed: 'KZ',
            provider: {
                '@type': 'Organization',
                name: 'Toiga Shaqyru',
                url: 'https://toi.com.kz',
            },
            url: `https://toi.com.kz${seo.canonical}`,
            description: tr(
                'Тойға, ұзатуға, мерейтойға арналған онлайн шақырту сервисі.',
                'Сервис онлайн-приглашений для свадьбы, узату и юбилея.'
            ),
        },
    ];

    const handleSelectCategory = (categoryId) => {
        const params = new URLSearchParams({
            category: categoryId,
        });

        navigate(`/invite/new?${params.toString()}`);
    };
    return (
        <Layout>
            <SEO
                title={tr(
                    'Тойға онлайн шақырту жасау',
                    'Онлайн приглашения на той'
                )}
                description={tr(
                    'Тойға, ұзатуға, мерейтойға онлайн шақырту жасаңыз. Дайын шаблондар, WhatsApp арқылы жіберу және RSVP бақылау бір жерде.',
                    'Создавайте онлайн-приглашения на той, узату и юбилей. Готовые шаблоны, отправка через WhatsApp и сбор RSVP в одном сервисе.'
                )}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={homeJsonLd}
            />

            <div className="home-page" style={{ fontFamily: "'Manrope', sans-serif" }}>
                <section
                    className="home-hero"
                    style={{
                        paddingTop: '7.5rem',
                        paddingBottom: '5rem',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        maxWidth: '72rem',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3rem',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.375rem 0.875rem',
                                background: '#ecfdf5',
                                color: '#065f46',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                marginBottom: '1.5rem',
                            }}
                        >
                            {tr('✨ Жаңа мүмкіндіктер қосылды', '✨ Добавили новые функции')}
                        </div>

                        <h1
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                                fontWeight: 700,
                                lineHeight: 1.2,
                                marginBottom: '1.5rem',
                                color: '#064e3b',
                            }}
                        >
                            {tr('Онлайн шақырту жасаңыз –', 'Создайте онлайн-приглашение —')}{' '}
                            <span style={{ color: '#10b981' }}>
                                {tr('тойға дайындықты жеңілдетіңіз.', 'сделайте подготовку проще.')}
                            </span>
                        </h1>

                        <p
                            style={{
                                fontSize: '1.125rem',
                                color: '#64748b',
                                marginBottom: '2rem',
                                lineHeight: 1.7,
                                maxWidth: '34rem',
                            }}
                        >
                            {tr(
                                'Тіркеліп, шаблонды таңдаңыз, мәтінді қосып, шақыртуды WhatsApp арқылы жіберіңіз.',
                                'Зарегистрируйтесь, выберите шаблон, добавьте текст и отправьте приглашение в WhatsApp.'
                            )}
                        </p>

                        <div
                            className="home-hero-cta"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                marginBottom: '3rem',
                            }}
                        >
                            <Button
                                href={registerPath}
                                style={{ padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}
                            >
                                {tr('Тегін бастау', 'Начать бесплатно')}
                            </Button>

                            <div>
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        color: '#94a3b8',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    5000 ₸
                                </div>
                                <div
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#f59e0b',
                                    }}
                                >
                                    {tr('Тегін', 'Бесплатно')}
                                </div>
                            </div>
                        </div>

                        <div
                            className="home-hero-points"
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}
                        >
                            {[
                                tr('3 мин тіркелу', 'Регистрация за 3 мин'),
                                tr('Фото мен музыка', 'Фото и музыка'),
                                tr('WhatsApp жіберу', 'Отправка в WhatsApp'),
                                tr('Жауаптарды бақылау', 'Контроль ответов'),
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#054535',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✓</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="home-hero-cards"
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                    >
{categories.map((cat) => (
    <button
        key={cat.id}
        type="button"
        onClick={() => handleSelectCategory(cat.id)}
        style={{
            padding: '1.75rem',
            borderRadius: '1.75rem',
            background: cat.bg,
            cursor: 'pointer',
            border: '1px solid rgba(16,185,129,0.1)',
            transition: 'all 0.25s ease',
            textDecoration: 'none',
            width: '100%',
            textAlign: 'left',
            appearance: 'none',
        }}
    >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
        <div
            style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#064e3b',
                marginBottom: '0.25rem',
            }}
        >
            {tr(cat.title.kk, cat.title.ru)}
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>
            {cat.count} {tr('үлгі', 'шаблон')}
        </div>
    </button>
))}
                    </div>
                </section>

                <section id="features" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.875rem',
                                    background: '#ecfdf5',
                                    color: '#065f46',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                }}
                            >
                                {tr('🚀 Неге бізді таңдайды?', '🚀 Почему выбирают нас?')}
                            </div>

                            <h2
                                style={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                    fontWeight: 700,
                                    color: '#064e3b',
                                    marginBottom: '1rem',
                                }}
                            >
                                {tr('Барлығы бір жерде', 'Всё в одном месте')}
                            </h2>

                            <p
                                style={{
                                    color: '#64748b',
                                    fontSize: '1.0625rem',
                                    maxWidth: '30rem',
                                    margin: '0 auto',
                                }}
                            >
                                {tr(
                                    'Шақырту жасаудан бастап, жауаптарды бақылауға дейін.',
                                    'От создания пригласительного до сбора ответов.'
                                )}
                            </p>
                        </div>

                        <div
                            className="home-features-grid"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}
                        >
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '2rem 1.5rem',
                                        borderRadius: '1.5rem',
                                        border: '1px solid rgba(16,185,129,0.1)',
                                        background: '#f8fffe',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '1.0625rem',
                                            color: '#064e3b',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        {tr(f.title.kk, f.title.ru)}
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        {tr(f.desc.kk, f.desc.ru)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="categories" style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2
                                style={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                    fontWeight: 700,
                                    color: '#064e3b',
                                    marginBottom: '1rem',
                                }}
                            >
                                {tr('Барлық той түрлері', 'Все виды торжеств')}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>
                                {tr('Дайын шаблондарды таңдаңыз', 'Выберите готовые шаблоны')}
                            </p>
                        </div>

                        <div
                            className="home-categories-grid"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}
                        >
{categories.map((cat) => (
    <button
        key={cat.id}
        type="button"
        onClick={() => handleSelectCategory(cat.id)}
        style={{
            padding: '1.75rem',
            borderRadius: '1.75rem',
            background: cat.bg,
            cursor: 'pointer',
            border: '1px solid rgba(16,185,129,0.1)',
            transition: 'all 0.25s ease',
            textDecoration: 'none',
            width: '100%',
            textAlign: 'left',
            appearance: 'none',
        }}
    >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
        <div
            style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#064e3b',
                marginBottom: '0.25rem',
            }}
        >
            {tr(cat.title.kk, cat.title.ru)}
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>
            {cat.count} {tr('үлгі', 'шаблон')}
        </div>
    </button>
))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                            <Button
                                to={categoriesPath}
                                style={{ padding: '1rem 2.5rem', height: '3.25rem', fontSize: '1rem' }}
                            >
                                {tr('Барлық үлгілерді қарау', 'Посмотреть все шаблоны')}
                            </Button>
                        </div>
                        <div
                            style={{
                                marginTop: '1rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                                justifyContent: 'center',
                            }}
                        >
                            {categoryLandingLinks.map((category) => (
                                <a
                                    key={category.id}
                                    href={category.path}
                                    style={{
                                        color: '#10b981',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        fontSize: '0.92rem',
                                    }}
                                >
                                    {category.title}
                                </a>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <a
                                href={mereiPath}
                                style={{
                                    color: '#10b981',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                }}
                            >
                                {tr('Мерейтойға арналған арнайы бет', 'Спецстраница для юбилейных приглашений')}
                            </a>
                        </div>
                    </div>
                </section>

                <section style={{ padding: '5rem 1.5rem', background: '#064e3b', borderRadius: '4rem 4rem 0 0' }}>
                    <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                        <h2
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: '1rem',
                            }}
                        >
                            {tr('Қалай жұмыс жасайды?', 'Как это работает?')}
                        </h2>

                        <p style={{ color: '#a7f3d0', marginBottom: '3.5rem', fontSize: '1.0625rem' }}>
                            {tr('Тек 3 қадам', 'Всего 3 шага')}
                        </p>

                        <div
                            className="home-steps-grid"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}
                        >
                            {[
                                {
                                    step: '01',
                                    title: tr('Тіркеліңіз', 'Зарегистрируйтесь'),
                                    desc: tr(
                                        'Телефон нөміріңізбен тіркеліп, аккаунт ашыңыз.',
                                        'Зарегистрируйтесь по номеру телефона и создайте аккаунт.'
                                    ),
                                },
                                {
                                    step: '02',
                                    title: tr('Үлгі таңдаңыз', 'Выберите шаблон'),
                                    desc: tr(
                                        'Той түріне сай шаблонды таңдап, деректерді толтырыңыз.',
                                        'Выберите подходящий шаблон и заполните данные.'
                                    ),
                                },
                                {
                                    step: '03',
                                    title: tr('Жіберіңіз', 'Отправьте'),
                                    desc: tr(
                                        'Шақыртуды WhatsApp арқылы барлық қонақтарға жіберіңіз.',
                                        'Отправьте приглашение всем гостям в WhatsApp.'
                                    ),
                                },
                            ].map((s) => (
                                <div key={s.step} style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            fontFamily: 'Unbounded, sans-serif',
                                            fontSize: '3rem',
                                            fontWeight: 700,
                                            color: '#10b981',
                                            marginBottom: '1rem',
                                            opacity: 0.35,
                                        }}
                                    >
                                        {s.step}
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '1.125rem',
                                            color: 'white',
                                            marginBottom: '0.75rem',
                                        }}
                                    >
                                        {s.title}
                                    </div>
                                    <div style={{ color: '#a7f3d0', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        {s.desc}
                                    </div>
                                </div>
                            ))}
                        </div>

                       <Button
    variant="secondary"
    href={registerPath}
                            style={{ marginTop: '3.5rem', padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}
                        >
                            {tr('Қазір бастау', 'Начать сейчас')}
                        </Button>
                    </div>
                </section>
            </div>

            <style>{`
                .home-page { overflow-x: hidden; }

                @media (max-width: 900px) {
                    .home-hero {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                        padding-top: 6rem !important;
                    }

                    .home-features-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }

                    .home-categories-grid,
                    .home-steps-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 640px) {
                    .home-features-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default Home;
