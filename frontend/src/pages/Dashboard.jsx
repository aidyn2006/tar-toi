import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { adminService } from '../api/adminService';
import { inviteService } from '../api/inviteService';
import { LogOut, Plus, Calendar, Users, ExternalLink, CheckCircle, XCircle, Clock, Edit3, Eye } from 'lucide-react';

/* ─── Colour tokens matching original ─────────────────── */
const C = {
    bg: '#ffffff',
    green900: '#173f33',
    green700: '#1f5b46',
    green500: '#2b8a64',
    green100: '#e8f5ee',
    yellow500: '#f3c94f',
    yellow100: '#fff8dd',
    line: '#d7e9df',
    text: '#173f33',
};

/* ─── Pending Approval Modal ──────────────────────────── */
const PendingModal = () => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(23,63,51,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
        <div style={{
            background: C.bg, borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '26rem',
            border: `1px solid ${C.line}`, boxShadow: '0 24px 64px rgba(23,63,51,0.2)', textAlign: 'center'
        }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>⏳</div>
            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.375rem', fontWeight: 700, color: C.green900, marginBottom: '0.75rem' }}>
                Аккаунтыңыз расталу күтілуде
            </h2>
            <p style={{ color: C.green700, fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Доступ алу үшін осы ботқа жазыңыз — біз сізге баяндаймыз.
            </p>
            <a href="https://wa.me/77083527432?text=Сәлем! Менің аккаунтымды растаңыз." target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                padding: '0.875rem 2rem', borderRadius: '999px', textDecoration: 'none',
                background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`,
                color: C.green900, fontWeight: 800, fontSize: '1rem',
                boxShadow: '0 8px 20px rgba(31,91,70,0.14)', marginBottom: '0.75rem'
            }}>
                💬 WhatsApp-қа жазу: +7 708 352 74 32
            </a>
            <button onClick={() => authService.logout()} style={{
                background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem'
            }}>Шығу</button>
        </div>
    </div>
);

/* ─── Create Invite Modal ─────────────────────────────── */
const CreateInviteModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', description: '', maxGuests: 50, eventDate: '', previewPhotoUrl: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiErr, setApiErr] = useState('');

    const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Атауды енгізіңіз';
        if (!form.eventDate) e.eventDate = 'Күнін таңдаңыз';
        if (form.maxGuests < 1) e.maxGuests = 'Ең кемі 1 қонақ';
        setErrors(e);
        return !Object.values(e).some(Boolean);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiErr('');
        try {
            const payload = {
                title: form.title,
                description: form.description || null,
                maxGuests: parseInt(form.maxGuests),
                eventDate: new Date(form.eventDate).toISOString().replace('Z', ''),
                previewPhotoUrl: form.previewPhotoUrl || null,
            };
            await inviteService.createInvite(payload);
            onCreated();
            onClose();
        } catch (err) {
            setApiErr(err.response?.data?.message || 'Қате шықты');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(23,63,51,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '30rem', border: `1px solid ${C.line}`, boxShadow: '0 24px 64px rgba(23,63,51,0.15)' }}>
                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: C.green900, marginBottom: '1.5rem' }}>
                    Жаңа шақырту жасау
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Атауы *</label>
                        <input value={form.title} onChange={set('title')} placeholder="Үйлену тойы — Айдын & Айгүл"
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.title ? '#ef4444' : C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, background: '#fff' }} />
                        {errors.title && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.title}</span>}
                    </div>
                    {/* Description */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Сипаттама</label>
                        <textarea value={form.description} onChange={set('description')} placeholder="Шақыртуда шығатын мәтін..."
                            rows={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, resize: 'none', background: '#fff' }} />
                    </div>
                    {/* Event Date */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Той күні мен уақыты *</label>
                        <input type="datetime-local" value={form.eventDate} onChange={set('eventDate')}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.eventDate ? '#ef4444' : C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, background: '#fff' }} />
                        {errors.eventDate && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.eventDate}</span>}
                    </div>
                    {/* Max Guests */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Максималды қонақтар саны *</label>
                        <input type="number" min={1} value={form.maxGuests} onChange={set('maxGuests')}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.maxGuests ? '#ef4444' : C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, background: '#fff' }} />
                        {errors.maxGuests && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.maxGuests}</span>}
                    </div>
                    {/* Photo URL */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Сурет URL (міндетті емес)</label>
                        <input value={form.previewPhotoUrl} onChange={set('previewPhotoUrl')} placeholder="https://..."
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, background: '#fff' }} />
                    </div>
                    {apiErr && <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', color: '#991b1b', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.9rem' }}>{apiErr}</div>}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: `1.5px solid ${C.line}`, background: 'transparent', color: C.green700, fontWeight: 700, cursor: 'pointer' }}>Бас тарту</button>
                        <button type="submit" disabled={loading} style={{ flex: 2, padding: '0.875rem', borderRadius: '12px', border: 'none', background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`, color: C.green900, fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Жасалуда...' : 'Шақырту жасау'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Invite Card ─────────────────────────────────────── */
const InviteCard = ({ invite }) => {
    const navigate = useNavigate();
    const date = invite.eventDate ? new Date(invite.eventDate).toLocaleDateString('kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

    return (
        <div style={{ background: C.bg, borderRadius: '20px', border: `1px solid ${C.line}`, padding: '1.5rem', boxShadow: '0 4px 16px rgba(23,63,51,0.06)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(23,63,51,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(23,63,51,0.06)'; }}>
            {invite.previewPhotoUrl && (
                <img src={invite.previewPhotoUrl} alt={invite.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} onError={e => { e.target.style.display = 'none'; }} />
            )}
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1rem', fontWeight: 700, color: C.green900, marginBottom: '0.5rem', lineHeight: 1.3 }}>{invite.title}</h3>
            {invite.description && <p style={{ fontSize: '0.875rem', color: C.green700, marginBottom: '0.875rem', lineHeight: 1.5 }}>{invite.description}</p>}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: C.green500, fontWeight: 600 }}>
                    <Calendar size={14} /> {date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: C.green500, fontWeight: 600 }}>
                    <Users size={14} /> {invite.responsesCount || 0} / {invite.maxGuests} қонақ
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={() => navigate(`/invite/edit/${invite.id}`)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.55rem 0.75rem', borderRadius: '10px', border: `1.5px solid ${C.green500}`, background: C.green500, color: 'white', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <Edit3 size={13} /> Редакциялау
                </button>
                {invite.slug && (
                    <button
                        onClick={() => window.open(`/invite/${invite.slug}`, '_blank')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.55rem 0.75rem', borderRadius: '10px', border: `1.5px solid ${C.line}`, background: 'transparent', color: C.green700, fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <Eye size={13} /> Көру
                    </button>
                )}
            </div>
        </div>
    );
};


/* ─── Admin Panel ─────────────────────────────────────── */
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try { setUsers(await adminService.getAllUsers()); } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const approve = async (id) => { await adminService.approveUser(id); load(); };
    const remove = async (id) => { if (window.confirm('Пайдаланушыны жою?')) { await adminService.deleteUser(id); load(); } };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: C.green700 }}>Жүктелуде...</div>;

    return (
        <div>
            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', color: C.green900, marginBottom: '1.5rem' }}>Пайдаланушылар — {users.length}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {users.map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: C.bg, borderRadius: '16px', border: `1px solid ${C.line}`, flexWrap: 'wrap' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: u.approved ? C.green100 : C.yellow100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {u.approved ? <CheckCircle size={18} color={C.green500} /> : <Clock size={18} color="#ca8a04" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: C.green900 }}>{u.fullName}</div>
                            <div style={{ fontSize: '0.85rem', color: C.green700 }}>{u.phone}</div>
                        </div>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, background: u.approved ? C.green100 : C.yellow100, color: u.approved ? C.green700 : '#92400e' }}>
                            {u.approved ? 'Расталған' : 'Күтілуде'}
                        </span>
                        {!u.approved && (
                            <button onClick={() => approve(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: C.green500, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                                <CheckCircle size={14} /> Растау
                            </button>
                        )}
                        <button onClick={() => remove(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                            <XCircle size={14} />
                        </button>
                    </div>
                ))}
                {users.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: C.green700 }}>Пайдаланушылар жоқ</div>}
            </div>
        </div>
    );
};

