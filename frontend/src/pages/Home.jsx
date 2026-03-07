import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useLang } from '../context/LanguageContext';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';

const categories = [
    { id: 'uzatu', title: { kk: 'Ұзату', ru: 'Проводы невесты' }, icon: '✨', count: 4, bg: '#f0fdf4' },
    { id: 'wedding', title: { kk: 'Үйлену тойы', ru: 'Свадьба' }, icon: '💍', count: 9, bg: '#fffbeb' },
    { id: 'sundet', title: { kk: 'Сүндет той', ru: 'Сүндет той' }, icon: '👦', count: 3, bg: '#f0fdf4' },
    { id: 'tusau', title: { kk: 'Тұсаукесер', ru: 'Тұсаукесер' }, icon: '👣', count: 4, bg: '#fffbeb' },
    { id: 'merei', title: { kk: 'Мерейтой', ru: 'Юбилей' }, icon: '🎂', count: 3, bg: '#f0fdf4' },
    { id: 'besik', title: { kk: 'Бесік той', ru: 'Бесік той' }, icon: '👶', count: 3, bg: '#fffbeb' },
];

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
        title: { kk: '30+ үлгі', ru: '30+ шаблонов' },
        desc: {
            kk: 'Барлық той түрлеріне арналған 30-дан астам дайын шаблон.',
            ru: 'Более 30 готовых шаблонов для всех типов торжеств.',
        },
    },
];

