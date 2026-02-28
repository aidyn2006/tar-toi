import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import Template2Frame from '../components/Template2Frame';
import { uploadService } from '../api/uploadService';
import {
    Save, Share2, Eye, X, MapPin, Music,
    Image, Calendar, Clock, ArrowLeft, Check, UploadCloud, Trash2
} from 'lucide-react';

const TEMPLATE_FILES = Object.keys(import.meta.glob('../templates/**/*.html'));

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

const normalizeUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
        if (typeof window !== 'undefined') {
            try {
                const u = new URL(url);
                if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                    return `${window.location.protocol}//${window.location.host}${u.pathname}${u.search}`;
                }
            } catch (_) { /* noop */ }
        }
        return url;
    }
    if (typeof window === 'undefined') return url;
    return window.location.origin + url;
};

const TEMPLATES = [
    { id: 'classic', label: 'Классикалық', color: '#8b4b4b', bg: '#fdfaf5' },
    { id: 'royal', label: 'Роял', color: '#2c3e6b', bg: '#f5f7ff' },
    { id: 'nature', label: 'Табиғат', color: '#2e5e3c', bg: '#f4fdf5' },
    { id: 'modern', label: 'Модерн', color: '#1a1a1a', bg: '#f9f9f9' },
];

const TEMPLATE_NAME_MAP = {
    'wedding/default': 'Classic Wedding',
    'wedding/template2': 'Modern Love',
    'wedding/template3': 'Elegant Story',
    'wedding/template4': 'Golden Evening',
    'wedding/test': 'Minimal Test',
    'common/default': 'Universal Classic',
    'uzatu/default': 'Uzatu Classic',
    'sundet/default': 'Sundet Celebration',
    'tusaukeser/default': 'Tusaukeser',
    'merei/default': 'Anniversary',
    'besik/default': 'Besik Toy',
};

