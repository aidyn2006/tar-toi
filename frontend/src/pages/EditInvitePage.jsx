import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import Template2Frame from '../components/Template2Frame';
import { uploadService } from '../api/uploadService';
import { SYSTEM_MUSIC, SYSTEM_MUSIC_MAP } from '../constants/systemMusic';
import {X
} from 'lucide-react';

import {
    getTemplatesByCategory,
    getDefaultTemplateId,
    resolveTemplateId,
    normalizeCategory,
    getCategoryFromTemplateId,getTemplateMeta
} from '../config/templates/templateRegistry';
import TemplateSelectorSection from '../components/invite-editor/TemplateSelectorSection';
import MediaSection from '../components/invite-editor/MediaSection';
import TextSection from '../components/invite-editor/TextSection';
import EditorTopBar from '../components/invite-editor/EditorTopBar';
import DateLocationSection from '../components/invite-editor/DateLocationSection';
import ProgramSection from '../components/invite-editor/ProgramSection';

import { useLang } from '../context/LanguageContext';
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

const MUSIC_SOURCE = {
    NONE: 'NONE',
    SYSTEM: 'SYSTEM',
    UPLOAD: 'UPLOAD',
};

const EMPTY_INVITE_DATA = {
    title: '',
    description: '',
    eventDate: '',
    previewPhotoUrl: '',
    gallery: [],
    program: [],
    topic1: '',
    topic2: '',
    locationName: '',
    locationUrl: '',
    toiOwners: '',
    template: getDefaultTemplateId('wedding'),
    musicUrl: '',
    musicTitle: '',
    musicKey: '',
    musicSource: MUSIC_SOURCE.NONE,
    maxGuests: 0,
};

function createDefaultProgram(templateId, lang = 'kk') {
    if (templateId === 'wedding/template10.html') {
        return lang === 'ru'
            ? [
                { time: '16:00', title: 'Церемония' },
                { time: '17:00', title: 'Коктейльный час' },
                { time: '18:30', title: 'Торжественный ужин' },
                { time: '21:00', title: 'Вечерняя вечеринка' },
            ]
            : [
                { time: '16:00', title: 'Неке қию рәсімі' },
                { time: '17:00', title: 'Коктейль уақыты' },
                { time: '18:30', title: 'Той дастарханы' },
                { time: '21:00', title: 'Кешкі би кеші' },
            ];
    }

    const labels = lang === 'ru'
        ? [
            'Сбор гостей',
            'Церемония бракосочетания',
            'Начало торжества',
            'Первый танец',
            'Теплые пожелания',
        ]
        : [
            'Қонақтарды қарсы алу',
            'Неке қию рәсімі',
            'Той басталуы',
            'Бірінші би',
            'Ақ тілек',
        ];

    return labels.map((title, index) => ({
        time: `${String(16 + index).padStart(2, '0')}:00`,
        title,
    }));
}

function normalizeProgram(program) {
    if (!Array.isArray(program)) return [];

    return program
        .map((item) => {
            if (!item || typeof item !== 'object') return null;

            const time = String(item.time || '').trim();
            const title = String(item.title || item.label || item.name || '').trim();

            if (!time && !title) return null;

            return { time, title };
        })
        .filter(Boolean);
}

