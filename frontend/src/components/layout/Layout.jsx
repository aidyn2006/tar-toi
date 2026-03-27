import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../AuthModal';
import Button from '../Button';
import { useLang } from '../../context/LanguageContext';

const Layout = ({ children }) => {
    const [modal, setModal] = useState(null);
    const [modalReason, setModalReason] = useState('');
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    useEffect(() => {
        const syncAuthModalFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const authParam = params.get('auth');
            const reasonParam = params.get('reason') || '';
            const hash = window.location.hash;

            if (authParam === 'login') {
                setModal('login');
                setModalReason(reasonParam);
                return;
            }

            if (authParam === 'register') {
                setModal('register');
                setModalReason('');
                return;
            }

            if (hash === '#login') {
                setModal('login');
                setModalReason('');
                return;
            }

            if (hash === '#register') {
                setModal('register');
                setModalReason('');
                return;
            }

            setModal(null);
            setModalReason('');
        };

        syncAuthModalFromUrl();

        window.addEventListener('hashchange', syncAuthModalFromUrl);
        window.addEventListener('popstate', syncAuthModalFromUrl);

        return () => {
            window.removeEventListener('hashchange', syncAuthModalFromUrl);
            window.removeEventListener('popstate', syncAuthModalFromUrl);
        };
    }, []);

    const handleCloseModal = () => {
        setModal(null);
        setModalReason('');

        const url = new URL(window.location.href);
        url.hash = '';
        url.searchParams.delete('auth');
        url.searchParams.delete('reason');
        url.searchParams.delete('next');

        window.history.replaceState({}, '', `${url.pathname}${url.search}`);
    };

    const handleOpenModal = (nextModal, reason = '') => {
        setModal(nextModal);
        setModalReason(reason);
    };

    return (
        <div
            className="app-layout"
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
            <Header onAuthClick={handleOpenModal} />

            <main style={{ flex: 1 }}>
                {children}
            </main>

            <Footer />

            {modal && (
                <AuthModal
                    onClose={handleCloseModal}
                    defaultMode={modal}
                    reason={modalReason}
                />
            )}

            <div
                className="mobile-cta-bar"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 150,
                    display: 'none',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(16,185,129,0.12)',
                    boxShadow: '0 -8px 24px rgba(16,185,129,0.12)'
                }}
            >
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenModal('login')}
                        style={{ flex: 1, height: '2.95rem' }}
                    >
                        {tr('Кіру', 'Войти')}
                    </Button>
                    <Button
                        onClick={() => handleOpenModal('register')}
                        style={{ flex: 1, height: '2.95rem' }}
                    >
                        {tr('Тегін бастау', 'Начать')}
                    </Button>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-cta-bar { display: block !important; }
                    main { padding-bottom: 5rem; }
                }
            `}</style>
        </div>
    );
};

export default Layout;
