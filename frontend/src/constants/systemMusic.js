// Built-in short instrumental tones shipped with the app.
export const SYSTEM_MUSIC = [
    {
        key: 'calm-tone',
        title: 'Жайлы әуен',
        artist: 'TOI Preset',
        url: '/system-music/calm-tone.wav',
        mood: 'calm',
    },
    {
        key: 'bright-tone',
        title: 'Жеңіл қоңырау',
        artist: 'TOI Preset',
        url: '/system-music/bright-tone.wav',
        mood: 'light',
    },
    {
        key: 'uplift-tone',
        title: 'Көтеріңкі көңіл',
        artist: 'TOI Preset',
        url: '/system-music/uplift-tone.wav',
        mood: 'uplift',
    },
];

export const SYSTEM_MUSIC_MAP = SYSTEM_MUSIC.reduce((acc, track) => {
    acc[track.key] = track;
    return acc;
}, {});

/**
 * Resolve actual music data for an invite. Handles system presets and uploaded files.
 */
export function resolveMusicTrack(invite = {}) {
    const rawSource = (invite.musicSource || '').toString().toUpperCase();
    const key = (invite.musicKey || '').trim();
    const preset = key ? SYSTEM_MUSIC_MAP[key] : null;
    const hasUpload = Boolean((invite.musicUrl || '').trim());

    const source = rawSource === 'SYSTEM' ? 'SYSTEM'
        : rawSource === 'UPLOAD' ? 'UPLOAD'
        : (preset ? 'SYSTEM' : (hasUpload ? 'UPLOAD' : null));

    const url = source === 'SYSTEM' && preset
        ? preset.url
        : (hasUpload ? invite.musicUrl : '');

    const title = (invite.musicTitle || '').trim()
        || (preset ? preset.title : '')
        || (invite.title || 'Наша Песня');

    const artist = preset?.artist || (invite.toiOwners || '— аудио жүктелмеген —');

    return { key, preset, source, url, title, artist };
}