const Home = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <Layout>
            <SEO
                description={tr(
                    'Toiga Shaqyru — Тойға, ұзатуға, сүндетке онлайн шақырту жасаңыз. 30+ дайын шаблон. WhatsApp арқылы жіберу, қонақтардың жауабын бақылау.',
                    'Toiga Shaqyru — создайте онлайн-приглашение на свадьбу, узату, сундет той. 30+ готовых шаблонов. Отправка через WhatsApp, контроль ответов гостей.'
                )}
                keywords={tr(
                    'тойға шақыру, онлайн шақырту, үйлену тойына шақыру, ұзату тойына шақыру, сүндет тойға шақыру, электронды шақырту, онлайн пригласительные, приглашение на свадьбу, узату той, сундет той, пригласительные казахстан',
                    'приглашение на свадьбу, онлайн пригласительные, электронные приглашения, узату той, сундет той, тойға шақыру, онлайн шақырту, пригласительные алматы, пригласительные астана'
                )}
                canonical="/"
                schemaData={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Toiga Shaqyru",
                    "operatingSystem": "Web",
                    "applicationCategory": "DesignApplication",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "KZT"
                    },
                    "description": tr(
                        "Тойға арналған онлайн шақыртулар жасау сервисі.",
                        "Сервис для создания онлайн пригласительных на мероприятия."
                    ),
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "ratingCount": "120"
                    }
                }}
            />

            <div className="home-page" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {/* ── HERO ─────────────────────────────────────────── */}
                <section className="home-hero" style={{ paddingTop: '7.5rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {tr('✨ Жаңа мүмкіндіктер қосылды', '✨ Добавили новые функции')}
                        </div>
                        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', color: '#064e3b' }}>
                            {tr('Онлайн шақырту жасаңыз –', 'Создайте онлайн-приглашение —')}{' '}
                            <span style={{ color: '#10b981' }}>{tr('тойға дайындықты жеңілдетіңіз.', 'сделайте подготовку проще.')}</span>
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '34rem' }}>
                            {tr(
                                'Тіркеліп, шаблонды таңдаңыз, мәтінді қосып, шақыртуды WhatsApp арқылы жіберіңіз.',
                                'Зарегистрируйтесь, выберите шаблон, добавьте текст и отправьте приглашение в WhatsApp.'
                            )}
                        </p>
                        <div className="home-hero-cta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                            <Button onClick={() => window.location.href = '/#register'} style={{ padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}>
                                {tr('Тегін бастау', 'Начать бесплатно')}
                            </Button>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>5000 ₸</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{tr('Тегін', 'Бесплатно')}</div>
                            </div>
                        </div>
                        <div className="home-hero-points" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {[
                                tr('3 мин тіркелу', 'Регистрация за 3 мин'),
                                tr('Фото мен музыка', 'Фото и музыка'),
                                tr('WhatsApp жіберу', 'Отправка в WhatsApp'),
                                tr('Жауаптарды бақылау', 'Контроль ответов')
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#054535', fontWeight: 600, fontSize: '0.9rem' }}>
                                    <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✓</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* category cards preview */}
                    <div className="home-hero-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {categories.map(cat => (
                            <Link key={cat.id} to="/categories" style={{
                                padding: '1.75rem', borderRadius: '1.75rem', background: cat.bg, cursor: 'pointer',
                                border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.25s ease',
                                textDecoration: 'none'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#064e3b', marginBottom: '0.25rem' }}>{tr(cat.title.kk, cat.title.ru)}</div>
                                <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>{cat.count} {tr('үлгі', 'шаблон')}</div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── FEATURES ─────────────────────────────────────── */}
                <section id="features" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                                {tr('🚀 Неге бізді таңдайды?', '🚀 Почему выбирают нас?')}
                            </div>
                            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                                {tr('Барлығы бір жерде', 'Всё в одном месте')}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '30rem', margin: '0 auto' }}>
                                {tr('Шақырту жасаудан бастап, жауаптарды бақылауға дейін.', 'От создания пригласительного до сбора ответов.')}
                            </p>
                        </div>
                        <div className="home-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            {features.map((f, i) => (
                                <div key={i} style={{ padding: '2rem 1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(16,185,129,0.1)', background: '#f8fffe', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#064e3b', marginBottom: '0.5rem' }}>{tr(f.title.kk, f.title.ru)}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{tr(f.desc.kk, f.desc.ru)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CATEGORIES PREVIEW ───────────────────────────── */}
                <section id="categories" style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                                {tr('Барлық той түрлері', 'Все виды торжеств')}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>{tr('30-дан астам дайын шаблон', 'Более 30 готовых шаблонов')}</p>
                        </div>
                        <div className="home-categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                            {categories.map(cat => (
                                <Link key={cat.id} to="/categories" style={{
                                    padding: '2rem', borderRadius: '2rem', background: cat.bg, cursor: 'pointer',
                                    border: '1px solid rgba(16,185,129,0.08)', transition: 'all 0.25s ease',
                                    display: 'flex', alignItems: 'center', gap: '1.25rem', textDecoration: 'none'
                                }}>
                                    <div style={{ fontSize: '3rem', flexShrink: 0 }}>{cat.icon}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#064e3b', marginBottom: '0.25rem' }}>{tr(cat.title.kk, cat.title.ru)}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>{cat.count} {tr('үлгі қолжетімді', 'шаблонов доступно')}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                            <Button onClick={() => window.location.href = '/categories'} style={{ padding: '1rem 2.5rem', height: '3.25rem', fontSize: '1rem' }}>
                                {tr('Барлық үлгілерді қарау', 'Посмотреть все шаблоны')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ── SEO CONTENT SECTION ──────────────────────────── */}
                <section style={{ padding: '5rem 1.5rem', background: '#f8fffe' }}>
                    <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                            <div>
                                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', color: '#064e3b', marginBottom: '1rem' }}>
                                    {tr('Тойға шақыру жасау — енді оңай', 'Создание пригласительных на той — теперь проще')}
                                </h2>
                                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.8 }}>
                                    {tr(
                                        'Toiga Shaqyru — бұл қазіргі заманғы электронды шақыртулар жасауға арналған платформа. Біздің сервис арқылы сіз үйлену тойына, ұзату тойына, сүндет тойға немесе мерейтойға арналған бірегей онлайн шақыртуларды небәрі 3 минутта дайындай аласыз. Дайын шаблондарды қолдана отырып, фотосуреттер мен музыка қосып, қонақтарға WhatsApp арқылы жіберуге болады.',
                                        'Toiga Shaqyru — это современная платформа для создания электронных пригласительных. С помощью нашего сервиса вы можете за 3 минуты подготовить уникальные онлайн приглашения на свадьбу, узату, сундет той или юбилей. Используйте готовые шаблоны, добавляйте фото и музыку, и отправляйте гостям через WhatsApp.'
                                    )}
                                </p>
                            </div>
                            <div>
                                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', color: '#064e3b', marginBottom: '1rem' }}>
                                    {tr('Электронды шақыртудың артықшылықтары', 'Преимущества электронных приглашений')}
                                </h2>
                                <ul style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                                    <li>{tr('Қонақтардың келуін онлайн бақылау (RSVP)', 'Онлайн контроль посещаемости гостей (RSVP)')}</li>
                                    <li>{tr('Интерактивті карта мен навигация', 'Интерактивная карта и навигация')}</li>
                                    <li>{tr('Кез келген құрылғыға бейімделген дизайн', 'Адаптивный дизайн для любых устройств')}</li>
                                    <li>{tr('Қағаз шақыртуларға қарағанда тиімді әрі жылдам', 'Экономичнее и быстрее бумажных пригласительных')}</li>
                                </ul>
                            </div>
                        </div>
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                {tr(
                                    'Кілт сөздер: тойға шақыру, онлайн шақырту, үйлену тойы, ұзату той, сүндет той, бесік той, мерейтой, электронды шақырту қазақша.',
                                    'Ключевые слова: пригласительные на свадьбу, онлайн пригласительные, узату той, сундет той, электронные приглашения Алматы, Астана, Казахстан.'
                                )}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .home-page { overflow-x: hidden; }
                @media (max-width: 900px) {
                    .home-hero { grid-template-columns: 1fr !important; gap: 2rem !important; padding-top: 6rem !important; }
                    .home-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .home-categories-grid, .home-steps-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 640px) {
                    .home-features-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </Layout>
    );
};

export default Home;