function buildTemplateOptions() {
    const groups = {};
    TEMPLATE_FILES.forEach((path) => {
        const m = path.match(/\.\.\/templates\/([^/]+)\/(.+\.html)$/);
        if (!m) return;
        const category = m[1];
        const file = m[2];
        const id = `${category}/${file}`;
        const fileBase = file.replace(/\.html$/, '');
        const key = `${category}/${fileBase}`;
        const fallback = fileBase.replace(/[-_]/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
        const label = TEMPLATE_NAME_MAP[key] || fallback;
        if (!groups[category]) groups[category] = [];
        groups[category].push({ id, label, fileBase });
    });
    Object.values(groups).forEach(list => list.sort((a, b) => a.label.localeCompare(b.label, 'ru')));
    return groups;
}

const TEMPLATE_OPTIONS = buildTemplateOptions();

const pickGlobalDefault = () => {
    if (TEMPLATE_OPTIONS.common?.[0]) return TEMPLATE_OPTIONS.common[0].id;
    const firstCategory = Object.keys(TEMPLATE_OPTIONS)[0];
    if (firstCategory && TEMPLATE_OPTIONS[firstCategory]?.[0]) return TEMPLATE_OPTIONS[firstCategory][0].id;
    return TEMPLATE_FILES[0] ? TEMPLATE_FILES[0].replace('../templates/', '') : null;
};

const DEFAULT_TEMPLATE_KEY = pickGlobalDefault();

const getCategoryDefault = (category) => {
    if (category && TEMPLATE_OPTIONS[category]?.length) {
        return TEMPLATE_OPTIONS[category][0].id;
    }
    return DEFAULT_TEMPLATE_KEY;
};

const EMPTY_INVITE_DATA = {
    title: '',
    description: '',
    eventDate: '',
    previewPhotoUrl: '',
    gallery: [],
    topic1: '',
    topic2: '',
    locationName: '',
    locationUrl: '',
    toiOwners: '',
    template: DEFAULT_TEMPLATE_KEY,
    musicUrl: '',
    musicTitle: '',
    maxGuests: 0,
};

const CATEGORY_PRESETS = {
    uzatu: { title: 'Ұзату тойы', template: 'uzatu/default.html' },
    wedding: { title: 'Үйлену тойы', template: 'wedding/default.html' },
    sundet: { title: 'Сүндет той', template: 'sundet/default.html' },
    tusaukeser: { title: 'Тұсаукесер', template: 'tusaukeser/default.html' },
    merei: { title: 'Мерейтой', template: 'merei/default.html' },
    besik: { title: 'Бесік той', template: 'besik/default.html' },
};

function getNewInviteDefaults(search) {
    const params = new URLSearchParams(search);
    const category = params.get('category') || '';
    const customTitle = (params.get('title') || '').trim();
    const preset = CATEGORY_PRESETS[category] || null;
    const template = preset?.template || getCategoryDefault(category);

    return {
        ...EMPTY_INVITE_DATA,
        title: customTitle || '',
        template,
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
    const templateId = (data.template || '').split('/').pop()?.replace('.html', '');
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    const heroPhoto = normalizeUrl(data.previewPhotoUrl || (data.gallery?.[0] || ''));

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
                    {heroPhoto ? (
                        <img
                            src={heroPhoto} alt="preview"
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

/* ─── Responsive helpers ────────────────────────────────── */
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isMobile;
};

const normalizeTemplateKey = (tpl) => {
    if (!tpl) return DEFAULT_TEMPLATE_KEY;
    if (tpl.includes('/')) return tpl;
    // legacy values -> map to default
    return DEFAULT_TEMPLATE_KEY;
};

const Section = ({ title, children, border = true, isMobile }) => {
    if (isMobile) {
        return (
            <details open style={{ marginBottom: '1.2rem', borderRadius: '14px', background: '#fff', border: `1px solid ${C.border}` }}>
                <summary style={{
                    padding: '0.95rem 1rem',
                    fontFamily: 'Unbounded, sans-serif',
                    fontSize: '0.95rem',
                    color: C.burgundy,
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{title}</span>
                    <span style={{ fontSize: '1.1rem', color: C.textMuted }}>⌄</span>
                </summary>
                <div style={{ padding: '0 1rem 1rem' }}>
                    {children}
                </div>
            </details>
        );
    }
    return (
        <section style={{
            marginBottom: '1.75rem',
            paddingBottom: '1.75rem',
            borderBottom: border ? `1px solid ${C.border}` : 'none'
        }}>
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '0.9rem', color: C.burgundy, marginBottom: '0.9rem' }}>
                {title}
            </h3>
            {children}
        </section>
    );
};

/* ─── Edit Invite Page ────────────────────────────────────── */
const EditInvitePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isNew = !id;
    const isMobile = useIsMobile();

    const [data, setData] = useState(() => (isNew ? getNewInviteDefaults(location.search) : EMPTY_INVITE_DATA));
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [slug, setSlug] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false); // mobile modal
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [uploadingAudio, setUploadingAudio] = useState(false);
    const [showEditorMobile, setShowEditorMobile] = useState(!isMobile);
    const adjustMaxGuests = useCallback((delta) => {
        setData(prev => {
            // Blank means unlimited; start from 0 when adjusting
            let current = prev.maxGuests === '' ? 0 : parseInt(prev.maxGuests, 10) || 0;
            let next = current + delta;
            if (next < 0) next = 0;
            return { ...prev, maxGuests: next };
        });
    }, []);
    const deleteInvite = async () => {
        if (!id) return;
        if (!window.confirm('Шақыртуды өшіреміз бе?')) return;
        try {
            await inviteService.deleteInvite(id);
            navigate('/dashboard');
        } catch (e) {
            alert('Өшіру сәтсіз: ' + (e.response?.data?.message || e.message));
        }
    };

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
                    maxGuests: inv.maxGuests ?? 0,
                    eventDate: inv.eventDate ? inv.eventDate.slice(0, 16) : '',
                    previewPhotoUrl: inv.previewPhotoUrl || '',
                    gallery: inv.gallery || [],
                    topic1: inv.topic1 || '',
                    topic2: inv.topic2 || '',
                    locationName: inv.locationName || '',
                    locationUrl: inv.locationUrl || '',
                    toiOwners: inv.toiOwners || '',
                    template: normalizeTemplateKey(inv.template),
                    musicUrl: inv.musicUrl || '',
                    musicTitle: inv.musicTitle || '',
                });
            }
        }).finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (isNew) {
            setData(getNewInviteDefaults(location.search));
        }
    }, [isNew, location.search]);

    useEffect(() => {
        setShowEditorMobile(!isMobile);
    }, [isMobile]);

    const previewData = { ...data, eventDate: data.eventDate ? new Date(data.eventDate) : null };

    const currentCategory = (data.template && data.template.includes('/'))
        ? data.template.split('/')[0]
        : (new URLSearchParams(location.search).get('category') || 'common');

    const set = useCallback((k) => (e) => setData(prev => ({ ...prev, [k]: e.target.value })), []);

    const handleMainPhotoUpload = async (file) => {
        if (!file) return;
        setUploadingPhoto(true);
        try {
            const { url } = await uploadService.uploadImage(file, currentCategory);
            setData(prev => ({ ...prev, previewPhotoUrl: url || prev.previewPhotoUrl }));
        } catch (e) {
            alert('Суретті жүктеу сәтсіз: ' + (e.response?.data?.error || e.message));
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleGalleryUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploadingGallery(true);
        try {
            const uploads = [];
            for (const f of files) {
                const { url } = await uploadService.uploadImage(f, currentCategory);
                if (url) uploads.push(url);
            }
            if (uploads.length) {
                setData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploads] }));
            }
        } catch (e) {
            alert('Галереяға жүктеу сәтсіз: ' + (e.response?.data?.error || e.message));
        } finally {
            setUploadingGallery(false);
        }
    };

    const removeGalleryPhoto = (url) => {
        setData(prev => ({ ...prev, gallery: (prev.gallery || []).filter(p => p !== url) }));
    };

    const handleAudioUpload = async (file) => {
        if (!file) return;
        setUploadingAudio(true);
        try {
            const { url } = await uploadService.uploadAudio(file, currentCategory);
            setData(prev => ({ ...prev, musicUrl: url, musicTitle: file.name.replace(/\.[^/.]+$/, '') || prev.musicTitle }));
        } catch (e) {
            alert('Аудио жүктеу сәтсіз: ' + (e.response?.data?.error || e.message));
        } finally {
            setUploadingAudio(false);
        }
    };

    const saveInvite = async () => {
        setSaving(true);
        try {
            const payload = {
                title: data.title || 'Той шақыртуы',
                description: data.description,
                maxGuests: data.maxGuests === '' ? 0 : (data.maxGuests || 0),
                eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 19) : null,
                previewPhotoUrl: data.previewPhotoUrl || null,
                gallery: data.gallery || [],
                topic1: data.topic1 || null,
                topic2: data.topic2 || null,
                locationName: data.locationName || null,
                locationUrl: data.locationUrl || null,
                toiOwners: data.toiOwners || null,
                template: data.template,
                musicUrl: data.musicUrl || null,
                musicTitle: data.musicTitle || null,
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
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link);
            } else {
                // Fallback: hidden textarea copy
                const ta = document.createElement('textarea');
                ta.value = link;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            try {
                prompt('Сілтемені көшіріңіз:', link);
            } catch (_) {
                // swallow
            }
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', color: C.burgundy }}>
            Жүктелуде...
        </div>
    );

    const templateOptions = TEMPLATE_OPTIONS[currentCategory] || TEMPLATE_OPTIONS.common || [];
    const templateValue = data.template || DEFAULT_TEMPLATE_KEY;
    const hasCurrentInList = templateOptions.some(o => o.id === templateValue);
    const selectableTemplates = hasCurrentInList ? templateOptions : [{ id: templateValue, label: templateValue }, ...templateOptions];

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

                    {!isNew && (
                        <button onClick={deleteInvite} style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.55rem 1rem', borderRadius: '10px',
                            background: '#fef2f2', border: '1.5px solid #fecdd3',
                            color: '#be123c', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                        }}>
                            <Trash2 size={15} /> Жою
                        </button>
                    )}

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

            {/* Mobile-first preview and edit toggle */}
            {isMobile && (
                <div style={{ padding: '1rem 1.25rem 0' }}>
                    <div style={{
                        width: '100%',
                        minHeight: '70vh',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }}>
                        <Template2Frame invite={previewData} mobileZoom />
                    </div>
                    <button
                        onClick={() => setShowEditorMobile(v => !v)}
                        style={{
                            marginTop: '0.75rem',
                            width: '100%',
                            padding: '0.9rem 1rem',
                            borderRadius: '12px',
                            border: `1.5px solid ${C.burgundy}`,
                            background: showEditorMobile ? `${C.burgundy}10` : C.white,
                            color: C.burgundy,
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            letterSpacing: '0.2px',
                            cursor: 'pointer',
                        }}
                    >
                        {showEditorMobile ? 'Жабу' : 'Редактировать'}
                    </button>
                </div>
            )}

            {/* ── Two-panel layout ── */}
            {(!isMobile || showEditorMobile) && (
                <div className="edit-layout" style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) minmax(420px, 44vw)',
                    gap: '0',
                    maxWidth: '1600px',
                    margin: '0 auto',
                }}>
                    {/* ── Left: Controls ── */}
                    <div className="edit-controls" style={{ padding: '1.5rem 2rem', overflowY: 'auto', borderRight: `1px solid ${C.border}` }}>

                        {/* Template selector */}
                        <Section title="Шаблон" isMobile={isMobile}>
                            <Field label="Файл шаблона">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
                                    {selectableTemplates.map(opt => {
                                        const active = templateValue === opt.id;
                                        const pretty = opt.label.trim() || 'Template';
                                        const [cat, file] = opt.id.split('/');
                                        const subtitle = `${cat || 'template'} / ${file?.replace('.html','') || ''}`;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setData(d => ({ ...d, template: opt.id }))}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '0.75rem',
                                                    borderRadius: '12px',
                                                    border: `1.5px solid ${active ? C.burgundy : C.border}`,
                                                    background: active ? `${C.burgundy}10` : '#fff',
                                                    cursor: 'pointer',
                                                    boxShadow: active ? '0 8px 20px rgba(23,63,51,0.12)' : 'none',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{ width: '100%', height: '70px', borderRadius: '10px', background: `${C.burgundy}0f`, border: `1px dashed ${C.border}`, marginBottom: '0.55rem', position: 'relative', overflow: 'hidden' }}>
                                                    <div style={{
                                                        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                                                        color: C.textMuted, fontSize: '0.75rem', letterSpacing: '0.5px'
                                                    }}>
                                                        {pretty}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 700, color: C.burgundy, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                                                    {pretty}
                                                </div>
                                                <div style={{ color: C.textMuted, fontSize: '0.78rem', marginTop: '0.1rem' }}>
                                                    {subtitle}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Field>
                        </Section>

                        {/* Media */}
                        <Section title="Медиа" isMobile={isMobile}>
                            <Field label="Басты фото">
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <label style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                                        padding: '0.65rem 1rem', borderRadius: '10px',
                                        border: `1.5px dashed ${C.border}`, cursor: 'pointer',
                                        background: '#fff', color: C.burgundy, fontWeight: 700
                                    }}>
                                        <UploadCloud size={16} /> {uploadingPhoto ? 'Жүктелуде...' : 'Жүктеу'}
                                        <input type="file" accept="image/*" style={{ display: 'none' }}
                                            onChange={e => { if (e.target.files?.[0]) handleMainPhotoUpload(e.target.files[0]); e.target.value = ''; }} />
                                    </label>
                                    {data.previewPhotoUrl && (
                                        <div style={{ position: 'relative' }}>
                                            <img src={data.previewPhotoUrl} alt="preview" style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${C.border}` }} />
                                            <button onClick={() => setData(d => ({ ...d, previewPhotoUrl: '' }))} style={{
                                                position: 'absolute', top: 4, right: 4, border: 'none', background: 'rgba(0,0,0,0.45)',
                                                color: '#fff', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer'
                                            }}>&times;</button>
                                        </div>
                                    )}
                                </div>
                            </Field>

                            <Field label="Галерея фотолары">
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    <label style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                                        padding: '0.65rem 1rem', borderRadius: '10px',
                                        border: `1.5px dashed ${C.border}`, cursor: 'pointer',
                                        background: '#fff', color: C.burgundy, fontWeight: 700
                                    }}>
                                        <Image size={16} /> {uploadingGallery ? 'Жүктелуде...' : 'Файлдарды қосу'}
                                        <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                            onChange={e => { if (e.target.files?.length) handleGalleryUpload(e.target.files); e.target.value = ''; }} />
                                    </label>
                                    <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>Кемінде 1-2 фото қосыңыз</span>
                                </div>
                                {(data.gallery?.length || 0) > 0 && (
                                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                        {data.gallery.map(urlRaw => {
                                            const url = normalizeUrl(urlRaw);
                                            return (
                                                <div key={url} style={{ position: 'relative' }}>
                                                    <img src={url} alt="g" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${C.border}` }} />
                                                    <button onClick={() => removeGalleryPhoto(urlRaw)} style={{
                                                        position: 'absolute', top: 3, right: 3, border: 'none', background: 'rgba(0,0,0,0.5)',
                                                        color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'
                                                    }}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Field>

                            <Field label="Музыка (қаласаңыз)">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <label style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                                        padding: '0.65rem 1rem', borderRadius: '10px',
                                        border: `1.5px dashed ${C.border}`, cursor: 'pointer',
                                        background: '#fff', color: C.burgundy, fontWeight: 700
                                    }}>
                                        <Music size={16} /> {uploadingAudio ? 'Жүктелуде...' : 'MP3 жүктеу'}
                                        <input type="file" accept="audio/*" style={{ display: 'none' }}
                                            onChange={e => { if (e.target.files?.[0]) handleAudioUpload(e.target.files[0]); e.target.value = ''; }} />
                                    </label>
                                    {data.musicUrl && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '10px', background: '#fff', border: `1px solid ${C.border}` }}>
                                            <Music size={16} color={C.burgundy} />
                                            <span style={{ fontWeight: 700, color: C.burgundy }}>{data.musicTitle || 'Аудио файл'}</span>
                                            <button onClick={() => setData(d => ({ ...d, musicUrl: '', musicTitle: '' }))} style={{ border: 'none', background: 'transparent', color: C.textMuted, cursor: 'pointer' }}>Өшіру</button>
                                        </div>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.82rem', color: C.textMuted, marginTop: '0.4rem' }}>
                                    Музыка мен автоскролл тек алдын ала қарауда (публичном просмотре) ойнайды. Редакторда өшірілген.
                                </p>
                            </Field>
                        </Section>

                        {/* Text fields */}
                        <Section title="Мәтін" isMobile={isMobile}>
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
                            <Field label="Қонақтар саны лимиті (0 = шексіз)">
                                <div className="guest-counter" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="gc-btn"
                                        onClick={() => adjustMaxGuests(-1)}
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '12px',
                                            border: `1.5px solid ${C.border}`,
                                            background: '#fff',
                                            fontSize: '18px',
                                            color: C.burgundy,
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                        }}
                                    >
                                        −
                                    </button>
                                    <input
                                        id="maxGuestsInput"
                                        type="number"
                                        min="0"
                                        value={data.maxGuests}
                                        onChange={e => {
                                            const raw = e.target.value;
                                            setData(prev => ({
                                                ...prev,
                                                maxGuests: raw === '' ? '' : Math.max(0, parseInt(raw, 10) || 0)
                                            }));
                                        }}
                                        placeholder="0"
                                        style={{
                                            ...inputStyle,
                                            width: '120px',
                                            textAlign: 'center',
                                            margin: '0',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="gc-btn"
                                        onClick={() => adjustMaxGuests(1)}
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '12px',
                                            border: `1.5px solid ${C.border}`,
                                            background: '#fff',
                                            fontSize: '18px',
                                            color: C.burgundy,
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: C.textMuted, marginTop: '0.35rem' }}>
                                    {data.maxGuests > 0
                                        ? `Максимум ${data.maxGuests} қонақ. RSVP лимитке жеткенде жабылады.`
                                        : '0 немесе бос қалдыру — лимит жоқ.'}
                                </p>
                            </Field>
                        </Section>

                        {/* Date & Location */}
                        <Section title="Күн және орын" isMobile={isMobile} border={false}>
                            <Field label="Дата және уақыт">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.burgundy }} />
                                        <input
                                            type="date"
                                            value={data.eventDate ? data.eventDate.slice(0, 10) : ''}
                                            onChange={e => {
                                                const date = e.target.value;
                                                const time = data.eventDate ? data.eventDate.slice(11, 16) : '';
                                                const combined = date ? `${date}${time ? 'T' + time : 'T00:00'}` : '';
                                                setData(prev => ({ ...prev, eventDate: combined }));
                                            }}
                                            style={{ ...inputStyle, paddingLeft: '30px' }}
                                        />
                                    </div>
                                    <input
                                        type="time"
                                        value={data.eventDate ? data.eventDate.slice(11, 16) : ''}
                                        onChange={e => {
                                            const time = e.target.value;
                                            const date = data.eventDate ? data.eventDate.slice(0, 10) : '';
                                            const baseDate = date || new Date().toISOString().slice(0, 10);
                                            const combined = (time || date) ? `${baseDate}T${time || '00:00'}` : '';
                                            setData(prev => ({ ...prev, eventDate: combined }));
                                        }}
                                        style={inputStyle}
                                    />
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
                        </Section>

                    </div>

                    {/* ── Right: Full preview panel ── */}
                    <div className="edit-preview-panel" style={{
                        position: 'sticky', top: '60px', height: 'calc(100vh - 60px)',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'stretch', padding: '1.25rem',
                        background: `linear-gradient(135deg, ${C.burgundy}08, ${C.gold}08)`,
                    }}>
                        <p style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Алдын ала қарау
                        </p>
                        <div className="edit-preview-canvas" style={{
                            flex: 1,
                            width: '100%',
                            minHeight: 0,
                            borderRadius: '16px',
                            overflow: 'auto',
                            background: C.white,
                            border: `1px solid ${C.border}`,
                            boxShadow: '0 18px 40px rgba(16,46,36,0.16)',
                            scrollbarWidth: 'thin',
                        }}>
                            <Template2Frame invite={previewData} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mobile preview modal ── */}
            {previewOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 500,
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                }}>
                    <div className="edit-preview-modal-inner" style={{
                        position: 'relative',
                        width: 'min(980px, calc(100vw - 2rem))',
                        height: 'calc(100vh - 2rem)',
                    }}>
                        <button onClick={() => setPreviewOpen(false)} style={{
                            position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10,
                            width: '36px', height: '36px', borderRadius: '50%',
                            border: 'none', background: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <X size={16} />
                        </button>
                        <div className="edit-preview-canvas" style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '14px',
                            overflow: 'auto',
                            background: C.white,
                            border: `1px solid ${C.border}`,
                            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
                            scrollbarWidth: 'thin',
                        }}>
                            <Template2Frame invite={previewData} />
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive styles */}
            <style>{`
                .edit-page {
                    overflow-x: hidden;
                }

                details summary::-webkit-details-marker {
                    display: none;
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

                @media (max-width: 640px) {
                    .edit-controls {
                        padding: 0.85rem !important;
                    }

                    details {
                        box-shadow: 0 10px 28px rgba(23,63,51,0.08);
                    }

                    .edit-topbar-actions {
                        gap: 0.4rem !important;
                    }

                    .edit-topbar-actions button {
                        height: 44px;
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
                        height: calc(100vh - 2rem) !important;
                    }

                    .edit-preview-canvas {
                        border-radius: 12px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EditInvitePage;
