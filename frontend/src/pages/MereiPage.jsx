import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import Button from '../components/Button';

const MereiPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <Layout>
            <SEO
                title={tr('Мерейтойға онлайн шақырту жасау (50, 60, 70 жас)', 'Создать онлайн приглашение на юбилей (50, 60, 70 лет)')}
                description={tr(
                    'Мерейтойға әдемі электронды шақыртулар жасаңыз. 50, 60, 70, 80 жасқа арналған тегін шаблондар. WhatsApp арқылы жіберу және қонақтарды тіркеу.',
                    'Создайте красивые электронные приглашения на юбилей. Бесплатные шаблоны на 50, 60, 70, 80 лет. Отправка через WhatsApp и регистрация гостей.'
                )}
                keywords={tr('мерекелік шақырту, 50 жас шақырту, 60 жас той, мерейтой шаблоны қазақша', 'пригласительные на юбилей, приглашение 50 лет, 60 лет той, шаблоны на юбилей Казахстан')}
                canonical="/meretoi-shakyru"
                schemaData={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": tr("Мерейтойға шақырту жасау", "Создание приглашений на юбилей"),
                    "description": tr("Мерейтойға арналған арнайы бет", "Специальная страница для юбилеев")
                }}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            {tr('Мерейтойға арналған электронды шақыртулар', 'Электронные приглашения на юбилей')}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                            {tr(
                                '50, 60, 70 немесе 80 жас мерейтойына қонақтарды заманауи түрде шақырыңыз. Біздің сервис арқылы 3 минутта әдемі онлайн шақырту жасап, WhatsApp арқылы жібере аласыз.',
                                'Пригласите гостей на юбилей 50, 60, 70 или 80 лет в современном формате. С нашим сервисом вы за 3 минуты создадите красивое онлайн-приглашение и сможете отправить его через WhatsApp.'
                            )}
                        </p>

                        <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '2rem' }}>
                            <h3 style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.75rem' }}>{tr('Неге электронды шақырту тиімді?', 'Почему электронное приглашение лучше?')}</h3>
                            <ul style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem', listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>✓ {tr('Қағаз шақырту шығындарын үнемдейсіз', 'Экономия на печати бумажных пригласительных')}</li>
                                <li style={{ marginBottom: '0.5rem' }}>✓ {tr('Қонақтардың келуін нақты білесіз (RSVP)', 'Точно знаете количество гостей (RSVP)')}</li>
                                <li style={{ marginBottom: '0.5rem' }}>✓ {tr('Карта (Location) арқылы мейрамхананы табу оңай', 'Удобная карта для поиска ресторана')}</li>
                            </ul>
                        </div>

                        <Button onClick={() => window.location.href = '/#register'} style={{ padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.1rem' }}>
                            {tr('Тегін шақырту жасау', 'Создать бесплатно')}
                        </Button>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100%', aspectRatio: '3/4', background: 'linear-gradient(135deg, #10b981, #064e3b)',
                            borderRadius: '2.5rem', boxShadow: '0 24px 64px rgba(16,185,129,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '8rem' }}>🎂</span>
                        </div>
                        {/* Decorative elements */}
                        <div style={{ position: 'absolute', top: '-1.5rem', right: '-1.5rem', width: '6rem', height: '6rem', background: '#f59e0b', borderRadius: '50%', opacity: 0.2, filter: 'blur(10px)' }}></div>
                        <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '8rem', height: '8rem', background: '#10b981', borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)' }}></div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MereiPage;
