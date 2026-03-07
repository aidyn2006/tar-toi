import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import Button from '../components/Button';

const blogPosts = [
    {
        id: 1,
        title: { kk: 'Электронды шақыртудың артықшылықтары', ru: 'Преимущества электронных пригласительных' },
        desc: { kk: 'Неліктен қазіргі уақытта қағаз шақыртудан гөрі онлайн формат тиімді?', ru: 'Почему онлайн формат сейчас эффективнее бумажных приглашений?' },
        date: '20.03.2024',
        image: '🎨'
    },
    {
        id: 2,
        title: { kk: 'Тойды қалай дұрыс жоспарлау керек?', ru: 'Как правильно спланировать той?' },
        desc: { kk: 'Дайындықты неден бастау керек және қонақтарды қалай таң қалдыруға болады?', ru: 'С чего начать подготовку и как удивить гостей?' },
        date: '18.03.2024',
        image: '📅'
    },
    {
        id: 3,
        title: { kk: 'Жаңа 2024 жылғы үйлену тойы трендтері', ru: 'Новые свадебные тренды 2024 года' },
        desc: { kk: 'Биылғы той бизнесіндегі ең танымал стильдер мен түстер.', ru: 'Самые популярные стили и цвета в свадебном бизнесе в этом году.' },
        date: '15.03.2024',
        image: '🔝'
    }
];

const BlogPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <Layout>
            <SEO
                title={tr('Блог', 'Блог')}
                description={tr('Той бизнесі, шақыртулар және мерекелер туралы қызықты мақалалар.', 'Интересные статьи о свадебном бизнесе, пригласительных и праздниках.')}
                canonical="/blog"
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1.5rem' }}>
                        {tr('Біздің блог', 'Наш блог')}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.7 }}>
                        {tr(
                            'Той дайындығы, шақыртулар стилі және мерекелерді ұйымдастыру туралы пайдалы кеңестер мен мақалалар.',
                            'Полезные советы и статьи о подготовке к тою, стилях пригласительных и организации праздников.'
                        )}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {blogPosts.map(post => (
                        <div key={post.id} style={{
                            background: 'white', borderRadius: '2rem', overflow: 'hidden',
                            border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.3s ease',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{
                                height: '200px', background: '#ecfdf5', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '5rem'
                            }}>{post.image}</div>
                            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.75rem' }}>{post.date}</div>
                                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#064e3b', marginBottom: '1rem', lineHeight: 1.4 }}>
                                    {tr(post.title.kk, post.title.ru)}
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                    {tr(post.desc.kk, post.desc.ru)}
                                </p>
                                <div style={{ marginTop: 'auto' }}>
                                    <Button variant="outline" style={{ width: '100%' }}>
                                        {tr('Толығырақ', 'Подробнее')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default BlogPage;
