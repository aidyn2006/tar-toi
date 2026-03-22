import { MessageCircle, Instagram, Phone } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, getPublicSeoConfig } from '../seo/publicRoutes';

const ContactPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.contact);
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
                    name: tr('Байланыс', 'Контакты'),
                    item: `https://toi.com.kz${seo.canonical}`,
                },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: lang === 'ru' ? 'Контакты Toiga Shaqyru' : 'Toiga Shaqyru байланыс беті',
            url: `https://toi.com.kz${seo.canonical}`,
        },
    ];

    return (
        <Layout>
            <SEO
                title={tr('Байланыс', 'Контакты')}
                description={tr(
                    'Сұрақтарыңыз болса, бізбен байланысыңыз. WhatsApp, Instagram және телефон арқылы жауап береміз.',
                    'Свяжитесь с нами через WhatsApp, Instagram или по телефону, если у вас есть вопросы по сервису.'
                )}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1.5rem' }}>
                        {tr('Бізбен байланысыңыз', 'Свяжитесь с нами')}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.7 }}>
                        {tr(
                            'Онлайн шақырту сервисі туралы сұрағыңыз болса немесе коммерциялық ұсыныс талқылағыңыз келсе, төмендегі байланыс арналарының бірін пайдаланыңыз.',
                            'Если у вас есть вопросы по сервису онлайн-приглашений или вы хотите обсудить сотрудничество, используйте один из каналов связи ниже.'
                        )}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <a href="https://wa.me/77056842747" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '3rem', borderRadius: '2rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center', transition: 'all 0.3s ease' }}>
                            <MessageCircle size={48} color="#25D366" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>WhatsApp</h2>
                            <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 700 }}>+7 705 684 27 47</div>
                        </div>
                    </a>

                    <a href="https://instagram.com/codejaz.kz" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '3rem', borderRadius: '2rem', background: '#fffbeb', border: '1px solid rgba(251,191,36,0.2)', textAlign: 'center', transition: 'all 0.3s ease' }}>
                            <Instagram size={48} color="#e1306c" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>Instagram</h2>
                            <div style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: 700 }}>@codejaz.kz</div>
                        </div>
                    </a>

                    <a href="tel:+77056842747" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '3rem', borderRadius: '2rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center', transition: 'all 0.3s ease' }}>
                            <Phone size={48} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>{tr('Телефон', 'Телефон')}</h2>
                            <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 700 }}>+7 705 684 27 47</div>
                        </div>
                    </a>
                </div>
            </section>
        </Layout>
    );
};

export default ContactPage;
