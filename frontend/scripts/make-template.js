import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const VALID_CATEGORIES = new Set([
    'wedding',
    'uzatu',
    'tusaukeser',
    'sundet',
    'merei',
    'besik',
]);

const VALID_TYPES = new Set(['pair', 'single']);
const VALID_PALETTES = new Set(['classic', 'royal', 'nature', 'modern']);
const VALID_PREVIEW_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

function fail(message) {
    console.error(`Ошибка: ${message}`);
    process.exit(1);
}

function parseArgs(argv) {
    const args = {};

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];

        if (!token.startsWith('--')) {
            fail(`Неожиданный аргумент: ${token}`);
        }

        const raw = token.slice(2);

        if (!raw) {
            fail('Передан пустой аргумент.');
        }

        const eqIndex = raw.indexOf('=');

        if (eqIndex >= 0) {
            const key = raw.slice(0, eqIndex);
            const value = raw.slice(eqIndex + 1);

            if (!key) {
                fail(`Некорректный аргумент: ${token}`);
            }

            args[key] = value;
            continue;
        }

        if (['premium', 'inactive', 'force'].includes(raw)) {
            args[raw] = true;
            continue;
        }

        const next = argv[i + 1];
        if (!next || next.startsWith('--')) {
            fail(`У аргумента --${raw} нет значения.`);
        }

        args[raw] = next;
        i += 1;
    }

    return args;
}

function normalizeName(name) {
    const normalized = String(name || '')
        .trim()
        .replace(/\.html$/i, '');

    if (!normalized) {
        fail('Нужно передать --name.');
    }

    if (!/^[A-Za-z0-9_-]+$/.test(normalized)) {
        fail('Имя шаблона должно содержать только латиницу, цифры, "-", "_".');
    }

    return normalized;
}