/* ─── Dashboard Page ──────────────────────────────────── */
const Dashboard = () => {
    const navigate = useNavigate();
    const user = authService.getUser();
    const approved = authService.isApproved();
    const isAdmin = authService.isAdmin();

    const [tab, setTab] = useState('invites');
    const [invites, setInvites] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        if (!authService.isLoggedIn()) { navigate('/'); return; }
    }, []);

    const loadInvites = async () => {
        if (!approved) return;
        setLoadingInvites(true);
        try { setInvites(await inviteService.getMyInvites()); } catch { /* */ }
        finally { setLoadingInvites(false); }
    };

    useEffect(() => { loadInvites(); }, [approved]);

    return (
        <div style={{ minHeight: '100vh', background: `radial-gradient(circle at 10% 10%, ${C.yellow100}, transparent 40%), radial-gradient(circle at 90% 5%, ${C.green100}, transparent 35%), ${C.bg}`, fontFamily: 'Manrope, sans-serif' }}>
            {/* Pending Approval Modal */}
            {!approved && <PendingModal />}

            {/* Create Invite Modal */}
            {showCreate && <CreateInviteModal onClose={() => setShowCreate(false)} onCreated={loadInvites} />}

            {/* Top strip (matching original design) */}
            <div style={{ height: '10px', background: C.green900 }} />

            {/* Header */}
            <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.125rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: C.yellow500, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color: C.green900 }}>sh</div>
                    <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 28px)', color: C.green900 }}>shaqyrtu.kz</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: C.green700, fontWeight: 600 }}>
                        {user?.fullName || user?.phone}
                    </div>
                    <button onClick={() => authService.logout()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '10px', border: `1px solid ${C.line}`, background: 'white', color: C.green700, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                        <LogOut size={15} /> Шығу
                    </button>
                </div>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[
                        { id: 'invites', label: 'Менің шақыртуларым' },
                        ...(isAdmin ? [{ id: 'admin', label: '🛡 Админ' }] : []),
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            padding: '0.625rem 1.5rem', borderRadius: '999px', border: `1.5px solid ${tab === t.id ? C.green500 : C.line}`,
                            background: tab === t.id ? C.green500 : 'white', color: tab === t.id ? 'white' : C.green700,
                            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                        }}>{t.label}</button>
                    ))}
                </div>

                {/* Invite Tab */}
                {tab === 'invites' && (
                    <div>
                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 700, color: C.green900, margin: 0 }}>Шақыртулар</h1>
                                <p style={{ color: C.green700, margin: '0.375rem 0 0', fontSize: '0.9375rem' }}>
                                    {invites.length > 0 ? `${invites.length} шақырту жасалған` : 'Әлі шақырту жасалмаған'}
                                </p>
                            </div>
                            {approved && (
                                <button onClick={() => setShowCreate(true)} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem',
                                    borderRadius: '999px', border: 'none',
                                    background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`,
                                    color: C.green900, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(31,91,70,0.14)'
                                }}>
                                    <Plus size={18} /> Шақырту жасау
                                </button>
                            )}
                        </div>

                        {/* Invite grid */}
                        {loadingInvites ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: C.green700 }}>Жүктелуде...</div>
                        ) : invites.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', border: `1px solid ${C.line}` }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>📋</div>
                                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.375rem', color: C.green900, marginBottom: '0.75rem' }}>Шақырту жоқ</h2>
                                <p style={{ color: C.green700, marginBottom: '2rem', fontSize: '1rem' }}>Бірінші шақыртуыңызды жасаңыз</p>
                                {approved && (
                                    <button onClick={() => setShowCreate(true)} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem',
                                        borderRadius: '999px', border: 'none',
                                        background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`,
                                        color: C.green900, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(31,91,70,0.14)'
                                    }}>
                                        <Plus size={18} /> Шақырту жасау
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                {invites.map(inv => <InviteCard key={inv.id} invite={inv} />)}
                            </div>
                        )}
                    </div>
                )}

                {/* Admin Tab */}
                {tab === 'admin' && <AdminPanel />}
            </main>
        </div>
    );
};

export default Dashboard;
