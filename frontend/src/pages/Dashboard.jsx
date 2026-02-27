import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { adminService } from '../api/adminService';
import { inviteService } from '../api/inviteService';
import { LogOut, Plus, Calendar, Users, ExternalLink, CheckCircle, XCircle, Clock, Edit3, Eye } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import LanguageSwitch from '../components/LanguageSwitch';

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

const normalizeUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (typeof window === 'undefined') return url;
    if (url.startsWith('/uploads/')) {
        return `${window.location.protocol}//${window.location.hostname}:9191${url}`;
    }
    return window.location.origin + url;
};

const INVITE_CATEGORIES = [
    { id: 'uzatu', label: { kk: 'Ұзату тойы', ru: 'Проводы невесты' }, icon: '✨' },
    { id: 'wedding', label: { kk: 'Үйлену тойы', ru: 'Свадьба' }, icon: '💍' },
    { id: 'sundet', label: { kk: 'Сүндет той', ru: 'Сүндет той' }, icon: '👦' },
    { id: 'tusaukeser', label: { kk: 'Тұсаукесер', ru: 'Тұсаукесер' }, icon: '👣' },
    { id: 'merei', label: { kk: 'Мерейтой', ru: 'Юбилей' }, icon: '🎂' },
    { id: 'besik', label: { kk: 'Бесік той', ru: 'Бесік той' }, icon: '👶' },
];