function singleQuote(value) {
    return `'${String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")}'`;
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectEol(text) {
    return text.includes('\r\n') ? '\r\n' : '\n';
}

function resolveStarterPath(rootDir, type) {
    const candidates = type === 'pair'
        ? [
            path.join(rootDir, 'src', 'templates', '_base', 'pair-base.html'),
            path.join(rootDir, 'src', 'templates', '_base', 'pair_base.html'),
        ]
        : [
            path.join(rootDir, 'src', 'templates', '_base', 'single-base.html'),
            path.join(rootDir, 'src', 'templates', '_base', 'single_base.html'),
        ];

    const found = candidates.find(candidate => fs.existsSync(candidate));

    if (!found) {
        const starterLabel = type === 'pair' ? 'pair' : 'single';
        fail(`Не найден starter template для типа "${starterLabel}".`);
    }

    return found;
}

function getRequiredArg(args, key) {
    const value = args[key];

    if (typeof value !== 'string' || !value.trim()) {
        fail(`Нужно передать обязательный аргумент --${key}.`);
    }

    return value.trim();
}

function getSectionRange(lines, startMarker, endMarker, sectionName) {
    const start = lines.findIndex(line => line.includes(startMarker));
    if (start < 0) {
        fail(`Не найден блок ${sectionName} в templateRegistry.js.`);
    }

    const end = lines.findIndex((line, index) => index > start && line.includes(endMarker));
    if (end < 0) {
        fail(`Не найдена граница блока ${sectionName} в templateRegistry.js.`);
    }

    const closing = lines.findIndex(
        (line, index) => index > start && index < end && line.trim() === '};'
    );

    if (closing < 0) {
        fail(`Не найдено закрытие блока ${sectionName} в templateRegistry.js.`);
    }

    return { start, end, closing };
}

function hasKeyInRange(lines, range, templateKey) {
    const keyPattern = new RegExp(`^\\s*'${escapeRegExp(templateKey)}':`);

    for (let i = range.start + 1; i < range.closing; i += 1) {
        if (keyPattern.test(lines[i])) {
            return true;
        }
    }

    return false;
}

function findLastCategoryLine(lines, range, category) {
    const categoryPattern = new RegExp(`^\\s*'${escapeRegExp(category)}\\/[^']+\\.html':`);
    let lastIndex = -1;

    for (let i = range.start + 1; i < range.closing; i += 1) {
        if (categoryPattern.test(lines[i])) {
            lastIndex = i;
        }
    }

    return lastIndex;
}

function findMetaInsertIndex(lines, range, category) {
    const lastCategoryStart = findLastCategoryLine(lines, range, category);

    if (lastCategoryStart < 0) {
        return range.closing;
    }

    for (let i = lastCategoryStart + 1; i < range.closing; i += 1) {
        if (lines[i] === '  },') {
            return i + 1;
        }
    }

    fail(`Не удалось определить место вставки для TEMPLATE_META категории "${category}".`);
}

function insertLabelEntry(lines, range, category, entryLine) {
    const lastCategoryLine = findLastCategoryLine(lines, range, category);
    const insertAt = lastCategoryLine >= 0 ? lastCategoryLine + 1 : range.closing;
    lines.splice(insertAt, 0, entryLine);
}

function insertMetaEntry(lines, range, category, entryLines) {
    const insertAt = findMetaInsertIndex(lines, range, category);
    lines.splice(insertAt, 0, ...entryLines);
}

function updateRegistryText(registryText, {
    category,
    templateKey,
    label,
    palette,
    isActive,
    isPremium,
    previewPath,
    isPairTemplate,
}) {
    const eol = detectEol(registryText);
    const lines = registryText.split(/\r?\n/);

    const labelRange = getSectionRange(
        lines,
        'const TEMPLATE_LABELS = {',
        'const DEFAULT_TEMPLATE_FEATURES = {',
        'TEMPLATE_LABELS'
    );

    if (hasKeyInRange(lines, labelRange, templateKey)) {
        fail(`В TEMPLATE_LABELS уже есть запись для "${templateKey}".`);
    }

    const metaRangeBeforeInsert = getSectionRange(
        lines,
        'const TEMPLATE_META = {',
        'function prettifyFileName',
        'TEMPLATE_META'
    );

    if (hasKeyInRange(lines, metaRangeBeforeInsert, templateKey)) {
        fail(`В TEMPLATE_META уже есть запись для "${templateKey}".`);
    }

    insertLabelEntry(
        lines,
        labelRange,
        category,
        `  ${singleQuote(templateKey)}: ${singleQuote(label)},`
    );

    const metaLines = [
        `  ${singleQuote(templateKey)}: {`,
        `    palette: ${singleQuote(palette)},`,
        `    tags: ['generated'],`,
        `    features: { pairNames: ${isPairTemplate ? 'true' : 'false'}, gallery: true, music: true, map: true },`,
        `    isActive: ${isActive ? 'true' : 'false'},`,
        `    isPremium: ${isPremium ? 'true' : 'false'},`,
        `    preview: ${singleQuote(previewPath)},`,
        '  },',
    ];

    const metaRangeAfterLabelInsert = getSectionRange(
        lines,
        'const TEMPLATE_META = {',
        'function prettifyFileName',
        'TEMPLATE_META'
    );

    insertMetaEntry(lines, metaRangeAfterLabelInsert, category, metaLines);

    return lines.join(eol);
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const category = getRequiredArg(args, 'category');
    const type = getRequiredArg(args, 'type');
    const label = getRequiredArg(args, 'label');
    const rawName = getRequiredArg(args, 'name');

    if (!VALID_CATEGORIES.has(category)) {
        fail(`Некорректная category: "${category}".`);
    }

    if (!VALID_TYPES.has(type)) {
        fail(`Некорректный type: "${type}". Разрешено только pair или single.`);
    }

    const palette = (args.palette || 'classic').trim();
    if (!VALID_PALETTES.has(palette)) {
        fail(`Некорректная palette: "${palette}".`);
    }

    const previewExt = (args.previewExt || 'jpg').trim().toLowerCase();
    if (!VALID_PREVIEW_EXTENSIONS.has(previewExt)) {
        fail(`Некорректный previewExt: "${previewExt}".`);
    }

    const name = normalizeName(rawName);
    const isPremium = Boolean(args.premium);
    const isActive = !args.inactive;
    const force = Boolean(args.force);

    const rootDir = process.cwd();
    const registryPath = path.join(rootDir, 'src', 'config', 'templates', 'templateRegistry.js');

    if (!fs.existsSync(registryPath)) {
        fail('Не найден templateRegistry.js. Запускайте скрипт из папки frontend.');
    }

    const starterPath = resolveStarterPath(rootDir, type);
    const templateDir = path.join(rootDir, 'src', 'templates', category);
    const targetHtmlPath = path.join(templateDir, `${name}.html`);
    const templateKey = `${category}/${name}.html`;
    const previewPath = `/previews/${category}/${name}.${previewExt}`;

    if (fs.existsSync(targetHtmlPath) && !force) {
        fail(`Файл шаблона уже существует: ${path.relative(rootDir, targetHtmlPath)}. Используйте --force, если нужно перезаписать HTML.`);
    }

    const starterHtml = fs.readFileSync(starterPath, 'utf8');
    const registryText = fs.readFileSync(registryPath, 'utf8');
    const nextRegistryText = updateRegistryText(registryText, {
        category,
        templateKey,
        label,
        palette,
        isActive,
        isPremium,
        previewPath,
        isPairTemplate: type === 'pair',
    });

    fs.mkdirSync(templateDir, { recursive: true });

    const hadExistingHtml = fs.existsSync(targetHtmlPath);
    const previousHtml = hadExistingHtml ? fs.readFileSync(targetHtmlPath, 'utf8') : null;

    try {
        fs.writeFileSync(targetHtmlPath, starterHtml, 'utf8');
        fs.writeFileSync(registryPath, nextRegistryText, 'utf8');
    } catch (error) {
        try {
            if (hadExistingHtml) {
                fs.writeFileSync(targetHtmlPath, previousHtml, 'utf8');
            } else if (fs.existsSync(targetHtmlPath)) {
                fs.unlinkSync(targetHtmlPath);
            }
        } catch (_) {
            // Ignore rollback errors for the template file and continue restoring registry.
        }

        try {
            fs.writeFileSync(registryPath, registryText, 'utf8');
        } catch (_) {
            // Ignore rollback errors here; the original failure is more important to surface.
        }

        fail(error instanceof Error ? error.message : String(error));
    }

    const htmlStatus = hadExistingHtml && force ? 'перезаписан' : 'создан';
    console.log(`Шаблон ${templateKey} ${htmlStatus}. Registry обновлён.`);
}

main();
