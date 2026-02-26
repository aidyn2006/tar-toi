import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import {
    Save, Share2, Eye, X, Download, Users, MapPin, Music,
    Image, Calendar, Clock, ChevronDown, ArrowLeft, Check
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────── */
const C = {
    cream: '#f7fff9',
    burgundy: '#173f33',
    burgundyDark: '#0f2f25',
    burgundyLight: '#2b8a64',
    gold: '#f3c94f',
    green: '#173f33',
    border: '#d7e9df',
    text: '#173f33',
    textMuted: '#5f7f73',
    white: '#ffffff',
    surface: '#fff8dd',
};

const TEMPLATES = [
    { id: 'classic', label: 'Классикалық', color: '#8b4b4b', bg: '#fdfaf5' },
    { id: 'royal', label: 'Роял', color: '#2c3e6b', bg: '#f5f7ff' },
    { id: 'nature', label: 'Табиғат', color: '#2e5e3c', bg: '#f4fdf5' },
    { id: 'modern', label: 'Модерн', color: '#1a1a1a', bg: '#f9f9f9' },
];

const AUDIO_TRACKS = [
    { id: '', label: '— Таңдамаңыз —' },
    { id: 'track1', label: 'Казахская классика' },
    { id: 'track2', label: 'Лирикалық' },
    { id: 'track3', label: 'Домбыра' },
];

const EMPTY_INVITE_DATA = {
    title: '',
    description: '',
    maxGuests: 50,
    eventDate: '',
    previewPhotoUrl: '',
    topic1: '',
    topic2: '',
    locationName: '',
    locationUrl: '',
    toiOwners: '',
    template: 'classic',
    audioTrack: '',
};

const CATEGORY_PRESETS = {
    uzatu: { title: 'Ұзату тойы', template: 'classic' },
    wedding: { title: 'Үйлену тойы', template: 'royal' },
    sundet: { title: 'Сүндет той', template: 'nature' },
    tusaukeser: { title: 'Тұсаукесер', template: 'nature' },
    merei: { title: 'Мерейтой', template: 'royal' },
    besik: { title: 'Бесік той', template: 'modern' },
};

function getNewInviteDefaults(search) {
    const params = new URLSearchParams(search);
    const category = params.get('category') || '';
    const customTitle = (params.get('title') || '').trim();
    const preset = CATEGORY_PRESETS[category] || null;

    return {
        ...EMPTY_INVITE_DATA,
        title: customTitle || '',
        template: preset?.template || 'classic',
    };
}

/* ─── Helpers ─────────────────────────────────────────────── */
const today = new Date();

function formatKazDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    const months = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];
    return `${d.getFullYear()} жылы ${months[d.getMonth()]} айының ${d.getDate()} күні`;
}

function buildCalendar(dt) {
    if (!dt) return null;
    const d = new Date(dt);
    const year = d.getFullYear(), month = d.getMonth(), day = d.getDate();
    const first = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, day, first: (first + 6) % 7, daysInMonth };
}

const KZ_MONTHS = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];