/* ─── Pending Approval Modal ──────────────────────────── */
const PendingModal = () => {
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    return (
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
                    {tr('Аккаунтыңыз расталу күтілуде', 'Ваш аккаунт ожидает подтверждения')}
                </h2>
                <p style={{ color: C.green700, fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                    {tr('Доступ алу үшін осы Telegram админіне жазыңыз — біз сізге баяндаймыз.', 'Чтобы получить доступ, напишите нашему Telegram-админу — мы подскажем.')}
                </p>
                <a href="https://t.me/nur_kun" target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    padding: '0.875rem 2rem', borderRadius: '999px', textDecoration: 'none',
                    background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`,
                    color: C.green900, fontWeight: 800, fontSize: '1rem',
                    boxShadow: '0 8px 20px rgba(31,91,70,0.14)', marginBottom: '0.75rem'
                }}>
                    ✈️ {tr('Telegram-ға жазу', 'Написать в Telegram')}: @nur_kun
                </a>
                <button onClick={() => authService.logout()} style={{
                    background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem'
                }}>{tr('Шығу', 'Выйти')}</button>
            </div>
        </div>
    );
};

/* ─── Create Invite Modal ─────────────────────────────── */
const CreateInviteModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ category: INVITE_CATEGORIES[0].id, title: '' });
    const [errors, setErrors] = useState({});
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.category) e.category = tr('Санатты таңдаңыз', 'Выберите категорию');
        if (!form.title.trim()) e.title = tr('Атауды енгізіңіз', 'Введите название');
        setErrors(e);
        return !Object.values(e).some(Boolean);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        const params = new URLSearchParams({
            category: form.category,
            title: form.title.trim(),
        });
        navigate(`/invite/new?${params.toString()}`);
        onClose();
    };

    return (
        <div className="create-invite-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(23,63,51,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="create-invite-card" onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '30rem', border: `1px solid ${C.line}`, boxShadow: '0 24px 64px rgba(23,63,51,0.15)' }}>
                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: C.green900, marginBottom: '1.5rem' }}>
                    {tr('Шақырту форматы', 'Формат приглашения')}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Category */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.6rem', fontSize: '0.9rem' }}>{tr('Санат *', 'Категория *')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '0.5rem' }}>
                            {INVITE_CATEGORIES.map((cat) => {
                                const selected = form.category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => { setForm((f) => ({ ...f, category: cat.id })); setErrors((er) => ({ ...er, category: '' })); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            justifyContent: 'center',
                                            padding: '0.65rem 0.5rem',
                                            borderRadius: '10px',
                                            border: `1.5px solid ${selected ? C.green500 : C.line}`,
                                            background: selected ? C.green100 : '#fff',
                                            color: C.green900,
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{tr(cat.label.kk, cat.label.ru)}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.category && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{tr('Санатты таңдаңыз', 'Выберите категорию')}</span>}
                    </div>

                    {/* Template name */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: C.green900, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{tr('Шаблон атауы *', 'Название приглашения *')}</label>
                        <input value={form.title} onChange={set('title')} placeholder={tr('Мысалы: Үйлену тойы — Айдын & Айгүл', 'Напр.: Свадьба — Айдын & Айгүл')}
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: `1.5px solid ${errors.title ? '#ef4444' : C.line}`, fontSize: '0.95rem', outline: 'none', color: C.text, background: '#fff' }} />
                        {errors.title && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{tr('Атауды енгізіңіз', 'Введите название')}</span>}
                    </div>
                    <div className="create-invite-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: `1.5px solid ${C.line}`, background: 'transparent', color: C.green700, fontWeight: 700, cursor: 'pointer' }}>{tr('Бас тарту', 'Отмена')}</button>
                        <button type="submit" style={{ flex: 2, padding: '0.875rem', borderRadius: '12px', border: 'none', background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`, color: C.green900, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                            {tr('Жалғастыру', 'Продолжить')}
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
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const dateLocale = lang === 'ru' ? 'ru-RU' : 'kk-KZ';
    const date = invite.eventDate ? new Date(invite.eventDate).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    const photo = normalizeUrl(invite.previewPhotoUrl);

    const responsesLabel = invite.maxGuests > 0
        ? `${invite.responsesCount || 0} / ${invite.maxGuests}`
        : `${invite.responsesCount || 0}`;

    return (
        <div style={{ background: C.bg, borderRadius: '20px', border: `1px solid ${C.line}`, padding: '1.5rem', boxShadow: '0 4px 16px rgba(23,63,51,0.06)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(23,63,51,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(23,63,51,0.06)'; }}>
            {photo && (
                <img src={photo} alt={invite.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} onError={e => { e.target.style.display = 'none'; }} />
            )}
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1rem', fontWeight: 700, color: C.green900, marginBottom: '0.5rem', lineHeight: 1.3 }}>{invite.title}</h3>
            {invite.description && <p style={{ fontSize: '0.875rem', color: C.green700, marginBottom: '0.875rem', lineHeight: 1.5 }}>{invite.description}</p>}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: C.green500, fontWeight: 600 }}>
                    <Calendar size={14} /> {date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: C.green500, fontWeight: 600 }}>
                    <Users size={14} /> {responsesLabel} {tr('қонақ', 'гостей')}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => navigate(`/invite/edit/${invite.id}`)}
                    style={{ flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.55rem 0.5rem', borderRadius: '10px', border: `1.5px solid ${C.green500}`, background: C.green500, color: 'white', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <Edit3 size={13} /> {tr('Өңдеу', 'Редактировать')}
                </button>
                <button
                    onClick={() => navigate(`/invite/${invite.id}/guests`)}
                    style={{ flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.55rem 0.5rem', borderRadius: '10px', border: `1.5px solid ${C.green500}`, background: 'transparent', color: C.green700, fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <Users size={13} /> {tr('Қонақтар', 'Гости')}
                </button>
                {invite.slug && (
                    <button
                        onClick={() => window.open(`/invite/${invite.slug}`, '_blank')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.55rem 0.75rem', borderRadius: '10px', border: `1.5px solid ${C.line}`, background: 'transparent', color: C.text, fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <Eye size={13} />
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
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

    const load = async () => {
        setLoading(true);
        try { setUsers(await adminService.getAllUsers()); } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const approve = async (id) => { await adminService.approveUser(id); load(); };
    const remove = async (id) => { if (window.confirm(tr('Пайдаланушыны жою?', 'Удалить пользователя?'))) { await adminService.deleteUser(id); load(); } };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: C.green700 }}>{tr('Жүктелуде...', 'Загрузка...')}</div>;

    return (
        <div>
            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.25rem', color: C.green900, marginBottom: '1.5rem' }}>
                {tr('Пайдаланушылар', 'Пользователи')} — {users.length}
            </h2>
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
                            {u.approved ? tr('Расталған', 'Подтвержден') : tr('Күтілуде', 'В ожидании')}
                        </span>
                        {!u.approved && (
                            <button onClick={() => approve(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: C.green500, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                                <CheckCircle size={14} /> {tr('Растау', 'Подтвердить')}
                            </button>
                        )}
                        <button onClick={() => remove(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                            <XCircle size={14} />
                        </button>
                    </div>
                ))}
                {users.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: C.green700 }}>{tr('Пайдаланушылар жоқ', 'Пользователей нет')}</div>}
            </div>
        </div>
    );
};

/* ─── Dashboard Page ──────────────────────────────────── */
const Dashboard = () => {
    const navigate = useNavigate();
    const user = authService.getUser();
    const approved = true;
    const isAdmin = authService.isAdmin();
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);

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
        <div className="dashboard-page" style={{ minHeight: '100vh', background: `radial-gradient(circle at 10% 10%, ${C.yellow100}, transparent 40%), radial-gradient(circle at 90% 5%, ${C.green100}, transparent 35%), ${C.bg}`, fontFamily: 'Manrope, sans-serif' }}>
            {/* Pending Approval Modal */}
            {!approved && <PendingModal />}

            {/* Create Invite Modal */}
            {showCreate && <CreateInviteModal onClose={() => setShowCreate(false)} />}

            {/* Top strip (matching original design) */}
            <div style={{ height: '10px', background: C.green900 }} />

            {/* Header */}
            <header className="dashboard-header" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.125rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: C.yellow500, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color: C.green900 }}>sh</div>
                    <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 28px)', color: C.green900 }}>shaqyrtu.kz</span>
                </div>
                <div className="dashboard-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LanguageSwitch compact />
                    <div style={{ fontSize: '0.9rem', color: C.green700, fontWeight: 600 }}>
                        {user?.fullName || user?.phone}
                    </div>
                    <button onClick={() => authService.logout()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '10px', border: `1px solid ${C.line}`, background: 'white', color: C.green700, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                        <LogOut size={15} /> {tr('Шығу', 'Выйти')}
                    </button>
                </div>
            </header>

            <main className="dashboard-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Tabs */}
                <div className="dashboard-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[
                        { id: 'invites', label: tr('Менің шақыртуларым', 'Мои приглашения') },
                        ...(isAdmin ? [{ id: 'admin', label: '🛡 ' + tr('Админ', 'Админ') }] : []),
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
                        <div className="dashboard-toprow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 700, color: C.green900, margin: 0 }}>{tr('Шақыртулар', 'Приглашения')}</h1>
                                <p style={{ color: C.green700, margin: '0.375rem 0 0', fontSize: '0.9375rem' }}>
                                    {invites.length > 0 ? tr(`${invites.length} шақырту жасалған`, `${invites.length} приглашений создано`) : tr('Әлі шақырту жасалмаған', 'Пока нет приглашений')}
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
                                    <Plus size={18} /> {tr('Шақырту жасау', 'Создать приглашение')}
                                </button>
                            )}
                        </div>

                        {/* Invite grid */}
                        {loadingInvites ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: C.green700 }}>{tr('Жүктелуде...', 'Загрузка...')}</div>
                        ) : invites.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', border: `1px solid ${C.line}` }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>📋</div>
                                <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.375rem', color: C.green900, marginBottom: '0.75rem' }}>{tr('Шақырту жоқ', 'Нет приглашений')}</h2>
                                <p style={{ color: C.green700, marginBottom: '2rem', fontSize: '1rem' }}>{tr('Бірінші шақыртуыңызды жасаңыз', 'Создайте своё первое приглашение')}</p>
                                {approved && (
                                    <button onClick={() => setShowCreate(true)} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem',
                                        borderRadius: '999px', border: 'none',
                                        background: `linear-gradient(110deg, ${C.yellow500}, #f8da7b)`,
                                        color: C.green900, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(31,91,70,0.14)'
                                    }}>
                                        <Plus size={18} /> {tr('Шақырту жасау', 'Создать приглашение')}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                {invites.map(inv => <InviteCard key={inv.id} invite={inv} />)}
                            </div>
                        )}
                    </div>
                )}

                {/* Admin Tab */}
                {tab === 'admin' && <AdminPanel />}
            </main>
            <style>{`
                .dashboard-page {
                    overflow-x: hidden;
                }

                @media (max-width: 900px) {
                    .dashboard-header {
                        padding: 1rem !important;
                    }

                    .dashboard-main {
                        padding: 1.25rem 1rem !important;
                    }

                    .dashboard-tabs {
                        overflow-x: auto;
                        padding-bottom: 0.35rem;
                    }

                    .dashboard-tabs button {
                        white-space: nowrap;
                    }

                    .dashboard-toprow {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem;
                    }
                }

                @media (max-width: 720px) {
                    .dashboard-header {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 0.85rem;
                    }

                    .dashboard-user {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .dashboard-toprow > button {
                        width: 100%;
                        justify-content: center;
                    }

                    .dashboard-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .create-invite-overlay {
                        padding: 0.75rem !important;
                    }

                    .create-invite-card {
                        padding: 1.15rem !important;
                        border-radius: 1rem !important;
                    }

                    .create-invite-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
