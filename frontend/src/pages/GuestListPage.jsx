import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import { ArrowLeft, Download, Users } from 'lucide-react';

const C = {
    cream: '#fdfaf5',
    burgundy: '#8b4b4b',
    border: '#e8d5c4',
    text: '#2d1a1a',
    textMuted: '#9a7a7a',
    white: '#ffffff',
    surface: '#fff9f2',
};

const GuestListPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteTitle, setInviteTitle] = useState('');

    useEffect(() => {
        if (!id) return;
        // Fetch invite title (optional, just getting from the list)
        inviteService.getMyInvites().then(list => {
            const inv = list.find(i => i.id === id);
            if (inv) setInviteTitle(inv.title);
        });

        // Fetch guests
        inviteService.getResponses(id)
            .then(setGuests)
            .catch(() => setGuests([]))
            .finally(() => setLoading(false));
    }, [id]);

    const exportExcel = () => {
        const headers = ['Есім', 'Телефон', 'Қонақ саны', 'Келеді?'];
        const rows = guests.map(g => [g.guestName, g.phone || '—', g.guestsCount, g.attending ? 'Иә' : 'Жоқ']);
        const csv = [headers, ...rows].map(r => r.join('\t')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'qonaqtar.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="guest-page" style={{ minHeight: '100vh', background: C.cream, fontFamily: 'Manrope, sans-serif' }}>
            <header className="guest-header" style={{
                background: C.white, borderBottom: `1px solid ${C.border}`,
                padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div className="guest-header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.burgundy, display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.2rem', color: C.burgundy, margin: 0 }}>
                            Қонақтар тізімі
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: C.textMuted, margin: '0.2rem 0 0' }}>
                            {inviteTitle || 'Шақырту'}
                        </p>
                    </div>
                </div>
                <button className="guest-export-btn" onClick={exportExcel} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: '10px',
                    background: '#1D6F42', color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                }}>
                    <Download size={16} /> <span className="hide-mobile">Excel-ге жүктеу</span>
                </button>
            </header>

            <main className="guest-main" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.1rem', color: C.text, margin: 0 }}>
                        Жауап бергендер ({guests.length})
                    </h2>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: C.textMuted }}>Жүктелуде...</div>
                ) : guests.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: C.white, borderRadius: '20px', border: `1px solid ${C.border}` }}>
                        <Users size={40} color={C.border} style={{ marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem', color: C.text }}>Әлі ешкім жауап бермеді</h3>
                        <p style={{ color: C.textMuted, fontSize: '0.95rem', margin: 0 }}>
                            Қонақтар сіздің шақыртуыңыздағы форманы толтырғанда, олар осында көрінеді.
                        </p>
                    </div>
                ) : (
                    <div className="guest-table-wrap" style={{ borderRadius: '16px', border: `1px solid ${C.border}`, overflowX: 'auto', background: C.white }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: C.burgundy, color: '#fff' }}>
                                    {['Есім', 'Телефон', 'Қонақ саны', 'Келеді?'].map(h => (
                                        <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((g, i) => (
                                    <tr key={g.id} style={{ borderBottom: i < guests.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                        <td style={{ padding: '1rem', color: C.text, fontWeight: 600 }}>{g.guestName}</td>
                                        <td style={{ padding: '1rem', color: C.textMuted }}>{g.phone || '—'}</td>
                                        <td style={{ padding: '1rem', color: C.text }}>{g.guestsCount} адам</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                                                background: g.attending ? '#ecfdf5' : '#fef2f2',
                                                color: g.attending ? '#065f46' : '#991b1b'
                                            }}>
                                                {g.attending ? 'Иә, келеді' : 'Келе алмайды'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <style>{`
                .guest-page {
                    overflow-x: hidden;
                }

                @media (max-width: 760px) {
                    .guest-header {
                        padding: 0.9rem 1rem !important;
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 0.75rem;
                    }

                    .guest-header-left {
                        width: 100%;
                    }

                    .guest-export-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .guest-main {
                        padding: 1.25rem 1rem !important;
                    }
                }

                @media (max-width: 600px) {
                    .hide-mobile { display: none; }
                }
            `}</style>
        </div>
    );
};

export default GuestListPage;
