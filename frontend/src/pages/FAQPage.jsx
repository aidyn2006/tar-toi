import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, getPublicSeoConfig } from '../seo/publicRoutes';

const faqItems = [
    {
        q: { kk: 'Шақырту қалай жасалады?', ru: 'Как создать приглашение?' },
        a: { kk: 'Тіркеліп, шаблонды таңдаңыз, мәтін мен суреттерді қосыңыз. 3 минутта дайын шақырту жасай аласыз.', ru: 'Зарегистрируйтесь, выберите шаблон, добавьте текст и фото. Создание занимает всего 3 минуты.' },
    },
    {
        q: { kk: 'Бұл тегін бе?', ru: 'Это бесплатно?' },
        a: { kk: 'Иә! Қазіргі уақытта барлық мүмкіндіктер толығымен тегін. Тіркеліп, бірден бастаңыз.', ru: 'Да! Сейчас все функции полностью бесплатны. Зарегистрируйтесь и начните прямо сейчас.' },
    },
    {
        q: { kk: 'Қанша қонақ шақыруға болады?', ru: 'Сколько гостей можно пригласить?' },
        a: { kk: 'Шектеу жоқ. Қалағаныңызша қонақ шақыра аласыз және олардың жауаптарын бақылай аласыз.', ru: 'Без ограничений. Приглашайте сколько угодно гостей и отслеживайте их ответы.' },
    },
    {
        q: { kk: 'WhatsApp арқылы қалай жіберемін?', ru: 'Как отправить через WhatsApp?' },
        a: { kk: 'Шақырту дайын болғанда, "Жіберу" батырмасын басыңыз. Сілтеме автоматты түрде WhatsApp-қа жіберіледі.', ru: 'Когда приглашение готово, нажмите кнопку "Отправить". Ссылка автоматически отправится в WhatsApp.' },
    },
    {
        q: { kk: 'Шаблонды өзгертуге бола ма?', ru: 'Можно ли изменить шаблон?' },
        a: { kk: 'Иә, мәтінді, суреттерді, музыканы және басқа деректерді өзіңіз реттей аласыз.', ru: 'Да, вы можете настроить текст, фотографии, музыку и другие данные по своему вкусу.' },
    },
    {
        q: { kk: 'Деректерім қауіпсіз бе?', ru: 'Мои данные в безопасности?' },
        a: { kk: 'Иә, біз деректеріңізді қауіпсіз сақтаймыз. Сіздің ақпаратыңыз үшінші тарапқа берілмейді.', ru: 'Да, мы надёжно храним ваши данные. Ваша информация не передаётся третьим лицам.' },
    },
];

const FaqItem = ({ question, answer }) => {
    return (
        <details style={{
            padding: '1.5rem 1.75rem',
            borderRadius: '1.25rem',
            background: 'white',
            border: '1.5px solid rgba(16,185,129,0.1)',
            transition: 'all 0.25s ease',
            marginBottom: '0.75rem'
        }}>
            <summary style={{
                listStyle: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#064e3b', lineHeight: 1.5 }}>{question}</span>
                <span style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: '#f1f5f9',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700
                }}>+</span>
            </summary>
            <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {answer}
            </div>
        </details>
    );
};

const FAQPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const seo = getPublicSeoConfig(lang, PUBLIC_ROUTE_KEYS.faq);
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
                    name: 'FAQ',
                    item: `https://toi.com.kz${seo.canonical}`,
                },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: tr(item.q.kk, item.q.ru),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: tr(item.a.kk, item.a.ru),
                },
            })),
        },
    ];

    return (
        <Layout>
            <SEO
                title="FAQ"
                description={tr('Тойға онлайн шақырту жасау туралы жиі қойылатын сұрақтар мен жауаптар.', 'Частые вопросы и ответы о создании онлайн-приглашений на той.')}
                canonical={seo.canonical}
                locale={seo.locale}
                alternates={seo.alternates}
                jsonLd={jsonLd}
            />

            <section style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1.5rem' }}>
                        {tr('Жиі қойылатын сұрақтар', 'Часто задаваемые вопросы')}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem', lineHeight: 1.7 }}>
                        {tr(
                            'Сервисті пайдалану кезінде туындаған сұрақтарға осы жерден жауап таба аласыз.',
                            'Здесь вы найдете ответы на вопросы, возникающие при использовании нашего сервиса.'
                        )}
                    </p>
                </div>

                <div>
                    {faqItems.map((item, i) => (
                        <FaqItem key={i} question={tr(item.q.kk, item.q.ru)} answer={tr(item.a.kk, item.a.ru)} />
                    ))}
                </div>
            </section>
            <style>{`
                details[open] {
                    background: #ecfdf5 !important;
                    border-color: rgba(16,185,129,0.3) !important;
                }

                details summary::-webkit-details-marker {
                    display: none;
                }
            `}</style>
        </Layout>
    );
};

export default FAQPage;
