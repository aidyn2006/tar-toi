import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { inviteService } from '../api/inviteService';

/* ─── Design tokens ──────────────────────────────────────── */
const C = {
    cream: '#fdfaf5',
    burgundy: '#8b4b4b',
    burgundyDark: '#6b3535',
    gold: '#f3c94f',
    green: '#173f33',
    text: '#2d1a1a',
    textMuted: '#9a7a7a',
    white: '#ffffff',
};

const KZ_MONTHS = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];

function formatKazDate(dt) {
    if (!dt) return '';
    const d = new Date(dt);
    return `${d.getFullYear()} жылы ${KZ_MONTHS[d.getMonth()]} айының ${d.getDate()} күні`;
}

function buildCalendar(dt) {
    if (!dt) return null;
    const d = new Date(dt);
    const year = d.getFullYear(), month = d.getMonth(), day = d.getDate();
    const first = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, day, first, daysInMonth };
}

/* ─── Countdown hook ──────────────────────────────────────── */
function useCountdown(eventDate) {
    const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        if (!eventDate) return;
        const target = new Date(eventDate).getTime();
        const tick = () => {
            const now = Date.now();
            const rem = Math.max(0, target - now);
            setDiff({
                days: Math.floor(rem / 86400000),
                hours: Math.floor((rem % 86400000) / 3600000),
                minutes: Math.floor((rem % 3600000) / 60000),
                seconds: Math.floor((rem % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [eventDate]);
    return diff;
}

/* ─── Fade-in on scroll ───────────────────────────────────── */
function useFadeIn(ref) {
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                obs.disconnect();
            }
        }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
}

const FadeIn = ({ children, delay = '0ms' }) => {
    const ref = useRef(null);
    useFadeIn(ref);
    return <div ref={ref} style={{ transitionDelay: delay }}>{children}</div>;
};

/* ─── CountdownBox ────────────────────────────────────────── */
const CountdownBox = ({ value, label }) => (
    <div style={{ textAlign: 'center', minWidth: '64px' }}>
        <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 800, color: C.white,
            background: C.burgundy, borderRadius: '12px',
            padding: '0.5rem 0.75rem', lineHeight: 1,
            marginBottom: '0.4rem',
            boxShadow: '0 4px 16px rgba(139,75,75,0.3)',
        }}>
            {String(value).padStart(2, '0')}
        </div>
        <span style={{ fontSize: '0.7rem', color: C.burgundy, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
);

/* ─── RSVP Form ───────────────────────────────────────────── */
const RSVPForm = ({ inviteId }) => {
    const [form, setForm] = useState({ guestName: '', phone: '', guestsCount: 1 });
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        if (!form.guestName.trim()) { setError('Есіміңізді енгізіңіз'); return; }
        setSubmitting(true); setError('');
        try {
            await inviteService.respond(inviteId, {
                guestName: form.guestName,
                phone: form.phone || null,
                guestsCount: parseInt(form.guestsCount) || 1,
                attending: true,
            });
            setDone(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Қате шықты, қайталап көріңіз');
        } finally {
            setSubmitting(false);
        }
    };

    if (done) return (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: C.burgundy, marginBottom: '0.5rem',
            }}>Рақмет!</p>
            <p style={{ color: C.textMuted, fontSize: '1rem' }}>Біз сізді күтеміз!</p>
        </div>
    );

    const inputSt = {
        width: '100%', padding: '0.875rem 1rem',
        borderRadius: '12px', border: `1.5px solid ${C.burgundy}33`,
        fontSize: '1rem', outline: 'none', color: C.text,
        background: C.white, boxSizing: 'border-box',
        fontFamily: 'Manrope, sans-serif',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    return (
        <form onSubmit={submit}>
            <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontWeight: 700, color: C.text, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Есіміңіз</label>
                <input value={form.guestName} onChange={set('guestName')} placeholder="Есіміңіз" style={inputSt}
                    onFocus={e => { e.target.style.borderColor = C.burgundy; e.target.style.boxShadow = `0 0 0 3px ${C.burgundy}18`; }}
                    onBlur={e => { e.target.style.borderColor = `${C.burgundy}33`; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontWeight: 700, color: C.text, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Телефон</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Телефон" style={inputSt}
                    onFocus={e => { e.target.style.borderColor = C.burgundy; e.target.style.boxShadow = `0 0 0 3px ${C.burgundy}18`; }}
                    onBlur={e => { e.target.style.borderColor = `${C.burgundy}33`; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 700, color: C.text, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Қанша адам</label>
                <input type="number" min={1} max={10} value={form.guestsCount} onChange={set('guestsCount')} style={inputSt}
                    onFocus={e => { e.target.style.borderColor = C.burgundy; e.target.style.boxShadow = `0 0 0 3px ${C.burgundy}18`; }}
                    onBlur={e => { e.target.style.borderColor = `${C.burgundy}33`; e.target.style.boxShadow = 'none'; }} />
            </div>
            {error && <div style={{ padding: '0.7rem 1rem', background: '#fef2f2', color: '#991b1b', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <button type="submit" disabled={submitting} style={{
                width: '100%', padding: '1rem',
                borderRadius: '14px', border: 'none',
                background: `linear-gradient(110deg, ${C.burgundy}, ${C.burgundyDark || '#6b3535'})`,
                color: '#fff', fontWeight: 800, fontSize: '1rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                boxShadow: '0 6px 20px rgba(139,75,75,0.35)',
                fontFamily: 'Manrope, sans-serif',
                transition: 'transform 0.15s, box-shadow 0.15s',
            }}
                onMouseEnter={e => { if (!submitting) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 26px rgba(139,75,75,0.45)'; } }}
                onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 6px 20px rgba(139,75,75,0.35)'; }}>
                {submitting ? 'Жіберілуде...' : 'Жіберу'}
            </button>
        </form>
    );
};

/* ─── OrnamentDivider ─────────────────────────────────────── */
const OrnamentDivider = () => (
    <div style={{ textAlign: 'center', color: C.burgundy, fontSize: '1.25rem', letterSpacing: '6px', margin: '1rem 0', opacity: 0.7 }}>
        ❧ ✦ ❧
    </div>
);

/* ─── Public Invite Page ──────────────────────────────────── */
const PublicInvitePage = () => {
    const { slug } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);

    const countdown = useCountdown(invite?.eventDate);

    useEffect(() => {
        inviteService.getBySlug(slug)
            .then(setInvite)
            .catch(() => setError404(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', color: C.burgundy }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❧</div>
                <p>Жүктелуде...</p>
            </div>
        </div>
    );

    if (error404) return (
        <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope, sans-serif', color: C.burgundy, textAlign: 'center' }}>
            <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎪</div>
                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Шақырту табылмады</h1>
                <p style={{ color: C.textMuted }}>Сілтеме дұрыс емес немесе шақырту жойылған</p>
            </div>
        </div>
    );

    const cal = buildCalendar(invite.eventDate);
    const eventTime = invite.eventDate
        ? new Date(invite.eventDate).toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div style={{
            minHeight: '100vh',
            background: C.cream,
            fontFamily: 'Manrope, sans-serif',
            color: C.text,
            position: 'relative',
        }}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Great+Vibes&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet" />
            <title>{invite.topic1 && invite.topic2 ? `${invite.topic1} & ${invite.topic2} — Той` : invite.title}</title>

            {/* Side ornament borders */}
            <style>{`
                .public-page-inner::before,
                .public-page-inner::after {
                    content: '';
                    position: fixed;
                    top: 0; bottom: 0; width: 22px;
                    background-image: repeating-linear-gradient(
                        180deg,
                        ${C.burgundy}55 0px, ${C.burgundy}55 8px,
                        transparent 8px, transparent 12px,
                        ${C.burgundy}22 12px, ${C.burgundy}22 18px,
                        transparent 18px, transparent 24px,
                        ${C.gold}33 24px, ${C.gold}33 28px,
                        transparent 28px, transparent 36px
                    );
                }
                .public-page-inner::before { left: 0; }
                .public-page-inner::after  { right: 0; }
                @media (max-width: 600px) {
                    .public-page-inner::before, .public-page-inner::after { width: 12px; }
                }
            `}</style>

            <div className="public-page-inner" style={{ maxWidth: '560px', margin: '0 auto', padding: '0 36px' }}>

                {/* ── Hero photo ── */}
                <FadeIn>
                    <div style={{ paddingTop: '2rem', textAlign: 'center' }}>
                        {invite.previewPhotoUrl ? (
                            <div style={{
                                position: 'relative', display: 'inline-block',
                                border: `4px solid ${C.burgundy}`,
                                borderRadius: '20px', overflow: 'hidden',
                                boxShadow: `0 8px 40px rgba(139,75,75,0.2), inset 0 0 0 3px ${C.gold}44`,
                            }}>
                                <img src={invite.previewPhotoUrl} alt="couple"
                                    style={{ display: 'block', width: '100%', maxHeight: '380px', objectFit: 'cover' }}
                                    onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                        ) : (
                            <div style={{
                                height: '200px', borderRadius: '20px',
                                border: `2px dashed ${C.burgundy}44`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: `${C.burgundy}08`,
                            }}>
                                <span style={{ color: `${C.burgundy}44`, fontSize: '2rem' }}>🌸</span>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* ── Ornament divider + play button stub ── */}
                <FadeIn delay="100ms">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '1.25rem 0' }}>
                        <OrnamentDivider />
                    </div>
                </FadeIn>

                {/* ── Greeting block ── */}
                <FadeIn delay="150ms">
                    <div style={{
                        background: C.burgundy, borderRadius: '24px',
                        padding: '1.5rem 1.25rem', marginBottom: '1.25rem', textAlign: 'center',
                    }}>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', letterSpacing: '1.5px', lineHeight: 1.6 }}>
                            ҚҰРМЕТТІ АҒАЙЫН-ТУЫС,<br />ҚҰДА-ЖЕКЖАТ, ДОС-ЖАРАН!
                        </p>
                    </div>
                </FadeIn>

                {/* ── Names ── */}
                {(invite.topic1 || invite.topic2) && (
                    <FadeIn delay="200ms">
                        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                            <p style={{
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: 'clamp(2rem, 7vw, 3rem)',
                                color: C.burgundy, lineHeight: 1.2,
                            }}>
                                {invite.topic1} {invite.topic2 ? `& ${invite.topic2}` : ''}
                            </p>
                        </div>
                    </FadeIn>
                )}

                {/* ── Description ── */}
                {invite.description && (
                    <FadeIn delay="220ms">
                        <p style={{ textAlign: 'center', color: C.textMuted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            {invite.description}
                        </p>
                    </FadeIn>
                )}

                {/* ── Countdown ── */}
                {invite.eventDate && (
                    <FadeIn delay="250ms">
                        <div style={{
                            background: C.cream, border: `1px solid ${C.burgundy}22`,
                            borderRadius: '20px', padding: '1.5rem 1rem', marginBottom: '1.25rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(139,75,75,0.08)',
                        }}>
                            <p style={{ fontSize: '0.8rem', color: C.burgundy, fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Тойға дейін:
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 1.25rem)', flexWrap: 'wrap' }}>
                                <CountdownBox value={countdown.days} label="Күн" />
                                <div style={{ fontSize: '2rem', color: C.burgundy, alignSelf: 'center', lineHeight: 1, marginBottom: '1rem' }}>:</div>
                                <CountdownBox value={countdown.hours} label="Сағат" />
                                <div style={{ fontSize: '2rem', color: C.burgundy, alignSelf: 'center', lineHeight: 1, marginBottom: '1rem' }}>:</div>
                                <CountdownBox value={countdown.minutes} label="Минут" />
                                <div style={{ fontSize: '2rem', color: C.burgundy, alignSelf: 'center', lineHeight: 1, marginBottom: '1rem' }}>:</div>
                                <CountdownBox value={countdown.seconds} label="Секунд" />
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* ── Date & Calendar ── */}
                {invite.eventDate && (
                    <FadeIn delay="280ms">
                        <div style={{
                            background: C.burgundy, borderRadius: '24px',
                            padding: '1.5rem', marginBottom: '1.25rem', color: '#fff',
                        }}>
                            <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                Тойымыздың уақыты:
                            </p>
                            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.25rem', opacity: 0.85 }}>
                                {formatKazDate(invite.eventDate)}
                            </p>

                            {cal && (
                                <div style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', opacity: 0.7 }}>
                                        {KZ_MONTHS[cal.month]} {cal.year}
                                    </p>
                                    <div>
                                        {['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жк'].map(d => (
                                            <span key={d} style={{ display: 'inline-block', width: 'calc(100% / 7)', color: '#ffffff88', fontSize: '0.75rem', fontWeight: 600 }}>{d}</span>
                                        ))}
                                    </div>
                                    <div>
                                        {Array.from({ length: cal.first }).map((_, i) => (
                                            <span key={`e${i}`} style={{ display: 'inline-block', width: 'calc(100% / 7)' }} />
                                        ))}
                                        {Array.from({ length: cal.daysInMonth }).map((_, i) => {
                                            const d = i + 1;
                                            const isEvent = d === cal.day;
                                            return (
                                                <span key={d} style={{
                                                    display: 'inline-block', width: 'calc(100% / 7)',
                                                    lineHeight: '2rem',
                                                    borderRadius: '50%',
                                                    background: isEvent ? C.gold : 'transparent',
                                                    color: isEvent ? C.text : '#fff',
                                                    fontWeight: isEvent ? 900 : 400,
                                                    border: isEvent ? `2px solid ${C.gold}` : 'none',
                                                    fontSize: isEvent ? '1rem' : '0.85rem',
                                                    transition: 'all 0.2s',
                                                }}>{d}</span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {eventTime && (
                                <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '2px' }}>
                                    сағат {eventTime}
                                </p>
                            )}
                        </div>
                    </FadeIn>
                )}

                {/* ── Location ── */}
                {(invite.locationName || invite.locationUrl) && (
                    <FadeIn delay="300ms">
                        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                            <p style={{ fontWeight: 700, color: C.burgundy, marginBottom: '0.3rem' }}>Той өтетін орын</p>
                            {invite.locationName && (
                                <p style={{ fontSize: '1.05rem', color: C.text, marginBottom: '0.75rem' }}>{invite.locationName}</p>
                            )}
                            {invite.locationUrl && (
                                <a href={invite.locationUrl} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.5rem', borderRadius: '14px',
                                    background: C.white, border: `2px solid ${C.burgundy}`,
                                    color: C.burgundy, fontWeight: 800, fontSize: '0.95rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 14px rgba(139,75,75,0.18)',
                                    transition: 'background 0.2s, transform 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = C.burgundy; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.burgundy; e.currentTarget.style.transform = ''; }}>
                                    📍 КАРТА АРҚЫЛЫ АШУ
                                </a>
                            )}
                        </div>
                    </FadeIn>
                )}

                {/* ── Той иелері ── */}
                {invite.toiOwners && (
                    <FadeIn delay="320ms">
                        <div style={{
                            background: C.burgundy, borderRadius: '24px',
                            padding: '1.75rem 1.5rem', marginBottom: '1.25rem',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2rem', color: '#ffffff88', marginBottom: '0.5rem' }}>❧</div>
                            <p style={{ color: '#fff', opacity: 0.75, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Той иелері</p>
                            <p style={{
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                                color: '#fff', lineHeight: 1.3,
                            }}>
                                {invite.toiOwners}
                            </p>
                            <div style={{ fontSize: '2rem', color: '#ffffff88', marginTop: '0.5rem' }}>❧</div>
                        </div>
                    </FadeIn>
                )}

                {/* ── RSVP ── */}
                <FadeIn delay="350ms">
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <OrnamentDivider />
                            <h2 style={{
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: 'clamp(2rem, 6vw, 2.8rem)',
                                color: C.burgundy, margin: 0,
                            }}>
                                Сіз келесіз бе?
                            </h2>
                        </div>
                        <div style={{
                            background: C.white, borderRadius: '20px',
                            border: `1px solid ${C.burgundy}22`,
                            padding: '1.75rem',
                            boxShadow: '0 8px 32px rgba(139,75,75,0.08)',
                        }}>
                            <RSVPForm inviteId={invite.id} />
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    );
};

export default PublicInvitePage;
