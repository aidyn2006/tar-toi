import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { authService } from '../api/authService';
import { Phone, Lock, User, ArrowRight, X, Instagram, MessageCircle } from 'lucide-react';

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
const validatePhone = (display) => {
    const digits = display.replace(/\D/g, '');
    if (!digits) return 'Телефон нөмірін енгізіңіз';
    if (digits.length < 10) return `Нөмір толық емес (${digits.length}/10 сан)`;
    return '';
};
const validatePassword = (v) => {
    if (!v) return 'Құпиясөзді енгізіңіз';
    if (v.length < 6) return 'Құпиясөз кемінде 6 символ болуы керек';
    return '';
};
const validateName = (v) => {
    if (!v.trim()) return 'Атыңызды енгізіңіз';
    if (v.trim().length < 2) return 'Аты-жөніңіз тым қысқа';
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

    const switchMode = (m) => { setMode(m); setErrors({}); setStatus(''); setPhoneErr(''); setConfirmPassword(''); };

    const validate = () => {
        const e = {};
        e.phone = validatePhone(phone);
        e.password = validatePassword(password);
        if (mode === 'register') {
            e.fullName = validateName(fullName);
            if (!confirmPassword) e.confirmPassword = 'Құпиясөзді қайталаңыз';
            else if (confirmPassword !== password) e.confirmPassword = 'Құпиясөздер сәйкес келмейді';
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
            const msg = err.response?.data?.message || 'Қате шықты. Қайталап көріңіз.';
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
                position: 'relative', animation: 'modalIn 0.25s ease'
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
                        {mode === 'login' ? 'Қош келдіңіз' : 'Тіркелу'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
                        {mode === 'login' ? 'Аккаунтыңызға кіріңіз' : 'Жаңа аккаунт ашыңыз'}
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
                            {m === 'login' ? 'Кіру' : 'Тіркелу'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <Input label="Аты-жөніңіз" icon={User} placeholder="Айдын Бекенов"
                            value={fullName}
                            onChange={e => { setFullName(e.target.value); setErrors(er => ({ ...er, fullName: '' })); }}
                            error={errors.fullName} />
                    )}

                    {/* Phone with +7 prefix */}
                    <div className="form-group">
                        <label className="form-label">Телефон нөмірі</label>
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

                    <Input label="Құпиясөз" icon={Lock} type="password" placeholder="••••••••"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: '' })); }}
                        error={errors.password} />

                    {mode === 'register' && (
                        <Input label="Құпиясөзді растаңыз" icon={Lock} type="password" placeholder="••••••••"
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
                        {loading ? 'Жүктелуде...' : mode === 'login' ? 'Кіру' : 'Тіркелу'}
                        {!loading && <ArrowRight size={18} />}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {mode === 'login' ? 'Аккаунт жоқ па?' : 'Аккаунт бар ма?'}{' '}
                    <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                        {mode === 'login' ? 'Тіркелу' : 'Кіру'}
                    </button>
                </p>
            </div>
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(10px);} to { opacity:1; transform:scale(1) translateY(0);} }`}</style>
        </div>
    );
};

/* ─── categories ──────────────────────────────────────── */
const categories = [
    { id: 'uzatu', title: 'Ұзату', icon: '✨', count: 4, bg: '#f0fdf4' },
    { id: 'wedding', title: 'Үйлену тойы', icon: '💍', count: 9, bg: '#fffbeb' },
    { id: 'sundet', title: 'Сүндет той', icon: '👦', count: 3, bg: '#f0fdf4' },
    { id: 'tusau', title: 'Тұсаукесер', icon: '👣', count: 4, bg: '#fffbeb' },
    { id: 'merei', title: 'Мерейтой', icon: '🎂', count: 3, bg: '#f0fdf4' },
    { id: 'besik', title: 'Бесік той', icon: '👶', count: 3, bg: '#fffbeb' },
];

const features = [
    { icon: '⚡', title: 'Жылдам жасау', desc: '3 минутта дайын шақырту. Шаблонды таңдап, мәтін жазып, жіберіңіз.' },
    { icon: '📲', title: 'WhatsApp арқылы', desc: 'Шақыртуды қатысушыларға WhatsApp-та тікелей жіберіңіз.' },
    { icon: '📊', title: 'Жауаптарды қадағалау', desc: 'Кім келетінін, кім келмейтінін — барлығын панельде бақылаңыз.' },
    { icon: '🎨', title: '30+ үлгі', desc: 'Барлық той түрлеріне арналған 30-дан астам дайын шаблон.' },
];

/* ─── Home Page ───────────────────────────────────────── */
const Home = () => {
    const [modal, setModal] = useState(null); // null | 'login' | 'register'

    return (
        <div className="home-page" style={{ minHeight: '100vh', background: '#f8fffe', fontFamily: "'Manrope', sans-serif" }}>
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
                    <span className="home-logo-text" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#064e3b' }}>shaqyrtu.kz</span>
                </div>
                <nav className="home-nav" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a className="home-nav-link" href="#features" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>Мүмкіндіктер</a>
                    <a className="home-nav-link" href="#categories" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>Үлгілер</a>
                    <a className="home-nav-link" href="#contact" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0.75rem' }}>Байланыс</a>
                    <Button className="home-nav-btn" variant="outline" onClick={() => setModal('login')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Кіру</Button>
                    <Button className="home-nav-btn" onClick={() => setModal('register')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Тіркелу</Button>
                </nav>
            </header>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="home-hero" style={{ paddingTop: '7.5rem', paddingBottom: '5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        ✨ Жаңа мүмкіндіктер қосылды
                    </div>
                    <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', color: '#064e3b' }}>
                        Онлайн шақырту жасаңыз –{' '}
                        <span style={{ color: '#10b981' }}>тойға дайындықты жеңілдетіңіз.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '34rem' }}>
                        Тіркеліп, шаблонды таңдаңыз, мәтінді қосып, шақыртуды WhatsApp арқылы жіберіңіз.
                    </p>
                    <div className="home-hero-cta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                        <Button onClick={() => setModal('register')} style={{ padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}>
                            Тегін бастау
                        </Button>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>5000 ₸</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>Тегін</div>
                        </div>
                    </div>
                    <div className="home-hero-points" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {['3 мин тіркелу', 'Фото мен музыка', 'WhatsApp жіберу', 'Жауаптарды бақылау'].map((item, i) => (
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
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#064e3b', marginBottom: '0.25rem' }}>{cat.title}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>{cat.count} үлгі</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <section id="features" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#ecfdf5', color: '#065f46', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                            🚀 Неге бізді таңдайды?
                        </div>
                        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                            Барлығы бір жерде
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '30rem', margin: '0 auto' }}>
                            Шақырту жасаудан бастап, жауаптарды бақылауға дейін.
                        </p>
                    </div>
                    <div className="home-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ padding: '2rem 1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(16,185,129,0.1)', background: '#f8fffe', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#064e3b', marginBottom: '0.5rem' }}>{f.title}</div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</div>
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
                            Барлық той түрлері
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>30-дан астам дайын шаблон</p>
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
                                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#064e3b', marginBottom: '0.25rem' }}>{cat.title}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>{cat.count} үлгі қолжетімді</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <Button onClick={() => setModal('register')} style={{ padding: '1rem 2.5rem', height: '3.25rem', fontSize: '1rem' }}>
                            Барлық үлгілерді қарау
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section style={{ padding: '5rem 1.5rem', background: '#064e3b' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        Қалай жұмыс жасайды?
                    </h2>
                    <p style={{ color: '#a7f3d0', marginBottom: '3.5rem', fontSize: '1.0625rem' }}>Тек 3 қадам</p>
                    <div className="home-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                        {[
                            { step: '01', title: 'Тіркеліңіз', desc: 'Телефон нөміріңізбен тіркеліп, аккаунт ашыңыз.' },
                            { step: '02', title: 'Үлгі таңдаңыз', desc: 'Той түріне сай шаблонды таңдап, деректерді толтырыңыз.' },
                            { step: '03', title: 'Жіберіңіз', desc: 'Шақыртуды WhatsApp арқылы барлық қонақтарға жіберіңіз.' },
                        ].map(s => (
                            <div key={s.step} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '3rem', fontWeight: 700, color: '#10b981', marginBottom: '1rem', opacity: 0.35 }}>{s.step}</div>
                                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', marginBottom: '0.75rem' }}>{s.title}</div>
                                <div style={{ color: '#a7f3d0', fontSize: '0.9375rem', lineHeight: 1.6 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={() => setModal('register')} style={{ marginTop: '3.5rem', padding: '1rem 2.5rem', height: '3.5rem', fontSize: '1.0625rem' }}>
                        Қазір бастау
                    </Button>
                </div>
            </section>

            {/* ── CONTACT ──────────────────────────────────────── */}
            <section id="contact" style={{ padding: '5rem 1.5rem', background: 'white' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#064e3b', marginBottom: '1rem' }}>
                        Байланыс
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1.0625rem' }}>
                        Сұрақтарыңыз болса, бізбен хабарласыңыз
                    </p>
                    <div className="home-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {/* WhatsApp */}
                        <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <MessageCircle size={32} color="#25D366" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>WhatsApp</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>+7 700 000 00 00</div>
                            </div>
                        </a>
                        {/* Instagram */}
                        <a href="https://instagram.com/shaqyrtu" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#fffbeb', border: '1px solid rgba(251,191,36,0.2)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(251,191,36,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <Instagram size={32} color="#e1306c" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>Instagram</div>
                                <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>@shaqyrtu.kz</div>
                            </div>
                        </a>
                        {/* Phone */}
                        <a href="tel:+77001234567" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <Phone size={32} color="#10b981" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontWeight: 700, color: '#064e3b', marginBottom: '0.25rem' }}>Телефон</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>+7 700 000 00 00</div>
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
                        <span style={{ color: 'white', fontWeight: 700 }}>shaqyrtu.kz</span>
                    </div>
                    <div>© 2025 shaqyrtu.kz — Барлық құқықтар қорғалған</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>WhatsApp</a>
                        <a href="https://instagram.com/shaqyrtu" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none' }}>Instagram</a>
                    </div>
                </div>
            </footer>
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
                    }

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
                    .home-contact-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .home-auth-overlay {
                        padding: 0.75rem !important;
                    }

                    .home-auth-modal-card {
                        padding: 1.25rem !important;
                        border-radius: 1.25rem !important;
                    }
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
                }
            `}</style>
        </div>
    );
};

export default Home;