function getNewInviteDefaults(search) {
    const params = new URLSearchParams(search);
    const category = normalizeCategory(params.get('category') || '');
    const customTitle = (params.get('title') || '').trim();

    return {
        ...EMPTY_INVITE_DATA,
        title: customTitle || '',
        template: getDefaultTemplateId(category || 'wedding'),
    };
}

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
    const { lang, t } = useLang();
    const tr = (kk, ru) => t(kk, ru);
    const [data, setData] = useState(() => (isNew ? getNewInviteDefaults(location.search) : EMPTY_INVITE_DATA));
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [slug, setSlug] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false); 
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
        if (!window.confirm(tr('Шақыртуды өшіреміз бе?', 'Удалить приглашение?'))) return;
        try {
            await inviteService.deleteInvite(id);
            navigate('/dashboard');
        } catch (e) {
            alert(tr('Өшіру сәтсіз: ', 'Ошибка удаления: ') + (e.response?.data?.message || e.message));
        }
    };

    /* Load existing invite */
    useEffect(() => {
        if (!id) return;
        inviteService.getMyInvites().then(list => {
            const inv = list.find(i => String(i.id) === String(id));
            if (inv) {
                const srcRaw = (inv.musicSource || '').toString().toUpperCase();
                const musicSource = srcRaw === MUSIC_SOURCE.SYSTEM || srcRaw === MUSIC_SOURCE.UPLOAD ? srcRaw
                    : inv.musicKey ? MUSIC_SOURCE.SYSTEM
                        : inv.musicUrl ? MUSIC_SOURCE.UPLOAD
                            : MUSIC_SOURCE.NONE;
                const musicKey = inv.musicKey || '';
                const presetTitle = musicKey ? (SYSTEM_MUSIC_MAP[musicKey]?.title || '') : '';
                setSlug(inv.slug || '');
                setData({
                    title: inv.title || '',
                    description: inv.description || '',
                    maxGuests: inv.maxGuests ?? 0,
                    eventDate: inv.eventDate ? inv.eventDate.slice(0, 16) : '',
                    previewPhotoUrl: inv.previewPhotoUrl || '',
                    gallery: inv.gallery || [],
                    program: normalizeProgram(inv.program),
                    topic1: inv.topic1 || '',
                    topic2: inv.topic2 || '',
                    locationName: inv.locationName || '',
                    locationUrl: inv.locationUrl || '',
                    toiOwners: inv.toiOwners || '',
                    template: resolveTemplateId(inv.template, getCategoryFromTemplateId(inv.template)),
                    musicUrl: musicSource === MUSIC_SOURCE.UPLOAD ? (inv.musicUrl || '') : '',
                    musicTitle: inv.musicTitle || presetTitle || '',
                    musicKey,
                    musicSource,
                });
            }
        }).finally(() => setLoading(false));
    }, [id]);
    useEffect(() => {
        if (isNew) {
            setData(getNewInviteDefaults(location.search));
            setSlug('');
        }
    }, [isNew, location.search]);

    useEffect(() => {
        setShowEditorMobile(!isMobile);
    }, [isMobile]);
const searchCategory = normalizeCategory(
    new URLSearchParams(location.search).get('category') || 'wedding'
);

const templateValue = resolveTemplateId(data.template, searchCategory);
const currentCategory = getCategoryFromTemplateId(templateValue) || searchCategory;
const selectedTemplateMeta = getTemplateMeta(templateValue);
const supportsPairNames = !!selectedTemplateMeta?.features?.pairNames;
const supportsGallery = selectedTemplateMeta?.features?.gallery ?? true;
const supportsMusic = selectedTemplateMeta?.features?.music ?? true;
const supportsMap = selectedTemplateMeta?.features?.map ?? true;
const supportsProgram = selectedTemplateMeta?.features?.program ?? false;
const selectableTemplates = getTemplatesByCategory(currentCategory);

useEffect(() => {
  if (!selectableTemplates.length) return;

  const existsInCategory = selectableTemplates.some(t => t.id === templateValue);
  if (!existsInCategory) {
    setData(prev => ({
      ...prev,
      template: getDefaultTemplateId(currentCategory),
    }));
  }
}, [currentCategory, templateValue, selectableTemplates]);

useEffect(() => {
    if (!supportsProgram) return;

    setData((prev) => {
        if (normalizeProgram(prev.program).length) return prev;
        return { ...prev, program: createDefaultProgram(templateValue, lang) };
    });
}, [supportsProgram, templateValue, lang]);

