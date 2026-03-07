import React from 'react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useLang } from '../context/LanguageContext';

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
    const [open, setOpen] = React.useState(false);
    return (
        <div onClick={() => setOpen(!open)} style={{
            padding: '1.5rem 1.75rem', borderRadius: '1.25rem', cursor: 'pointer',
            background: open ? '#ecfdf5' : 'white',
            border: `1.5px solid ${open ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.1)'}`,
            transition: 'all 0.25s ease', marginBottom: '0.75rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#064e3b', lineHeight: 1.5 }}>{question}</div>
                <div style={{
                    width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                    background: open ? '#10b981' : '#f1f5f9', color: open ? 'white' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 700, transition: 'all 0.25s ease',
                    transform: open ? 'rotate(45deg)' : 'none'
                }}>+</div>
            </div>
            {open && (
                <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQPage = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <Layout>
            <SEO
                title={tr('Жиі қойылатын сұрақтар', 'Часто задаваемые вопросы')}
                description={tr('Тойға онлайн шақырту жасау туралы жиі қойылатын сұрақтар мен жауаптар. Қалай жасау керек? Бұл тегін бе? Жауаптар осында.', 'Частые вопросы и ответы о создании онлайн-приглашений на той. Как создать? Это бесплатно? Ответы здесь.')}
                keywords={tr('сұрақ-жауап, шақырту жасау көмек, faq қазақша, той көмек', 'вопросы и ответы, как создать приглашение, помощь по сервису, faq пригласительные')}
                canonical="/faq"
                schemaData={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqItems.map(item => ({
                        "@type": "Question",
                        "name": tr(item.q.kk, item.q.ru),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": tr(item.a.kk, item.a.ru)
                        }
                    }))
                }}
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
        </Layout>
    );
};

export default FAQPage;
