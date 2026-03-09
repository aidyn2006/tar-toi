import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import Template2Frame from '../components/Template2Frame';
import { useLang } from '../context/LanguageContext';

const PublicInvitePage = () => {
    const { slug } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    useEffect(() => {
        inviteService.getBySlug(slug)
            .then(setInvite)
            .catch(() => setError404(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f7fff9',
                color: '#173f33',
                fontFamily: 'Manrope, sans-serif',
            }}>
                {tr('Жүктелуде...', 'Загрузка...')}
            </div>
        );
    }

    if (error404 || !invite) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f7fff9',
                color: '#173f33',
                fontFamily: 'Manrope, sans-serif',
                textAlign: 'center',
                padding: '1rem',
            }}>
                <div>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎪</div>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>{tr('Шақырту табылмады', 'Приглашение не найдено')}</h1>
                    <p style={{ margin: 0, opacity: 0.7 }}>{tr('Сілтеме дұрыс емес немесе шақырту жойылған', 'Ссылка неверна или приглашение удалено')}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100vh', background: '#f7fff9', position: 'relative' }}>
            {invite && invite.isActive === false && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(23,63,51,0.65)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: '#ffffff', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '26rem',
                        border: `1px solid #d7e9df`, boxShadow: '0 24px 64px rgba(23,63,51,0.3)', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🔒</div>
                        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#173f33', marginBottom: '0.75rem' }}>
                            {tr('Шақырту жабық', 'Приглашение закрыто')}
                        </h2>
                        <p style={{ color: '#1f5b46', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                            {tr('Доступ алу үшін ватсапқа жазыңыз', 'Чтобы получить доступ напишите на ватсап')}
                        </p>
                        <a href="https://wa.me/77766255581" target="_blank" rel="noopener noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            padding: '0.875rem 2rem', borderRadius: '999px', textDecoration: 'none',
                            background: `linear-gradient(110deg, #f3c94f, #f8da7b)`,
                            color: '#173f33', fontWeight: 800, fontSize: '1rem',
                            boxShadow: '0 8px 20px rgba(31,91,70,0.14)', marginBottom: '0.75rem'
                        }}>
                            💬 WhatsApp: 8 776 625 55 81
                        </a>
                    </div>
                </div>
            )}
            <Template2Frame invite={invite} inviteId={invite.id} enableRsvp lang={lang} mode="view" />
        </div>
    );
};

export default PublicInvitePage;
