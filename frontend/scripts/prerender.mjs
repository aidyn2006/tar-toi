import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getInitialLangForPathname } from '../src/seo/publicRoutes.js';
import { prerenderRoutes } from '../src/seo/routeManifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const clientDistDir = path.join(projectRoot, 'dist');
const serverDistDir = path.join(projectRoot, 'dist-ssr');
const spaShellFileName = 'app-shell.html';

const getServerEntryPath = async () => {
    const files = await fs.readdir(serverDistDir);
    const entry = files.find((file) => file.startsWith('entry-server.'));

    if (!entry) {
        throw new Error(`SSR bundle not found in ${serverDistDir}`);
    }

    return path.join(serverDistDir, entry);
};

const buildOpenTag = (tagName, attributesString, fallback) => {
    const attrs = attributesString?.trim();
    return attrs ? `<${tagName} ${attrs}>` : fallback;
};

const buildHeadMarkup = (helmet) => {
    if (!helmet) {
        return '';
    }

    return [
        helmet.title?.toString() || '',
        helmet.priority?.toString() || '',
        helmet.meta?.toString() || '',
        helmet.link?.toString() || '',
        helmet.script?.toString() || '',
    ].filter(Boolean).join('\n');
};

const extractDocumentTags = (html) => {
    const tags = [];
    const pattern = /(<title[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*(?:rel="canonical"|rel="preload"|rel="alternate")[^>]*>|<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>)/gi;
    const cleanedHtml = html.replace(pattern, (match) => {
        tags.push(match);
        return '';
    }).trim();

    return {
        cleanedHtml,
        headTags: tags.join('\n'),
    };
};

const renderStaticHtml = (template, appHtml, helmet, route) => {
    const routeLang = getInitialLangForPathname(route);
    const htmlTag = buildOpenTag('html', helmet?.htmlAttributes?.toString(), `<html lang="${routeLang}">`);
    const bodyTag = buildOpenTag('body', helmet?.bodyAttributes?.toString(), '<body>');
    const extracted = extractDocumentTags(appHtml);
    const headMarkup = [buildHeadMarkup(helmet), extracted.headTags].filter(Boolean).join('\n');

    return template
        .replace(/<html[^>]*>/i, htmlTag)
        .replace(/<body[^>]*>/i, bodyTag)
        .replace(
            /<!-- seo-head:start -->[\s\S]*?<!-- seo-head:end -->/i,
            `<!-- seo-head:start -->\n${headMarkup}\n    <!-- seo-head:end -->`
        )
        .replace('<div id="root"></div>', `<div id="root">${extracted.cleanedHtml}</div>`);
};

const writeRouteHtml = async (route, html) => {
    const outputPath = route === '/'
        ? path.join(clientDistDir, 'index.html')
        : path.join(clientDistDir, route.replace(/^\//, ''), 'index.html');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, 'utf8');
};

const preserveSpaShell = async (template) => {
    const spaShellPath = path.join(clientDistDir, spaShellFileName);
    await fs.writeFile(spaShellPath, template, 'utf8');
};

const main = async () => {
    const template = await fs.readFile(path.join(clientDistDir, 'index.html'), 'utf8');
    await preserveSpaShell(template);
    const serverEntryPath = await getServerEntryPath();
    const { render } = await import(pathToFileURL(serverEntryPath).href);

    for (const route of prerenderRoutes) {
        const { appHtml, helmet } = render(route, { initialLang: getInitialLangForPathname(route) });
        const html = renderStaticHtml(template, appHtml, helmet, route);
        await writeRouteHtml(route, html);
    }

    console.log(`Prerendered ${prerenderRoutes.length} routes into ${clientDistDir}`);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
