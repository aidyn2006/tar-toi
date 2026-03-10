import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';

const CallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('Авторизацияландыру...');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');

        if (!code) {
            setStatus('Қателік: авторизация коды табылмады.');
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        authService.loginWithThreads(code)
            .then(() => {
                setStatus('Сәтті аяқталды! Бағытталуда...');
                setTimeout(() => navigate('/dashboard'), 1000);
            })
            .catch((err) => {
                console.error('Threads OAuth error:', err);
                const msg = err.response?.data?.message || err.message || 'Белгісіз қате';
                setStatus('Қате кетті: ' + msg);
                setTimeout(() => navigate('/'), 3000);
            });
    }, [location, navigate]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fffe', fontFamily: "'Manrope', sans-serif", color: '#064e3b'
        }}>
            <div style={{
                background: 'white', padding: '3rem', borderRadius: '1.5rem',
                boxShadow: '0 20px 40px rgba(16,185,129,0.1)', textAlign: 'center', maxWidth: '400px'
            }}>
                <div style={{
                    width: '4rem', height: '4rem', borderRadius: '1rem', background: '#000', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Threads Авторизациясы</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{status}</p>
            </div>
        </div>
    );
};

export default CallbackPage;
