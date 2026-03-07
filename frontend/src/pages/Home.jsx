import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { authService } from '../api/authService';
import { Phone, Lock, User, ArrowRight, X, Instagram, MessageCircle } from 'lucide-react';
import LanguageSwitch from '../components/LanguageSwitch';
import { useLang } from '../context/LanguageContext';

/* ─── Phone format helpers ────────────────────────────── */
// Keeps only up to 10 digits and formats them as: XXX XXX XX XX
const formatLocal = (digits) => {
    const d = digits.slice(0, 10);
    let out = d.slice(0, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += ' ' + d.slice(6, 8);
    if (d.length > 8) out += ' ' + d.slice(8, 10);
    return out;
};

// Called on every keystroke in the phone input - only formats, no live errors
const handlePhoneChange = (rawValue, setPhone) => {
    const digits = rawValue.replace(/\D/g, '');
    const formatted = formatLocal(digits);
    setPhone(formatted);
};

// Returns +7XXXXXXXXXX for API
const toApiPhone = (display) => '+7' + display.replace(/\D/g, '');

/* ─── validation ──────────────────────────────────────── */
const validatePhone = (display, tr) => {
    const digits = display.replace(/\D/g, '');
    if (!digits) return tr('Телефон нөмірін енгізіңіз', 'Введите номер телефона');
    if (digits.length < 10) return tr(`Нөмір толық емес (${digits.length}/10 сан)`, `Номер неполный (${digits.length}/10 цифр)`);
    return '';
};
const validatePassword = (v, tr) => {
    if (!v) return tr('Құпиясөзді енгізіңіз', 'Введите пароль');
    if (v.length < 6) return tr('Құпиясөз кемінде 6 символ болуы керек', 'Пароль должен быть не короче 6 символов');
    return '';
};
const validateName = (v, tr) => {
    if (!v.trim()) return tr('Атыңызды енгізіңіз', 'Введите имя');
    if (v.trim().length < 2) return tr('Аты-жөніңіз тым қысқа', 'Слишком короткое имя');
    return '';
};

/* ─── Auth Modal ──────────────────────────────────────── */
const AuthModal = ({ onClose, defaultMode = 'login' }) => {
    const [mode, setMode] = useState(defaultMode);
    const [phone, setPhone] = useState('');
    const [phoneErr, setPhoneErr] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const switchMode = (m) => { setMode(m); setErrors({}); setStatus(''); setPhoneErr(''); setConfirmPassword(''); };

    const validate = () => {
        const e = {};
        e.phone = validatePhone(phone, tr);
        e.password = validatePassword(password, tr);
        if (mode === 'register') {
            e.fullName = validateName(fullName, tr);
            if (!confirmPassword) e.confirmPassword = tr('Құпиясөзді қайталаңыз', 'Повторите пароль');
            else if (confirmPassword !== password) e.confirmPassword = tr('Құпиясөздер сәйкес келмейді', 'Пароли не совпадают');
        }
        setErrors(e);
        return !Object.values(e).some(Boolean);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setStatus('');
        if (!validate()) return;
        setLoading(true);
        const apiPhone = toApiPhone(phone);
        try {
            if (mode === 'login') {
                await authService.login({ phone: apiPhone, password });
                onClose();
                navigate('/dashboard');
            } else {
                await authService.register({ phone: apiPhone, fullName, password });
                // Backend now returns tokens immediately, so go straight to dashboard
                onClose();
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || tr('Қате шықты. Қайталап көріңіз.', 'Произошла ошибка. Попробуйте ещё раз.');
            setStatus('error:' + msg);
        } finally {
            setLoading(false);
        }
    };

    const isSuccess = status.startsWith('success:');
    const message = status.replace(/^(success|error):/, '');

    return (
        /* overlay */
        <div className="home-auth-overlay" onClick={!loading && !status ? onClose : undefined} style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(6,78,59,0.3)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            cursor: !loading && !status ? 'pointer' : 'default'
        }}>
            {/* card */}
            <div className="home-auth-modal-card" onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: '2rem', padding: '2.5rem',
                width: '100%', maxWidth: '26rem',
                boxShadow: '0 24px 64px rgba(16,185,129,0.2)',
                border: '1px solid rgba(16,185,129,0.1)',
                position: 'relative', animation: 'modalIn 0.25s ease',
                maxHeight: '90vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch'
            }}>
                {/* close */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '2.25rem', height: '2.25rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                }}><X size={18} /></button>

                {/* logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
                        background: 'linear-gradient(135deg,#10b981,#059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', marginBottom: '1rem',
                        boxShadow: '0 6px 20px rgba(16,185,129,0.3)'
                    }}>🌿</div>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#064e3b', textAlign: 'center', marginBottom: '0.25rem' }}>
                        {mode === 'login' ? tr('Қош келдіңіз', 'Добро пожаловать') : tr('Тіркелу', 'Регистрация')}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
                        {mode === 'login' ? tr('Аккаунтыңызға кіріңіз', 'Войдите в аккаунт') : tr('Жаңа аккаунт ашыңыз', 'Создайте новый аккаунт')}
                    </p>
                </div>

                {/* tabs */}
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '0.875rem', padding: '0.25rem', marginBottom: '1.75rem' }}>
                    {['login', 'register'].map(m => (
                        <button key={m} onClick={() => { setMode(m); setErrors({}); setStatus(''); }}
                            style={{
                                flex: 1, padding: '0.625rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
                                fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                                background: mode === m ? 'white' : 'transparent',
                                color: mode === m ? '#10b981' : '#64748b',
                                boxShadow: mode === m ? '0 1px 6px rgba(0,0,0,0.08)' : 'none'
                            }}>
                            {m === 'login' ? tr('Кіру', 'Вход') : tr('Тіркелу', 'Регистрация')}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <Input label={tr('Аты-жөніңіз', 'Атыңыз')} icon={User} placeholder={tr('Айдын Бекенов', 'Айдын Бекенов')}
                            value={fullName}
                            onChange={e => { setFullName(e.target.value); setErrors(er => ({ ...er, fullName: '' })); }}
                            error={errors.fullName} />
                    )}

                    {/* Phone with +7 prefix */}
                    <div className="form-group">
                        <label className="form-label">{tr('Телефон нөмірі', 'Номер телефона')}</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0 1rem', background: '#ecfdf5', border: '1.5px solid rgba(16,185,129,0.25)',
                                borderRadius: '0.875rem', fontWeight: 700, color: '#10b981', fontSize: '1rem',
                                whiteSpace: 'nowrap', flexShrink: 0
                            }}>+7</div>
                            <input
                                type="tel"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="700 000 00 00"
                                value={phone}
                                onChange={e => handlePhoneChange(e.target.value, setPhone)}
                                className={`form-input${errors.phone ? ' error' : ''}`}
                                style={{ flex: 1, letterSpacing: '0.05em', fontWeight: 500 }}
                            />
                        </div>
                        {errors.phone &&
                            <span className="form-error">{errors.phone}</span>}
                    </div>

                    <Input label={tr('Құпиясөз', 'Пароль')} icon={Lock} type="password" placeholder="••••••••"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: '' })); }}
                        error={errors.password} />

                    {mode === 'register' && (
                        <Input label={tr('Құпиясөзді растаңыз', 'Повторите пароль')} icon={Lock} type="password" placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value); setErrors(er => ({ ...er, confirmPassword: '' })); }}
                            error={errors.confirmPassword} />
                    )}

                    {status && (
                        <div style={{
                            padding: '0.875rem 1rem', borderRadius: '0.875rem', marginBottom: '1rem',
                            fontSize: '0.9rem', fontWeight: 500,
                            background: isSuccess ? '#ecfdf5' : '#fef2f2',
                            color: isSuccess ? '#065f46' : '#991b1b',
                            border: `1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`
                        }}>{message}</div>
                    )}

                    <Button type="submit" disabled={loading} style={{ width: '100%', height: '3.25rem', fontSize: '1rem' }}>
                        {loading ? tr('Жүктелуде...', 'Загрузка...') : mode === 'login' ? tr('Кіру', 'Вход') : tr('Тіркелу', 'Регистрация')}
                        {!loading && <ArrowRight size={18} />}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {mode === 'login' ? tr('Аккаунт жоқ па?', 'Нет аккаунта?') : tr('Аккаунт бар ма?', 'Уже есть аккаунт?')}{' '}
                    <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                        {mode === 'login' ? tr('Тіркелу', 'Регистрация') : tr('Кіру', 'Вход')}
                    </button>
                </p>
            </div>
            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(10px);} to { opacity:1; transform:scale(1) translateY(0);} }
                @media (max-width: 520px) {
                    .home-auth-overlay {
                        align-items: flex-start !important;
                        padding: 0.75rem !important;
                    }
                    .home-auth-modal-card {
                        padding: 1.5rem !important;
                        border-radius: 1.25rem !important;
                        margin-top: 1.25rem;
                    }
                    .home-auth-modal-card input,
                    .home-auth-modal-card button {
                        font-size: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

/* ─── categories ──────────────────────────────────────── */
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

/* ─── FAQ Accordion Item ─────────────────────────────── */
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

/* ─── Home Page ───────────────────────────────────────── */
const Home = () => {
    const [modal, setModal] = useState(null); // null | 'login' | 'register'
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
        <div className="home-page" style={{ minHeight: '100vh', background: '#f8fffe', fontFamily: "'Manrope', sans-serif" }}>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "toi.com.kz",
                        "url": "https://toi.com.kz",
                        "description": "Онлайн шақырту жасау сервисі — электронные приглашения на той",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+77056842747",
                            "contactType": "customer service",
                            "availableLanguage": ["Kazakh", "Russian"]
                        },
                        "sameAs": [
                            "https://instagram.com/codejaz.kz",
                            "https://wa.me/77056842747"
                        ]
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "toi.com.kz",
                        "url": "https://toi.com.kz",
                        "inLanguage": ["kk", "ru"]
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqItems.map(item => ({
                            "@type": "Question",
                            "name": item.q.kk + ' / ' + item.q.ru,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": item.a.kk + ' ' + item.a.ru
                            }
                        }))
                    }
                ])
            }} />
            {modal && <AuthModal onClose={() => setModal(null)} defaultMode={modal} />}

            {/* ── HEADER ───────────────────────────────────────── */}
            <header className="home-header" style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(248,255,254,0.9)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(16,185,129,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#10b981', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,0.3)', fontSize: '0.875rem' }}>sh</div>
                    <span className="home-logo-text" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#064e3b' }}>Toiga Shaqyru</span>
                </div>
                <nav className="home-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a className="home-nav-link" href="#features" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>{tr('Мүмкіндіктер', 'Возможности')}</a>
                    <a className="home-nav-link" href="#categories" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>{tr('Үлгілер', 'Шаблоны')}</a>
                    <a className="home-nav-link" href="#blog" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>{tr('Блог', 'Блог')}</a>
                    <a className="home-nav-link" href="#faq" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>FAQ</a>
                    <a className="home-nav-link" href="#contact" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>{tr('Байланыс', 'Контакты')}</a>
                    <LanguageSwitch compact />
                    <Button className="home-nav-btn desktop-only" variant="outline" onClick={() => setModal('login')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>{tr('Кіру', 'Войти')}</Button>
                    <Button className="home-nav-btn desktop-only" onClick={() => setModal('register')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>{tr('Тіркелу', 'Регистрация')}</Button>
                </nav>
            </header>

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
                        <Button onClick={() => setModal('register')} style={{ padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}>
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
                        <div key={cat.id} onClick={() => setModal('register')} style={{
                            padding: '1.75rem', borderRadius: '1.75rem', background: cat.bg, cursor: 'pointer',
                            border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.25s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#064e3b', marginBottom: '0.25rem' }}>{tr(cat.title.kk, cat.title.ru)}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>{cat.count} {tr('үлгі', 'шаблон')}</div>
                        </div>
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

            {/* ── CATEGORIES ───────────────────────────────────── */}
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
                            <div key={cat.id} onClick={() => setModal('register')} style={{
                                padding: '2rem', borderRadius: '2rem', background: cat.bg, cursor: 'pointer',
                                border: '1px solid rgba(16,185,129,0.08)', transition: 'all 0.25s ease',
                                display: 'flex', alignItems: 'center', gap: '1.25rem'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={{ fontSize: '3rem', flexShrink: 0 }}>{cat.icon}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#064e3b', marginBottom: '0.25rem' }}>{tr(cat.title.kk, cat.title.ru)}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>{cat.count} {tr('үлгі қолжетімді', 'шаблонов доступно')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Button onClick={() => setModal('register')} style={{ padding: '1rem 2.5rem', height: '3.25rem', fontSize: '1rem' }}>
                            {tr('Барлық үлгілерді қарау', 'Посмотреть все шаблоны')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section style={{ padding: '5rem 1.5rem', background: '#064e3b' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        {tr('Қалай жұмыс жасайды?', 'Как это работает?')}
                    </h2>
                    <p style={{ color: '#a7f3d0', marginBottom: '3.5rem', fontSize: '1.0625rem' }}>{tr('Тек 3 қадам', 'Всего 3 шага')}</p>
                    <div className="home-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                        {[
                            { step: '01', title: tr('Тіркеліңіз', 'Зарегистрируйтесь'), desc: tr('Телефон нөміріңізбен тіркеліп, аккаунт ашыңыз.', 'Зарегистрируйтесь по номеру телефона и создайте аккаунт.') },
                            { step: '02', title: tr('Үлгі таңдаңыз', 'Выберите шаблон'), desc: tr('Той түріне сай шаблонды таңдап, деректерді толтырыңыз.', 'Выберите подходящий шаблон и заполните данные.') },
                            { step: '03', title: tr('Жіберіңіз', 'Отправьте'), desc: tr('Шақыртуды WhatsApp арқылы барлық қонақтарға жіберіңіз.', 'Отправьте приглашение всем гостям в WhatsApp.') },
                        ].map(s => (
                            <div key={s.step} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '3rem', fontWeight: 700, color: '#10b981', marginBottom: '1rem', opacity: 0.35 }}>{s.step}</div>
                                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', marginBottom: '0.75rem' }}>{s.title}</div>
                                <div style={{ color: '#a7f3d0', fontSize: '0.9375rem', lineHeight: 1.6 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={() => setModal('register')} style={{ marginTop: '3.5rem', padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}>
                        {tr('Қазір бастау', 'Начать сейчас')}
                    </Button>
                </div>
            </section>

            {/* ── BLOG ──────────────────────────────────────────── */}
            <section id="blog" style={{ padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                            {tr('📝 Блог', '📝 Блог')}
                        </div>
                        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                            {tr('Пайдалы мақалалар', 'Полезные статьи')}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>
                            {tr('Тойға дайындық туралы кеңестер мен жаңалықтар', 'Советы и новости о подготовке к торжеству')}
                        </p>
                    </div>
                    <div className="home-blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {/* Blog Card 1 */}
                        <article style={{
                            borderRadius: '1.75rem', overflow: 'hidden', background: 'white',
                            border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.25s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16,185,129,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ height: '12rem', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '4rem' }}>🎉</span>
                            </div>
                            <div style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                                    {tr('Тегін', 'Бесплатно')}
                                </div>
                                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                    {tr('🔥 Тегін шақырту шаблондары — ақша төлемей-ақ тойға шақырыңыз!', '🔥 Бесплатные шаблоны приглашений — пригласите всех на той без затрат!')}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    {tr(
                                        'Енді тойға шақырту жасау үшін ақша төлеудің қажеті жоқ! toi.com.kz сервисінде 30-дан астам тегін шаблон бар — ұзату, үйлену тойы, сүндет той, бесік той, мерейтой және тұсаукесер. Шаблонды таңдап, мәтінді жазып, суреттерді қосып, WhatsApp арқылы жіберіңіз. Барлығы тегін, тіркелу — 1 минут!',
                                        'Больше не нужно платить за приглашения на той! На toi.com.kz — более 30 бесплатных шаблонов для узату, свадьбы, сүндет тоя, бесік тоя, юбилея и тұсаукесера. Выберите шаблон, добавьте текст, фото и отправьте через WhatsApp. Всё бесплатно, регистрация — 1 минута!'
                                    )}
                                </p>
                            </div>
                        </article>

                        {/* Blog Card 2 */}
                        <article style={{
                            borderRadius: '1.75rem', overflow: 'hidden', background: 'white',
                            border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.25s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16,185,129,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ height: '12rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '4rem' }}>📲</span>
                            </div>
                            <div style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#fffbeb', color: '#92400e', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                                    WhatsApp
                                </div>
                                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                    {tr('📱 WhatsApp-та шақырту жіберу — қағаз шақыртудан 10 есе тиімді!', '📱 Приглашения через WhatsApp — в 10 раз выгоднее бумажных!')}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    {tr(
                                        'Қағаз шақырту — қымбат, ұзақ, қиын. Ал электронды шақырту — тез, тегін, əдемі! toi.com.kz арқылы шақыртуды жасап, бір батырмамен WhatsApp-қа жіберіңіз. Қонақтар телефоннан ашып, RSVP жауабын береді. Кім келеді, кім келмейді — бəрін панельден көресіз!',
                                        'Бумажные приглашения — дорого, долго, сложно. А электронные — быстро, бесплатно, красиво! Через toi.com.kz создайте приглашение и отправьте его в WhatsApp одним нажатием. Гости откроют на телефоне и ответят через RSVP. Кто придёт, кто нет — всё видно в панели!'
                                    )}
                                </p>
                            </div>
                        </article>

                        {/* Blog Card 3 */}
                        <article style={{
                            borderRadius: '1.75rem', overflow: 'hidden', background: 'white',
                            border: '1px solid rgba(16,185,129,0.1)', transition: 'all 0.25s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16,185,129,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ height: '12rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '4rem' }}>✨</span>
                            </div>
                            <div style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#f5f3ff', color: '#5b21b6', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                                    {tr('Кеңестер', 'Советы')}
                                </div>
                                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                    {tr('💡 Тойға дайындық — 5 кеңес, уақытты үнемдеңіз!', '💡 Подготовка к тою — 5 советов, которые сэкономят ваше время!')}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                    {tr(
                                        '1. Шақыртуды алдын ала жасаңыз — кемінде 2 апта бұрын. 2. Электронды шақырту қолданыңыз — тез жəне ыңғайлы. 3. RSVP функциясын пайдаланыңыз — кім келетінін біліңіз. 4. Қонақтар тізімін жүргізіңіз. 5. toi.com.kz сервисін қолданыңыз — барлығы бір жерде!',
                                        '1. Делайте приглашения заранее — минимум за 2 недели. 2. Используйте электронные приглашения — быстро и удобно. 3. Используйте RSVP — узнайте, кто придёт. 4. Ведите список гостей. 5. Используйте toi.com.kz — всё в одном месте!'
                                    )}
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── FAQ ────────────────────────────────────────── */}
            <section id="faq" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                            {tr('❓ Жиі қойылатын сұрақтар', '❓ Часто задаваемые вопросы')}
                        </div>
                        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                            FAQ
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>
                            {tr('Сұрақтарыңызға жауап табыңыз', 'Найдите ответы на ваши вопросы')}
                        </p>
                    </div>
                    {faqItems.map((item, i) => (
                        <FaqItem key={i} question={tr(item.q.kk, item.q.ru)} answer={tr(item.a.kk, item.a.ru)} />
                    ))}
                </div>
            </section>

            {/* ── CONTACT ──────────────────────────────────────── */}
            <section id="contact" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                        {tr('Байланыс', 'Контакты')}
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1.0625rem' }}>
                        {tr('Сұрақтарыңыз болса, бізбен хабарласыңыз', 'Если есть вопросы — пишите нам')}
                    </p>
                    <div className="home-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {/* WhatsApp */}
                        <a href="https://wa.me/77056842747" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <MessageCircle size={32} color="#25D366" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>WhatsApp</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>+7 705 684 27 47</div>
                            </div>
                        </a>
                        {/* Instagram */}
                        <a href="https://instagram.com/codejaz.kz" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#fffbeb', border: '1px solid rgba(251,191,36,0.2)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(251,191,36,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <Instagram size={32} color="#e1306c" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>Instagram</div>
                                <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>@codejaz.kz</div>
                            </div>
                        </a>
                        {/* Phone */}
                        <a href="tel:+77056842747" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <Phone size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>{tr('Телефон', 'Телефон')}</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>+7 705 684 27 47</div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer style={{ background: '#022c22', color: '#a7f3d0', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <div className="home-footer-inner" style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: '#10b981', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>sh</div>
                        <span style={{ color: 'white', fontWeight: 700 }}>Toiga Shaqyru</span>
                    </div>
                    <div>{tr('© 2025 Toiga Shaqyru — Барлық құқықтар қорғалған', '© 2025 Toiga Shaqyru — Все права защищены')}</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="https://wa.me/77056842747" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>WhatsApp</a>
                        <a href="https://instagram.com/codejaz.kz" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>Instagram</a>
                    </div>
                </div>
            </footer>

            {/* ── MOBILE CTA BAR ─────────────────────────────── */}
            <div className="home-mobile-cta" style={{
                position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 150,
                display: 'none',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(16,185,129,0.12)',
                boxShadow: '0 -8px 24px rgba(16,185,129,0.12)'
            }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <Button variant="outline" onClick={() => setModal('login')} style={{ flex: 1, height: '2.95rem' }}>{tr('Кіру', 'Войти')}</Button>
                    <Button onClick={() => setModal('register')} style={{ flex: 1, height: '2.95rem' }}>{tr('Тегін бастау', 'Начать бесплатно')}</Button>
                </div>
            </div>
            <style>{`
                .home-page {
                    overflow-x: hidden;
                }

                @media (max-width: 1120px) {
                    .home-nav-link {
                        display: none !important;
                    }
                }

                @media (max-width: 900px) {
                    .home-header {
                        padding: 0.8rem 1rem !important;
                    }

                    .home-logo-text {
                        font-size: 0.95rem !important;
                    }

                    .home-nav {
                        gap: 0.45rem !important;
                        overflow-x: auto;
                        scrollbar-width: none;
                    }
                    .home-nav::-webkit-scrollbar { display: none; }

                    .home-nav .home-nav-btn {
                        padding: 0.45rem 0.8rem !important;
                        font-size: 0.8rem !important;
                    }

                    .home-hero {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                        padding-top: 6rem !important;
                        padding-bottom: 3.25rem !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }

                    .home-hero-cta {
                        flex-wrap: wrap;
                        gap: 1rem !important;
                        margin-bottom: 2rem !important;
                    }

                    .home-hero-points {
                        grid-template-columns: 1fr !important;
                    }

                    .home-features-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .home-categories-grid,
                    .home-steps-grid,
                    .home-contact-grid,
                    .home-blog-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .home-auth-overlay {
                        padding: 0.75rem !important;
                    }

                    .home-auth-modal-card {
                        padding: 1.25rem !important;
                        border-radius: 1.25rem !important;
                    }

                    .desktop-only { display: none !important; }
                }

                @media (max-width: 640px) {
                    .home-hero-cards {
                        grid-template-columns: 1fr !important;
                    }

                    .home-features-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .home-footer-inner {
                        justify-content: center !important;
                    }

                    .home-mobile-cta {
                        display: block !important;
                    }

                    .home-hero-cta {
                        align-items: stretch !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
