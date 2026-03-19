import { normalizeUrl } from './buildConfig';

export function applyPalette(html, palette) {
    if (!html) return '';
    if (html.includes('NO_PALETTE')) return html;

    let out = html;

    const vars = {
        '--wine': palette.wine,
        '--wine-dark': palette.wineDark,
        '--wine-light': palette.wineLight,
        '--gold': palette.gold,
        '--gold-light': palette.goldLight,
        '--cream': palette.cream,
        '--text': palette.text,
    };

    Object.entries(vars).forEach(([name, value]) => {
        const rx = new RegExp(`${name}:\\s*#[0-9a-fA-F]{3,8};`);
        out = out.replace(rx, `${name}: ${value};`);
    });

    return out;
}

export function injectConfig(html, config) {
    return html
        .replace(
            /const CONFIG = \{[\s\S]*?\};/,
            `const CONFIG = ${JSON.stringify(config, null, 8)};`
        )
        .replace(
            /<title>[\s\S]*?<\/title>/,
            `<title>${(config?.music?.title || 'Wedding Invitation').replace(/</g, '&lt;')}</title>`
        );
}

export function injectPhoto(html, url) {
    if (!url) return html;

    const absoluteUrl = normalizeUrl(url);
    const safeUrl = absoluteUrl.replace(/"/g, '&quot;');

    let out = html.replace(
        /<div\s+class="hero-photo-placeholder"[^>]*>[\s\S]*?<\/div>/i,
        `<img class="hero-photo-img" src="${safeUrl}" alt="photo">`
    );

    out = out.replace(
        /(<div\s+[^>]*?id="heroPhoto"[^>]*>)([\s\S]*?)(<\/div>)/i,
        (match, open, inner, close) => {
            if (inner.includes('<img')) {
                const updatedInner = inner.replace(
                    /(<img\s+[^>]*?src=")([^"]*)("[^>]*>)/i,
                    (current) => {
                        let result = current;
                        if (!current.includes('hero-photo-img')) {
                            result = current.replace(/<img/i, '<img class="hero-photo-img"');
                        }

                        return result.replace(/(src=")([^"]*)(")/i, `$1${safeUrl}$3`);
                    }
                );

                return open + updatedInner + close;
            }

            return (
                open +
                `<img class="hero-photo-img" src="${safeUrl}" alt="photo" style="width:100%;height:100%;object-fit:cover;display:block;">` +
                close
            );
        }
    );

    if (out === html) {
        out = html.replace(
            /(<img[^>]+class="[^"]*hero-photo-img[^"]*"[^>]*src=")([^"]*)(")/i,
            `$1${safeUrl}$3`
        );
    }

    return out;
}

export function injectTemplateData(html, config, { heroUrl = '' } = {}) {
    let out = injectConfig(html, config);
    out = injectPhoto(out, heroUrl || config?.heroPhotoUrl || '');
    return out;
}

export function localizeTemplate(html, lang) {
    if (lang !== 'kk') return html;

    let out = html.replace('<html lang="ru">', '<html lang="kk">');

    const pairs = [
        ['Приглашение на свадьбу', 'Үйлену тойына шақыру'],
        ['Прокрутите вниз', 'Төмен қарай жылжытыңыз'],
        ['До торжества осталось', 'Тойға дейін'],
        ['Дней', 'Күн'],
        ['Часов', 'Сағат'],
        ['Минут', 'Минут'],
        ['Секунд', 'Секунд'],
        ['Наша музыка', 'Біздің музыка'],
        ['Наша Песня', 'Біздің ән'],
        ['— загрузите аудио файл —', '— аудио файлын жүктеңіз —'],
        ['Загрузить музыку', 'Музыканы жүктеу'],
        ['Перемотать', 'Артқа'],
        ['Вперёд', 'Алға'],
        ['Фото', 'Фотолар'],
        ['Ваш ответ', 'Сіздің жауабыңыз'],
        ['Пожалуйста, подтвердите присутствие', 'Қатысатыныңызды растаңыз'],
        ['Ваше имя', 'Атыңыз'],
        ['Введите ваше имя', 'Атыңызды жазыңыз'],
        ['Телефон', 'Телефон'],
        ['Количество гостей', 'Қонақ саны'],
        ['1 Гость', '1 қонақ'],
        ['2 Гостя', '2 қонақ'],
        ['3 Гостя', '3 қонақ'],
        ['Пожелания / Меню', 'Тілектер / Мәзір'],
        ['Аллергии, особые пожелания...', 'Аллергия, тілектер...'],
        ['Подтвердить присутствие', 'Қатысамын деп растау'],
        ['Спасибо! Ждём вас на нашем торжестве.', 'Рахмет! Тойда күтеміз.'],
        ['Начало в ${CONFIG.hour}  ·  ${CONFIG.location}', 'Басталуы ${CONFIG.hour}  ·  ${CONFIG.location}'],
        ['Добавьте несколько фотографий — карусель появится здесь.', 'Бірнеше фото жүктеңіз — галерея осында шығады.'],
    ];

    pairs.forEach(([ru, kk]) => {
        out = out.replace(new RegExp(ru, 'g'), kk);
    });

    out = out.replace(
        /<span>Пн<\/span><span>Вт<\/span><span>Ср<\/span>\s*<span>Чт<\/span><span>Пт<\/span><span>Сб<\/span><span>Вс<\/span>/,
        '<span>Дс</span><span>Сс</span><span>Ср</span><span>Бс</span><span>Жм</span><span>Сб</span><span>Жс</span>'
    );

    out = out.replace(
        /const MONTHS_RU = \[[^\]]+\];/,
        'const MONTHS_RU = ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];'
    );

    out = out.replace(
        /const MONTHS_GEN = \[[^\]]+\];/,
        'const MONTHS_GEN = ["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"];'
    );

    return out;
}
