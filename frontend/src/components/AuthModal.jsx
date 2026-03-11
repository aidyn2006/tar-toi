import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Lock, ArrowRight } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { authService } from '../api/authService';
import { useLang } from '../context/LanguageContext';

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

    const handleFacebookLogin = () => {
        if (!window.FB) {
            setStatus('error:' + tr('Facebook SDK қателігі', 'Ошибка загрузки Facebook SDK'));
            return;
        }
        setLoading(true);
        setStatus('');
        window.FB.login((response) => {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                authService.loginWithFacebook(accessToken)
                    .then(() => {
                        onClose();
                        navigate('/dashboard');
                    })
                    .catch((err) => {
                        const msg = err.response?.data?.message || tr('Қате шықты. Қайталап көріңіз.', 'Произошла ошибка. Попробуйте ещё раз.');
                        setStatus('error:' + msg);
                        setLoading(false);
                    });
            } else {
                setStatus('error:' + tr('Facebook арқылы кіруден бас тартылды', 'Авторизация через Facebook отменена'));
                setLoading(false);
            }
        }, { scope: 'public_profile' });
    };

    const handleThreadsLogin = () => {
        setLoading(true);
        const clientId = '2066590687240614'; // FB App ID used for Threads
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
        const scope = encodeURIComponent('threads_basic');
        const authUrl = `https://threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        window.location.href = authUrl;
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

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>{tr('немесе', 'или')}</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            disabled={loading}
                            style={{
                                flex: 1,
                                height: '3.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: '#1877F2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.875rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                fontFamily: "'Manrope', sans-serif",
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(24, 119, 242, 0.2)'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.0733C24 5.40523 18.6274 0 12 0C5.37258 0 0 5.40523 0 12.0733C0 18.1009 4.38823 23.0945 10.125 24V15.5625H7.07812V12.0733H10.125V9.41323C10.125 6.38612 11.9165 4.71761 14.6576 4.71761C15.9705 4.71761 17.3438 4.9535 17.3438 4.9535V7.92542H15.8306C14.3399 7.92542 13.875 8.85591 13.875 9.80931V12.0733H17.2031L16.6711 15.5625H13.875V24C19.6118 23.0945 24 18.1009 24 12.0733Z" fill="white"/>
                            </svg>
                            Facebook
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleThreadsLogin}
                            disabled={loading}
                            style={{
                                flex: 1,
                                height: '3.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: '#000000',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.875rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                fontFamily: "'Manrope', sans-serif",
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Threads
                        </button>
                    </div>
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

export default AuthModal;
