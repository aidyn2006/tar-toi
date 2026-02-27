import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import Template2Frame from '../components/Template2Frame';

const PublicInvitePage = () => {
    const { slug } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);

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
                Жүктелуде...
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
                    <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Шақырту табылмады</h1>
                    <p style={{ margin: 0, opacity: 0.7 }}>Сілтеме дұрыс емес немесе шақырту жойылған</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100vh', background: '#f7fff9' }}>
            <Template2Frame invite={invite} inviteId={invite.id} enableRsvp />
        </div>
    );
};

export default PublicInvitePage;
