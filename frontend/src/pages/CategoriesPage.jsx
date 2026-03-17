import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import Button from '../components/Button';
import { categories } from '../config/categories';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const handleSelectCategory = (categoryId) => {
        const params = new URLSearchParams({
            category: categoryId,
        });

        navigate(`/invite/new?${params.toString()}`);
    };

    return (
        <Layout>
            <SEO
                title={tr('Шақырту үлгілері', 'Шаблоны пригласительных')}
                description={tr(
                    'Тойдың барлық түрлеріне арналған заманауи онлайн шақырту үлгілері.',
                    'Современные шаблоны онлайн-пригласительных для всех видов торжеств.'
                )}
                canonical="/categories"
            />

            <section
                style={{
                    paddingTop: '8rem',
                    paddingBottom: '5rem',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    maxWidth: '72rem',
                    margin: '0 auto',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1
                        style={{
                            fontFamily: 'Unbounded, sans-serif',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            color: '#064e3b',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {tr('Шақырту үлгілері', 'Шаблоны пригласительных')}
                    </h1>

                    <p
                        style={{
                            color: '#64748b',
                            fontSize: '1.125rem',
                            maxWidth: '40rem',
                            margin: '0 auto',
                            lineHeight: 1.7,
                        }}
                    >
                        {tr(
                            'Төмендегі санаттардың бірін таңдап, өзіңізге ұнайтын дизайнды табыңыз. Әр категорияда бірнеше стильді нұсқалар бар.',
                            'Выберите одну из категорий ниже и найдите подходящий дизайн. В каждой категории доступно несколько стильных вариантов.'
                        )}
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            style={{
                                padding: '2.5rem',
                                borderRadius: '2rem',
                                background: cat.bg,
                                border: '1px solid rgba(16,185,129,0.1)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                                {cat.icon}
                            </div>

                            <h2
                                style={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    color: '#064e3b',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                {tr(cat.title.kk, cat.title.ru)}
                            </h2>

                            <p
                                style={{
                                    color: '#059669',
                                    fontWeight: 700,
                                    marginBottom: '2rem',
                                }}
                            >
                                {cat.count} {tr('дайын үлгі', 'готовых шаблонов')}
                            </p>

                            <Button
                                onClick={() => handleSelectCategory(cat.id)}
                                style={{ width: '100%', height: '3.5rem' }}
                            >
                                {tr('Үлгілерді көру', 'Смотреть шаблоны')}
                            </Button>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: '5rem',
                        padding: '3rem',
                        borderRadius: '2rem',
                        background: 'white',
                        border: '1px solid rgba(16,185,129,0.1)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'Unbounded, sans-serif',
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: '#064e3b',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {tr('Неге біздің шаблондарды таңдайды?', 'Почему выбирают наши шаблоны?')}
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '2rem',
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    fontWeight: 700,
                                    color: '#10b981',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                {tr('Заманауи дизайн', 'Современный дизайн')}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {tr(
                                    'Әрбір шаблон кәсіби дизайнерлермен жасалған.',
                                    'Каждый шаблон разработан профессиональными дизайнерами.'
                                )}
                            </p>
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontWeight: 700,
                                    color: '#10b981',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                {tr('Толық реттеу', 'Полная настройка')}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {tr(
                                    'Мәтінді, фотоны және музыканы оңай өзгерте аласыз.',
                                    'Вы можете легко менять текст, фото и музыку.'
                                )}
                            </p>
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontWeight: 700,
                                    color: '#10b981',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                {tr('Мобильді нұсқа', 'Мобильная версия')}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {tr(
                                    'Барлық шақыртулар смартфондарда керемет көрінеді.',
                                    'Все приглашения отлично смотрятся на смартфонах.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CategoriesPage;