const previewData = {
    ...data,
    template: templateValue,
    eventDate: data.eventDate ? new Date(data.eventDate) : null,
};
    const set = useCallback((k) => (e) => setData(prev => ({ ...prev, [k]: e.target.value })), []);
    const addProgramItem = useCallback(() => {
        setData((prev) => ({
            ...prev,
            program: [...(Array.isArray(prev.program) ? prev.program : []), { time: '', title: '' }],
        }));
    }, []);

    const removeProgramItem = useCallback((index) => {
        setData((prev) => ({
            ...prev,
            program: (Array.isArray(prev.program) ? prev.program : []).filter((_, itemIndex) => itemIndex !== index),
        }));
    }, []);

    const changeProgramItem = useCallback((index, key, value) => {
        setData((prev) => {
            const next = Array.isArray(prev.program)
                ? prev.program.map((item) => ({ ...(item || {}) }))
                : [];
            if (!next[index]) return prev;

            next[index] = {
                ...next[index],
                [key]: value,
            };

            return { ...prev, program: next };
        });
    }, []);

    const handleMainPhotoUpload = async (file) => {
        if (!file) return;
        setUploadingPhoto(true);
        try {
            const { url } = await uploadService.uploadImage(file, currentCategory);
            setData(prev => ({ ...prev, previewPhotoUrl: url || prev.previewPhotoUrl }));
        } catch (e) {
            alert(tr('Суретті жүктеу сәтсіз: ', 'Ошибка загрузки фото: ') + (e.response?.data?.error || e.message));
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
            alert(tr('Галереяға жүктеу сәтсіз: ', 'Ошибка загрузки в галерею: ') + (e.response?.data?.error || e.message));
        } finally {
            setUploadingGallery(false);
        }
    };
    const handleMaxGuestsChange = (e) => {
        const raw = e.target.value;
        setData((prev) => ({
            ...prev,
            maxGuests: raw === '' ? '' : Math.max(0, parseInt(raw, 10) || 0),
        }));
    };
    const handleEventDateChange = useCallback((datePart, timePart) => {
    setData((prev) => {
        const prevDate = prev.eventDate ? prev.eventDate.slice(0, 10) : '';
        const prevTime = prev.eventDate ? prev.eventDate.slice(11, 16) : '';

        const date = datePart ?? prevDate;
        const time = timePart ?? prevTime;

        if (!date && !time) {
            return { ...prev, eventDate: '' };
        }

        if (!date && time) {
            const today = new Date().toISOString().slice(0, 10);
            return { ...prev, eventDate: `${today}T${time}` };
        }

        if (!date) {
            return { ...prev, eventDate: '' };
        }

        return {
            ...prev,
            eventDate: `${date}T${time || '00:00'}`,
        };
    });
}, []);
    const removeGalleryPhoto = (url) => {
        setData(prev => ({ ...prev, gallery: (prev.gallery || []).filter(p => p !== url) }));
    };

    const clearMusic = useCallback(() => {
        setData(prev => ({
            ...prev,
            musicUrl: '',
            musicTitle: '',
            musicKey: '',
            musicSource: MUSIC_SOURCE.NONE,
        }));
    }, []);

    const selectSystemMusic = (key) => {
        const preset = key ? SYSTEM_MUSIC_MAP[key] : null;
        setData(prev => ({
            ...prev,
            musicSource: key ? MUSIC_SOURCE.SYSTEM : MUSIC_SOURCE.NONE,
            musicKey: key || '',
            musicUrl: '',
            musicTitle: preset?.title || (key ? prev.musicTitle : ''),
        }));
    };

    const switchMusicSource = (src) => {
        if (src === MUSIC_SOURCE.SYSTEM) {
            setData(prev => {
                const fallbackKey = prev.musicKey || SYSTEM_MUSIC[0]?.key || '';
                const preset = fallbackKey ? SYSTEM_MUSIC_MAP[fallbackKey] : null;
                return {
                    ...prev,
                    musicSource: fallbackKey ? MUSIC_SOURCE.SYSTEM : MUSIC_SOURCE.NONE,
                    musicKey: fallbackKey,
                    musicUrl: '',
                    musicTitle: preset?.title || prev.musicTitle,
                };
            });
        } else if (src === MUSIC_SOURCE.UPLOAD) {
            setData(prev => ({
                ...prev,
                musicSource: MUSIC_SOURCE.UPLOAD,
                musicKey: '',
            }));
        } else {
            clearMusic();
        }
    };

    const handleAudioUpload = async (file) => {
        if (!file) return;
        setUploadingAudio(true);
        try {
            const { url } = await uploadService.uploadAudio(file, currentCategory);
            setData(prev => ({
                ...prev,
                musicUrl: url,
                musicTitle: file.name.replace(/\.[^/.]+$/, '') || prev.musicTitle,
                musicSource: MUSIC_SOURCE.UPLOAD,
                musicKey: '',
            }));
        } catch (e) {
            alert(tr('Аудио жүктеу сәтсіз: ', 'Ошибка загрузки аудио: ') + (e.response?.data?.error || e.message));
        } finally {
            setUploadingAudio(false);
        }
    };

    const saveInvite = async () => {
        setSaving(true);
        try {
            const systemPreset = data.musicSource === MUSIC_SOURCE.SYSTEM && data.musicKey
                ? SYSTEM_MUSIC_MAP[data.musicKey]
                : null;
            const payload = {
                title: data.title || 'Той шақыртуы',
                description: data.description,
                maxGuests: data.maxGuests === '' ? 0 : (data.maxGuests || 0),
                eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 19) : null,
                previewPhotoUrl: data.previewPhotoUrl || null,
                gallery: data.gallery || [],
                program: normalizeProgram(data.program),
                topic1: data.topic1 || null,
                topic2: data.topic2 || null,
                locationName: data.locationName || null,
                locationUrl: data.locationUrl || null,
                toiOwners: data.toiOwners || null,
                template: templateValue,
                musicUrl: data.musicSource === MUSIC_SOURCE.UPLOAD ? (data.musicUrl || null) : null,
                musicTitle: data.musicSource === MUSIC_SOURCE.SYSTEM
                    ? (data.musicTitle || systemPreset?.title || null)
                    : data.musicSource === MUSIC_SOURCE.UPLOAD
                        ? (data.musicTitle || null)
                        : null,
                musicKey: data.musicSource === MUSIC_SOURCE.SYSTEM ? (data.musicKey || null) : null,
                musicSource: data.musicSource || MUSIC_SOURCE.NONE,
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
           alert(tr('Сақтау кезінде қате шықты: ', 'Ошибка при сохранении: ') + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const share = async () => {
        if (!slug) {
            alert(tr('Алдымен сақтаңыз!', 'Сначала сохраните приглашение!'));
            return;
        }

        const link = `${window.location.origin}/invite/${slug}`;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link);
            } else {
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
                prompt(tr('Сілтемені көшіріңіз:', 'Скопируйте ссылку:'), link);
            } catch (_) {}
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', color: C.burgundy }}>
            {tr('Жүктелуде...', 'Загрузка...')}
        </div>
    );

    return (
        <div className="edit-page" style={{ minHeight: '100vh', background: C.cream, fontFamily: 'Manrope, sans-serif' }}>

            {/* ── Top bar ── */}
            <EditorTopBar
                title={isNew ? tr('Жаңа шақырту', 'Новое приглашение') : tr('Шақыртуды редакциялау', 'Редактирование приглашения')}
                canDelete={!isNew}
                saving={saving}
                saved={saved}
                copied={copied}
                onBack={() => navigate('/dashboard')}
                onOpenPreview={() => setPreviewOpen(true)}
                onShare={share}
                onDelete={deleteInvite}
                onSave={saveInvite}
                colors={C}
            />

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
                        <Template2Frame invite={previewData} lang={lang} mobileZoom />
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
                        {showEditorMobile ? tr('Жабу', 'Закрыть') : tr('Редакциялау', 'Редактировать')}
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
                            <TemplateSelectorSection
                                isMobile={isMobile}
                                Section={Section}
                                Field={Field}
                                selectableTemplates={selectableTemplates}
                                templateValue={templateValue}
                                onSelectTemplate={(template) => setData((d) => ({ ...d, template }))}
                                colors={C}
                            />

                        {/* Media */}
                        <MediaSection
                            Section={Section}
                            Field={Field}
                            isMobile={isMobile}
                            colors={C}
                            inputStyle={inputStyle}
                            data={data}
                            uploadingPhoto={uploadingPhoto}
                            uploadingGallery={uploadingGallery}
                            uploadingAudio={uploadingAudio}
                            normalizeUrl={normalizeUrl}
                            onMainPhotoUpload={handleMainPhotoUpload}
                            onClearMainPhoto={() => setData((d) => ({ ...d, previewPhotoUrl: '' }))}
                            onGalleryUpload={handleGalleryUpload}
                            onRemoveGalleryPhoto={removeGalleryPhoto}
                            musicSource={MUSIC_SOURCE}
                            onSwitchMusicSource={switchMusicSource}
                            onClearMusic={clearMusic}
                            systemMusic={SYSTEM_MUSIC}
                            systemMusicMap={SYSTEM_MUSIC_MAP}
                            onSelectSystemMusic={selectSystemMusic}
                            onAudioUpload={handleAudioUpload}
                            supportsGallery={supportsGallery}
                            supportsMusic={supportsMusic}
                        />

                        {/* Text fields */}
                        <TextSection
                            Section={Section}
                            Field={Field}
                            isMobile={isMobile}
                            inputStyle={inputStyle}
                            data={data}
                            supportsPairNames={supportsPairNames}
                            onChangeField={set}
                            onAdjustMaxGuests={adjustMaxGuests}
                            onChangeMaxGuests={handleMaxGuestsChange}
                            colors={C}
                        />

                        {/* Date & Location */}
                            <DateLocationSection
                                Section={Section}
                                Field={Field}
                                isMobile={isMobile}
                                inputStyle={inputStyle}
                                colors={C}
                                data={data}
                                onChangeField={set}
                                onChangeEventDate={handleEventDateChange}
                                supportsMap={supportsMap}
                            />

                        {supportsProgram && (
                            <ProgramSection
                                Section={Section}
                                Field={Field}
                                isMobile={isMobile}
                                inputStyle={inputStyle}
                                colors={C}
                                program={Array.isArray(data.program) ? data.program : []}
                                onAddItem={addProgramItem}
                                onRemoveItem={removeProgramItem}
                                onChangeItem={changeProgramItem}
                            />
                        )}
                    </div>

                    {/* ── Right: Full preview panel ── */}
                    <div className="edit-preview-panel" style={{
                        position: 'sticky', top: '60px', height: 'calc(100vh - 60px)',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'stretch', padding: '1.25rem',
                        background: `linear-gradient(135deg, ${C.burgundy}08, ${C.gold}08)`,
                    }}>
                        <p style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {tr('Алдын ала қарау', 'Предпросмотр')}
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
                            <Template2Frame invite={previewData} lang={lang} />
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
                            <Template2Frame invite={previewData} lang={lang} />
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
