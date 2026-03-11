import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLang } from '../context/LanguageContext';

const CallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            setStatus('error');
            setErrorMsg(tr('Threads арқылы кіруден бас тартылды', 'Вход через Threads был отменён'));
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        if (!code) {
            setStatus('error');
            setErrorMsg(tr('Threads кодын ала алмадым', 'Не удалось получить код от Threads'));
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        authService.loginWithThreads(code)
            .then(() => {
                setStatus('success');
                navigate('/dashboard');
            })
            .catch((err) => {
                const msg = err.response?.data?.message
                    || tr('Threads арқылы кіру сәтсіз болды', 'Ошибка входа через Threads');
                setStatus('error');
                setErrorMsg(msg);
                setTimeout(() => navigate('/'), 3000);
            });
    }, []);

    return (
        <div style={{
            height: '100vh', width: '100vw',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            fontFamily: "'Manrope', sans-serif",
            gap: '1.25rem'
        }}>
            {status === 'loading' && (
                <>
                    <div style={{
                        width: '3rem', height: '3rem', border: '3px solid #a7f3d0',
                        borderTopColor: '#10b981', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                    <p style={{ color: '#065f46', fontWeight: 600, fontSize: '1.05rem' }}>
                        {tr('Threads арқылы кіру...', 'Вход через Threads...')}
                    </p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div style={{ fontSize: '3rem' }}>✅</div>
                    <p style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem' }}>
                        {tr('Сәтті кірдіңіз!', 'Вы успешно вошли!')}
                    </p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div style={{ fontSize: '3rem' }}>❌</div>
                    <p style={{ color: '#991b1b', fontWeight: 600, fontSize: '1rem', textAlign: 'center', maxWidth: '24rem', padding: '0 1rem' }}>
                        {errorMsg}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {tr('Бастапқы бетке қайта бағыттауда...', 'Перенаправление на главную...')}
                    </p>
                </>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CallbackPage;