/* ─── Phone Preview ───────────────────────────────────────── */
const PhonePreview = ({ data }) => {
    const cal = buildCalendar(data.eventDate);
    const eventHour = data.eventDate ? new Date(data.eventDate).toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }) : '';
    const template = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];

    const ornamentBorder = {
        position: 'absolute',
        top: 0, bottom: 0, width: '18px',
        backgroundImage: `repeating-linear-gradient(
            180deg,
            ${template.color}44 0px, ${template.color}44 8px,
            transparent 8px, transparent 12px,
            ${template.color}22 12px, ${template.color}22 20px,
            transparent 20px, transparent 24px
        )`,
    };

    return (
        <div style={{ fontFamily: "'Manrope', sans-serif", background: template.bg, minHeight: '100%', position: 'relative', overflowX: 'hidden' }}>
            {/* Side ornaments */}
            <div style={{ ...ornamentBorder, left: 0 }} />
            <div style={{ ...ornamentBorder, right: 0 }} />

            <div style={{ padding: '0 28px' }}>
                {/* Photo */}
                <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                    {data.previewPhotoUrl ? (
                        <img
                            src={data.previewPhotoUrl} alt="preview"
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '16px', border: `3px solid ${template.color}` }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div style={{ height: '180px', borderRadius: '16px', border: `2px dashed ${template.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${template.color}08` }}>
                            <span style={{ color: `${template.color}55`, fontSize: '12px' }}>Сурет жоқ</span>
                        </div>
                    )}
                </div>

                {/* Ornament divider */}
                <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '18px', color: template.color, letterSpacing: '4px' }}>
                    ❧ ✦ ❧
                </div>

                {/* Greeting */}
                <div style={{ textAlign: 'center', background: template.color, borderRadius: '20px', padding: '14px 12px', marginBottom: '10px' }}>
                    <p style={{ color: '#fff', fontSize: '11px', lineHeight: 1.5, fontWeight: 600, letterSpacing: 1 }}>
                        ҚҰРМЕТТІ АҒАЙЫН-ТУЫС,<br />ҚҰДА-ЖЕКЖАТ, ДОС-ЖАРАН!
                    </p>
                </div>

                {/* Names */}
                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                    <p style={{ color: template.color, fontSize: '10px', marginBottom: '4px' }}>
                        {data.description || 'Сізді тойымызға шақырамыз'}
                    </p>
                    {(data.topic1 || data.topic2) && (
                        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '22px', color: template.color, lineHeight: 1.2 }}>
                            {data.topic1 || '—'} & {data.topic2 || '—'}
                        </p>
                    )}
                </div>

                {/* Date block */}
                <div style={{ background: template.color, borderRadius: '20px', padding: '14px 10px', marginBottom: '10px', color: '#fff' }}>
                    <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Тойымыздың уақыты:</p>
                    <p style={{ textAlign: 'center', fontSize: '9px', marginBottom: '10px' }}>{formatKazDate(data.eventDate) || '—'}</p>

                    {/* Mini calendar */}
                    {cal && (
                        <div style={{ fontSize: '9px', textAlign: 'center', marginBottom: '8px' }}>
                            {['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жк'].map(d => (
                                <span key={d} style={{ display: 'inline-block', width: '24px', color: '#ffffff99' }}>{d}</span>
                            ))}
                            <br />
                            {Array.from({ length: cal.first }).map((_, i) => (
                                <span key={`e${i}`} style={{ display: 'inline-block', width: '24px' }} />
                            ))}
                            {Array.from({ length: cal.daysInMonth }).map((_, i) => {
                                const d = i + 1;
                                const isToday = d === cal.day;
                                return (
                                    <span key={d} style={{
                                        display: 'inline-block', width: '24px', lineHeight: '22px',
                                        borderRadius: '50%',
                                        background: isToday ? C.gold : 'transparent',
                                        color: isToday ? C.text : '#fff',
                                        fontWeight: isToday ? 800 : 400,
                                        border: isToday ? `1.5px solid ${C.gold}` : 'none',
                                    }}>{d}</span>
                                );
                            })}
                        </div>
                    )}
                    {eventHour && <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700 }}>сағат {eventHour}</p>}
                </div>

                {/* Location */}
                {(data.locationName || data.locationUrl) && (
                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <p style={{ fontSize: '10px', color: template.color, fontWeight: 600, marginBottom: '4px' }}>Той өтетін орын</p>
                        <p style={{ fontSize: '9px', color: C.text, marginBottom: '6px' }}>{data.locationName || ''}</p>
                        {data.locationUrl && (
                            <div style={{ display: 'inline-block', background: '#fff', border: `1px solid ${template.color}`, borderRadius: '12px', padding: '5px 10px', fontSize: '9px', color: template.color, fontWeight: 700 }}>
                                📍 КАРТА АРҚЫЛЫ АШУ
                            </div>
                        )}
                    </div>
                )}

                {/* Той иелері */}
                {data.toiOwners && (
                    <div style={{ background: template.color, borderRadius: '20px', padding: '14px', marginBottom: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>❧</div>
                        <p style={{ color: '#ffffff99', fontSize: '9px', marginBottom: '4px' }}>Той иелері</p>
                        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '16px', color: '#fff' }}>{data.toiOwners}</p>
                        <div style={{ fontSize: '18px', marginTop: '4px' }}>❧</div>
                    </div>
                )}

                {/* RSVP stub */}
                <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
                    <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '18px', color: template.color, marginBottom: '8px' }}>Сіз келесіз бе?</p>
                    <div style={{ background: C.surface, border: `1px solid ${template.color}33`, borderRadius: '12px', padding: '8px', fontSize: '9px', color: C.textMuted }}>
                        RSVP форма осында болады
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── CRM Table ───────────────────────────────────────────── */
const CRMTable = ({ inviteId }) => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!inviteId) return;
        inviteService.getResponses(inviteId)
            .then(setGuests)
            .catch(() => setGuests([]))
            .finally(() => setLoading(false));
    }, [inviteId]);

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
        <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.1rem', color: C.burgundy, margin: 0 }}>
                        Келетін қонақтар
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: C.textMuted, margin: '0.25rem 0 0' }}>
                        {guests.length} адам жауап берді
                    </p>
                </div>
                <button onClick={exportExcel} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.6rem 1rem', borderRadius: '10px',
                    background: '#1D6F42', color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                }}>
                    <Download size={14} /> Списокты Excel-ге жүктеу
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: C.textMuted }}>Жүктелуде...</div>
            ) : guests.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', background: C.surface, borderRadius: '16px', border: `1px dashed ${C.border}` }}>
                    <Users size={32} color={C.border} style={{ marginBottom: '0.75rem' }} />
                    <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Әлі ешкім жауап бермеді</p>
                </div>
            ) : (
                <div style={{ borderRadius: '16px', border: `1px solid ${C.border}`, overflowX: 'auto', overflowY: 'hidden' }}>
                    <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: C.burgundy, color: '#fff' }}>
                                {['Есім', 'Телефон', 'Қонақ саны', 'Келеді?'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.8rem' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((g, i) => (
                                <tr key={g.id} style={{ background: i % 2 === 0 ? C.white : C.surface, borderBottom: `1px solid ${C.border}` }}>
                                    <td style={{ padding: '0.75rem 1rem', color: C.text, fontWeight: 600 }}>{g.guestName}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: C.textMuted }}>{g.phone || '—'}</td>
                                    <td style={{ padding: '0.75rem 1rem', color: C.text }}>{g.guestsCount}</td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                                            background: g.attending ? '#ecfdf5' : '#fef2f2',
                                            color: g.attending ? '#065f46' : '#991b1b'
                                        }}>
                                            {g.attending ? 'Иә' : 'Жоқ'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

/* ─── Field ───────────────────────────────────────────────── */
const Field = ({ label, children }) => (
    <div style={{ marginBottom: '1.1rem' }}>
        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: C.burgundy, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
        </label>
        {children}
    </div>
);

const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    borderRadius: '10px', border: `1.5px solid ${C.border}`,
    fontSize: '0.9rem', outline: 'none', color: C.text,
    background: C.white, boxSizing: 'border-box',
    fontFamily: 'Manrope, sans-serif',
};

