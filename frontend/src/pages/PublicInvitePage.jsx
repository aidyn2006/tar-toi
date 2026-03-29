import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inviteService } from '../api/inviteService';
import Template2Frame from '../components/Template2Frame';
import NoIndexSEO from '../components/NoIndexSEO';
import { useLang } from '../context/LanguageContext';
import { PUBLIC_ROUTE_KEYS, buildLocalizedPath } from '../seo/publicRoutes';

const PublicInvitePage = () => {
    const { slug } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);
    const { lang } = useLang();
    const tr = (kk, ru) => (lang === 'ru' ? ru : kk);
    const fallbackTitle = tr('Онлайн шақырту', 'Онлайн-приглашение');
    const pageTitle = invite?.title || fallbackTitle;
    const isClosedInvite = invite?.isActive === false;
    const pageDescription = invite?.description || tr(
        'Бұл шақырту беті қонақтарға жіберуге арналған.',
        'Эта страница приглашения предназначена для отправки гостям.'
    );

    useEffect(() => {
        inviteService.getBySlug(slug)
            .then(setInvite)
            .catch(() => setError404(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <>
                <NoIndexSEO title={fallbackTitle} description={pageDescription} robots="noindex,follow" />
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
            </>
        );
    }

    if (error404 || !invite) {
        return (
            <>
                <NoIndexSEO
                    title={tr('Шақырту табылмады', 'Приглашение не найдено')}
                    description={tr(
                        'Шақырту беті табылмады немесе өшірілген.',
                        'Страница приглашения не найдена или была удалена.'
                    )}
                    robots="noindex,follow"
                />
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
                        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>
                            {tr('Шақырту табылмады', 'Приглашение не найдено')}
                        </h1>
                        <p style={{ margin: 0, opacity: 0.7 }}>
                            {tr(
                                'Сілтеме дұрыс емес немесе шақырту жойылған.',
                                'Ссылка неверна или приглашение удалено.'
                            )}
                        </p>
                        <a
                            href={buildLocalizedPath(lang, PUBLIC_ROUTE_KEYS.home)}
                            style={{
                                display: 'inline-flex',
                                marginTop: '1.25rem',
                                color: '#10b981',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            {tr('Сайтқа оралу', 'Вернуться на сайт')}
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NoIndexSEO title={pageTitle} description={pageDescription} robots="noindex,follow" />
            <div style={{ width: '100%', height: '100vh', background: '#f7fff9', position: 'relative' }}>
                {isClosedInvite && (
                    <div style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        width: 'min(92vw, 46rem)',
                        pointerEvents: 'none',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.9rem',
                            flexWrap: 'wrap',
                            background: 'rgba(255,255,255,0.86)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '22px',
                            padding: '0.9rem 1rem',
                            border: '1px solid rgba(23,63,51,0.12)',
                            boxShadow: '0 14px 36px rgba(23,63,51,0.16)',
                            color: '#173f33',
                            pointerEvents: 'auto',
                        }}>
                            <div style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '999px',
                                background: 'rgba(243, 201, 79, 0.24)',
                                color: '#8a5a00',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                            }}>
                                {tr('Төленбеген', 'Не оплачено')}
                            </div>
                            <div style={{ flex: '1 1 15rem', minWidth: 0 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.18rem' }}>
                                    {tr('Шақырту тек көруге ашық', 'Приглашение открыто только для просмотра')}
                                </div>
                                <div style={{ color: '#1f5b46', fontSize: '0.92rem', lineHeight: 1.45, opacity: 0.82 }}>
                                    {tr(
                                        'Қарап шығуға болады, бірақ батырмалар мен жауап беру уақытша өшірілген.',
                                        'Посмотреть приглашение можно, но кнопки и отправка ответа временно отключены.'
                                    )}
                                </div>
                            </div>
                            <a
                                href="https://wa.me/77766255581"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.55rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '999px',
                                    textDecoration: 'none',
                                    background: 'linear-gradient(110deg, #f3c94f, #f8da7b)',
                                    color: '#173f33',
                                    fontWeight: 800,
                                    fontSize: '0.92rem',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 8px 20px rgba(31,91,70,0.12)',
                                }}
                            >
                                WhatsApp: 8 776 625 55 81
                            </a>
                        </div>
                    </div>
                )}
                <Template2Frame
                    invite={invite}
                    inviteId={isClosedInvite ? null : invite.id}
                    enableRsvp={!isClosedInvite}
                    lockInteractions={isClosedInvite}
                    lang={lang}
                    mode="view"
                />
            </div>
        </>
    );
};

export default PublicInvitePage;
