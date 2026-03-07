import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../AuthModal';
import Button from '../Button';
import { useLang } from '../../context/LanguageContext';

const Layout = ({ children }) => {
    const [modal, setModal] = useState(null);
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash === '#login') setModal('login');
            if (window.location.hash === '#register') setModal('register');
        };
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    return (
        <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header onAuthClick={setModal} />

            <main style={{ flex: 1 }}>
                {children}
            </main>

            <Footer />

            {modal && <AuthModal onClose={() => { setModal(null); window.history.pushState(null, null, window.location.pathname); }} defaultMode={modal} />}

            {/* Mobile bottom CTA */}
            <div className="mobile-cta-bar" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
                display: 'none', padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(16,185,129,0.12)',
                boxShadow: '0 -8px 24px rgba(16,185,129,0.12)'
            }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <Button variant="outline" onClick={() => setModal('login')} style={{ flex: 1, height: '2.95rem' }}>
                        {tr('Кіру', 'Войти')}
                    </Button>
                    <Button onClick={() => setModal('register')} style={{ flex: 1, height: '2.95rem' }}>
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