/* ─── Edit Invite Page ────────────────────────────────────── */
const EditInvitePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isNew = !id;

    const [data, setData] = useState(() => (isNew ? getNewInviteDefaults(location.search) : EMPTY_INVITE_DATA));
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [slug, setSlug] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false); // mobile modal

    /* Load existing invite */
    useEffect(() => {
        if (!id) return;
        inviteService.getMyInvites().then(list => {
            const inv = list.find(i => i.id === id);
            if (inv) {
                setSlug(inv.slug || '');
                setData({
                    title: inv.title || '',
                    description: inv.description || '',
                    maxGuests: inv.maxGuests || 50,
                    eventDate: inv.eventDate ? inv.eventDate.slice(0, 16) : '',
                    previewPhotoUrl: inv.previewPhotoUrl || '',
                    topic1: inv.topic1 || '',
                    topic2: inv.topic2 || '',
                    locationName: inv.locationName || '',
                    locationUrl: inv.locationUrl || '',
                    toiOwners: inv.toiOwners || '',
                    template: inv.template || 'classic',
                    audioTrack: '',
                });
            }
        }).finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (isNew) {
            setData(getNewInviteDefaults(location.search));
        }
    }, [isNew, location.search]);

    const set = useCallback((k) => (e) => setData(prev => ({ ...prev, [k]: e.target.value })), []);

    const saveInvite = async () => {
        setSaving(true);
        try {
            const payload = {
                title: data.title || 'Той шақыртуы',
                description: data.description,
                maxGuests: parseInt(data.maxGuests) || 50,
                eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 19) : null,
                previewPhotoUrl: data.previewPhotoUrl || null,
                topic1: data.topic1 || null,
                topic2: data.topic2 || null,
                locationName: data.locationName || null,
                locationUrl: data.locationUrl || null,
                toiOwners: data.toiOwners || null,
                template: data.template,
            };
            let result;
            if (isNew) {
                result = await inviteService.createInvite(payload);
                navigate(`/invite/edit/${result.id}`, { replace: true });
            } else {
                result = await inviteService.updateInvite(id, payload);
            }
            setSlug(result.slug || '');
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            alert('Сақтау кезінде қате шықты: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const share = async () => {
        if (!slug) { alert('Алдымен сақтаңыз!'); return; }
        const link = `${window.location.origin}/invite/${slug}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            prompt('Сілтемені көшіріңіз:', link);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', color: C.burgundy }}>
            Жүктелуде...
        </div>
    );

    /* ── Shared preview data (normalize datetime) ── */
    const previewData = { ...data, eventDate: data.eventDate ? new Date(data.eventDate) : null };

    return (
        <div className="edit-page" style={{ minHeight: '100vh', background: C.cream, fontFamily: 'Manrope, sans-serif' }}>
            {/* Google fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Great+Vibes&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet" />

            {/* ── Top bar ── */}
            <header className="edit-topbar" style={{
                position: 'sticky', top: 0, zIndex: 200,
                background: C.white, borderBottom: `1px solid ${C.border}`,
                padding: '0.75rem 1.5rem', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 2px 12px rgba(139,75,75,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.burgundy, display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', color: C.burgundy }}>
                        {isNew ? 'Жаңа шақырту' : 'Шақыртуды редакциялау'}
                    </span>
                </div>

                <div className="edit-topbar-actions" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    {/* Mobile preview button */}
                    <button onClick={() => setPreviewOpen(true)} style={{
                        display: 'none', alignItems: 'center', gap: '0.3rem',
                        padding: '0.5rem 0.9rem', borderRadius: '8px',
                        background: `${C.burgundy}15`, border: `1.5px solid ${C.burgundy}`,
                        color: C.burgundy, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                    }} className="mobile-preview-btn">
                        <Eye size={15} /> Көру
                    </button>

                    <button onClick={share} style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.6rem 1.1rem', borderRadius: '10px',
                        background: copied ? '#ecfdf5' : C.surface,
                        border: `1.5px solid ${copied ? '#10b981' : C.border}`,
                        color: copied ? '#065f46' : C.burgundy, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    }}>
                        {copied ? <Check size={15} /> : <Share2 size={15} />}
                        {copied ? 'Көшірілді!' : 'Бөлісу'}
                    </button>

                    <button onClick={saveInvite} disabled={saving} style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.6rem 1.3rem', borderRadius: '10px',
                        background: saved ? '#10b981' : C.burgundy,
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1, transition: 'background 0.3s',
                    }}>
                        {saved ? <Check size={15} /> : <Save size={15} />}
                        {saving ? 'Сақталуда...' : saved ? 'Сақталды!' : 'Сақтау'}
                    </button>
                </div>
            </header>

            {/* ── Two-panel layout ── */}
            <div className="edit-layout" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 380px',
                gap: '0',
                maxWidth: '1400px',
                margin: '0 auto',
            }}>
                {/* ── Left: Controls ── */}
                <div className="edit-controls" style={{ padding: '1.5rem 2rem', overflowY: 'auto', borderRight: `1px solid ${C.border}` }}>

                    {/* Templates */}
                    <section style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${C.border}` }}>
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                            Шаблоны
                        </h3>
                        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {TEMPLATES.map(t => (
                                <button key={t.id} onClick={() => setData(d => ({ ...d, template: t.id }))} style={{
                                    flex: '0 0 90px', border: `2.5px solid ${data.template === t.id ? t.color : 'transparent'}`,
                                    borderRadius: '12px', padding: '8px', background: t.bg, cursor: 'pointer',
                                    outline: data.template === t.id ? `3px solid ${t.color}44` : 'none', transition: 'all 0.2s',
                                }}>
                                    <div style={{ height: '50px', borderRadius: '8px', background: t.color, marginBottom: '5px' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: t.color }}>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Media */}
                    <section style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${C.border}` }}>
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                            Медиа
                        </h3>
                        <Field label="Сурет URL (фото)">
                            <div style={{ position: 'relative' }}>
                                <Image size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                <input value={data.previewPhotoUrl} onChange={set('previewPhotoUrl')}
                                    placeholder="https://example.com/photo.jpg"
                                    style={{ ...inputStyle, paddingLeft: '30px' }} />
                            </div>
                        </Field>
                        <Field label="Өлеңді таңдаңыз">
                            <div style={{ position: 'relative' }}>
                                <Music size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                <select value={data.audioTrack} onChange={set('audioTrack')} style={{ ...inputStyle, paddingLeft: '30px', appearance: 'none' }}>
                                    {AUDIO_TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted, pointerEvents: 'none' }} />
                            </div>
                        </Field>
                    </section>

                    {/* Text fields */}
                    <section style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${C.border}` }}>
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                            Мәтін
                        </h3>
                        <div className="edit-names-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <Field label="Тақырып 1 (Күйеу)">
                                <input value={data.topic1} onChange={set('topic1')} placeholder="Адлет"
                                    style={inputStyle} />
                            </Field>
                            <Field label="Тақырып 2 (Қыз)">
                                <input value={data.topic2} onChange={set('topic2')} placeholder="Асем"
                                    style={inputStyle} />
                            </Field>
                        </div>
                        <Field label="Сипаттама">
                            <textarea value={data.description} onChange={set('description')}
                                placeholder="Құрметті ағайын-туыс, сізді тойымызға шақырамыз..."
                                rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                        </Field>
                        <Field label="Той иелері">
                            <input value={data.toiOwners} onChange={set('toiOwners')} placeholder="Сырымбетовтар әулеті"
                                style={inputStyle} />
                        </Field>
                    </section>

                    {/* Date & Location */}
                    <section style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${C.border}` }}>
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                            Күн және орын
                        </h3>
                        <Field label="Дата және уақыт">
                            <div style={{ position: 'relative' }}>
                                <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                <input type="datetime-local" value={data.eventDate} onChange={set('eventDate')}
                                    style={{ ...inputStyle, paddingLeft: '30px' }} />
                            </div>
                        </Field>
                        <Field label="Той өтетін орын">
                            <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
                                <MapPin size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                <input value={data.locationName} onChange={set('locationName')} placeholder="Astana, Farhi Hall"
                                    style={{ ...inputStyle, paddingLeft: '30px' }} />
                            </div>
                            <input value={data.locationUrl} onChange={set('locationUrl')} placeholder="2GIS немесе Google Maps сілтемесі"
                                style={inputStyle} />
                        </Field>
                    </section>

                    {/* Guest limit */}
                    <section style={{ marginBottom: '1.75rem' }}>
                        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                            Лимит
                        </h3>
                        <Field label="Лимит гостей на одно приглашение">
                            <div style={{ position: 'relative' }}>
                                <Users size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                <input type="number" min={1} value={data.maxGuests} onChange={set('maxGuests')}
                                    style={{ ...inputStyle, paddingLeft: '30px' }} />
                            </div>
                        </Field>
                    </section>

                    {/* CRM Table */}
                    {!isNew && <CRMTable inviteId={id} />}
                </div>

                {/* ── Right: Sticky phone preview ── */}
                <div className="edit-preview-panel" data-phone-panel style={{
                    position: 'sticky', top: '60px', height: 'calc(100vh - 60px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '1.5rem',
                    background: `linear-gradient(135deg, ${C.burgundy}08, ${C.gold}08)`,
                }}>
                    <p style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Алдын ала қарау
                    </p>
                    {/* Phone frame */}
                    <div className="edit-phone-frame" style={{
                        width: '300px', height: '580px',
                        border: `8px solid #1a1a1a`,
                        borderRadius: '36px',
                        overflow: 'hidden', overflowY: 'auto',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.3), inset 0 0 0 2px #333',
                        position: 'relative',
                        scrollbarWidth: 'none',
                    }}>
                        {/* Notch */}
                        <div style={{
                            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                            width: '100px', height: '20px', background: '#1a1a1a',
                            borderRadius: '0 0 12px 12px', zIndex: 10,
                        }} />
                        <div style={{ paddingTop: '20px', minHeight: '100%' }}>
                            <PhonePreview data={previewData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile preview modal ── */}
            {previewOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 500,
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                }}>
                    <div className="edit-preview-modal-inner" style={{ position: 'relative', width: '300px' }}>
                        <button onClick={() => setPreviewOpen(false)} style={{
                            position: 'absolute', top: '-12px', right: '-12px', zIndex: 10,
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: 'none', background: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <X size={16} />
                        </button>
                        <div className="edit-phone-frame" style={{
                            width: '300px', height: '580px',
                            border: `8px solid #1a1a1a`, borderRadius: '36px',
                            overflow: 'hidden', overflowY: 'auto',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                            scrollbarWidth: 'none',
                        }}>
                            <div style={{ paddingTop: '20px', minHeight: '100%' }}>
                                <PhonePreview data={previewData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive styles */}
            <style>{`
                .edit-page {
                    overflow-x: hidden;
                }

                @media (max-width: 1024px) {
                    .edit-layout {
                        grid-template-columns: 1fr !important;
                    }

                    .edit-controls {
                        border-right: none !important;
                    }
                }

                @media (max-width: 900px) {
                    .mobile-preview-btn {
                        display: flex !important;
                    }

                    .edit-preview-panel {
                        display: none !important;
                    }
                }

                @media (max-width: 760px) {
                    .edit-topbar {
                        padding: 0.75rem 1rem !important;
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 0.75rem;
                    }

                    .edit-topbar-actions {
                        width: 100%;
                        display: grid !important;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .edit-topbar-actions button {
                        justify-content: center;
                        font-size: 0.78rem !important;
                        padding-left: 0.65rem !important;
                        padding-right: 0.65rem !important;
                    }

                    .edit-controls {
                        padding: 1rem !important;
                    }

                    .edit-names-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 520px) {
                    .edit-topbar-actions {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .mobile-preview-btn {
                        grid-column: 1 / -1;
                    }

                    .edit-preview-modal-inner {
                        width: calc(100vw - 2rem) !important;
                    }

                    .edit-phone-frame {
                        width: calc(100vw - 2rem) !important;
                        height: min(580px, calc(100vh - 4rem)) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EditInvitePage;
