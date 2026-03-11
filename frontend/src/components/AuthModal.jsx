import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Lock, ArrowRight } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { authService } from '../api/authService';
import { useLang } from '../context/LanguageContext';

/* ─── Threads Icon SVG ───────────────────────────────── */
const ThreadsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 192 192" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.69 16.124 6.985 25.557 6.47 12.455-.684 22.222-5.446 29.033-14.15 5.177-6.6 8.452-15.153 9.898-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.3-11.322 11.24-24.931 16.1-45.492 16.25-22.764-.168-39.994-7.487-51.225-21.766C36.411 127.033 31.15 110.7 30.94 92c.21-18.7 5.47-35.033 15.625-48.572C57.795 29.15 75.025 21.83 97.79 21.662c22.926.169 40.43 7.52 52.022 21.853 5.678 7.04 9.941 15.832 12.65 26.01l16.147-4.317c-3.35-12.511-8.66-23.396-15.855-32.411C147.062 15.363 125.163 6.057 97.824 5.847h-.06C70.479 6.057 48.762 15.397 33.743 37.187 20.328 56.864 13.386 82.261 13.15 92c.236 9.739 7.178 35.136 20.593 54.813 15.019 21.79 36.736 31.13 64.081 31.34h.059c24.396-.186 41.408-6.621 55.467-20.867 18.6-18.799 18.06-42.223 11.948-56.606-4.418-10.298-12.86-18.498-23.761-22.692Zm-41.48 55.258c-10.44.587-21.286-4.098-27.264-11.987-3.999-5.261-5.049-10.707-2.85-15.584 2.744-6.178 10.154-9.867 20.238-10.447 1.785-.103 3.543-.152 5.277-.152 6.059 0 11.73.592 16.927 1.739-1.927 24.056-11.662 35.897-32.328 36.431Z"/>
    </svg>
);

/* ─── Phone format helpers ────────────────────────────── */
const formatLocal = (digits) => {
    const d = digits.slice(0, 10);
    let out = d.slice(0, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += ' ' + d.slice(6, 8);
    if (d.length > 8) out += ' ' + d.slice(8, 10);
    return out;
};

const handlePhoneChange = (rawValue, setPhone) => {
    const digits = rawValue.replace(/\D/g, '');
    const formatted = formatLocal(digits);
    setPhone(formatted);
};

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

const AuthModal = ({ onClose, defaultMode = 'login' }) => {
    const [mode, setMode] = useState(defaultMode);
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const switchMode = (m) => { setMode(m); setErrors({}); setStatus(''); setConfirmPassword(''); };

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
        <div className="home-auth-overlay" onClick={!loading && !status ? onClose : undefined} style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(6,78,59,0.3)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            cursor: !loading && !status ? 'pointer' : 'default'
        }}>
            <div className="home-auth-modal-card" onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: '2rem', padding: '2.5rem',
                width: '100%', maxWidth: '26rem',
                boxShadow: '0 24px 64px rgba(16,185,129,0.2)',
                border: '1px solid rgba(16,185,129,0.1)',
                position: 'relative', animation: 'modalIn 0.25s ease',
                maxHeight: '90vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '2.25rem', height: '2.25rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                }}><X size={18} /></button>

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
                        {errors.phone && <span className="form-error">{errors.phone}</span>}
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

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 1rem', gap: '0.75rem' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {tr('немесе', 'или')}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                <button
                    type="button"
                    onClick={() => { window.location.href = authService.getThreadsOAuthUrl(); }}
                    style={{
                        width: '100%', height: '3rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                        background: '#000', color: '#fff',
                        border: 'none', borderRadius: '0.875rem',
                        fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '0.95rem',
                        cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <ThreadsIcon />
                    {tr('Threads арқылы кіру', 'Войти через Threads')}
                </button>

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

export default AuthModal;
