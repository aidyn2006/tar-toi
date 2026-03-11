import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import { useLang } from '../../context/LanguageContext';

const PrivacyPolicyPage = () => {
    const { lang } = useLang();
    
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fffe' }}>
            <SEO 
                title={lang === 'ru' ? "Политика конфиденциальности - Toi" : "Құпиялылық саясаты - Toi"}
                description={lang === 'ru' ? "Политика конфиденциальности сервиса электронных пригласительных Toi" : "Toi электронды шақыру сервисінің құпиялылық саясаты"}
            />
            <Navbar />
            
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{
                    maxWidth: '800px', margin: '0 auto', background: 'white', 
                    borderRadius: '1.5rem', padding: '3rem',
                    boxShadow: '0 20px 40px rgba(16,185,129,0.05)',
                    fontFamily: "'Manrope', sans-serif", color: '#334155'
                }}>
                    <h1 style={{ 
                        fontFamily: 'Unbounded, sans-serif', fontSize: '2rem', 
                        fontWeight: 700, color: '#064e3b', marginBottom: '2rem', textAlign: 'center' 
                    }}>
                        {lang === 'ru' ? 'Политика конфиденциальности' : 'Құпиялылық саясаты'}
                    </h1>
                    
                    {lang === 'ru' ? (
                        <div style={{ lineHeight: '1.7' }}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Настоящая Политика конфиденциальности описывает, как сервис электронных пригласительных Toi собирает, использует и защищает вашу личную информацию.
                            </p>
                            
                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>1. Сбор информации</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Мы собираем информацию, которую вы предоставляете нам напрямую при регистрации, создании приглашений и использовании нашего сервиса. Это может включать: имя, номер телефона, адреса электронных почт и другие данные.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>2. Использование информации</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Собранная информация используется для:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                                <li>Предоставления, поддержки и улучшения наших услуг.</li>
                                <li>Персонализации вашего пользовательского опыта.</li>
                                <li>Обработки транзакций и отправки соответствующих уведомлений.</li>
                                <li>Связи с вами, включая поддержку клиентов.</li>
                            </ul>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>3. Защита данных</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Мы принимаем разумные меры для защиты вашей личной информации от несанкционированного доступа, использования или раскрытия. Однако ни один метод передачи данных через Интернет не является 100% безопасным.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>4. Изменения в политике</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Мы можем время от времени обновлять нашу Политику конфиденциальности. Мы уведомим вас о любых изменениях, опубликовав новую политику на этой странице.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>5. Контакты</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Если у вас есть вопросы касательно данной Политики конфиденциальности, пожалуйста, свяжитесь с нами.
                            </p>
                        </div>
                    ) : (
                        <div style={{ lineHeight: '1.7' }}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Осы Құпиялылық саясаты Toi электронды шақыру сервисі сіздің жеке ақпаратыңызды қалай жинайтынын, қолданатынын және қорғайтынын сипаттайды.
                            </p>
                            
                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>1. Ақпаратты жинау</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Біз тіркелу, шақыру жасау және біздің сервисті қолдану кезінде тікелей ұсынатын ақпаратты жинаймыз. Бұған: аты-жөні, телефон нөмірі, электрондық пошта мекенжайлары және басқа да мәліметтер кіруі мүмкін.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>2. Ақпаратты пайдалану</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Жиналған ақпарат келесі мақсаттарда қолданылады:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                                <li>Біздің қызметтерімізді ұсыну, қолдау және жақсарту.</li>
                                <li>Пайдаланушы тәжірибеңізді жекелендіру.</li>
                                <li>Транзакцияларды өңдеу және тиісті хабарламаларды жіберу.</li>
                                <li>Сізбен байланысу, соның ішінде тұтынушыларды қолдау.</li>
                            </ul>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>3. Деректерді қорғау</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Біз жеке ақпаратыңызды рұқсатсыз қол жеткізуден, пайдаланудан немесе ашудан қорғау үшін тиісті шаралар қабылдаймыз. Алайда, Интернет арқылы деректерді берудің ешқандай әдісі 100% қауіпсіз емес.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>4. Саясаттағы өзгерістер</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Біз оқтын-оқтын Құпиялылық саясатымызды жаңартып отырамыз. Біз кез келген өзгерістер туралы осы бетте жаңа саясатты жариялау арқылы хабарлайтын боламыз.
                            </p>

                            <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>5. Байланыс</h2>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Осы Құпиялылық саясатына қатысты сұрақтарыңыз болса, бізбен байланысыңыз.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
