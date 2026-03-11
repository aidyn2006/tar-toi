#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../src/templates');
const themesPath = path.join(root, 'themes.json');
const layouts = {
  single: path.join(root, 'common/layout-single.html'),
  couple: path.join(root, 'common/layout-couple.html'),
};

function load(file) {
  return fs.readFileSync(file, 'utf8');
}

function loadPartials() {
  const dir = path.join(root, 'common/partials');
  const entries = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  if (!entries.length) return null;
  const map = {};
  entries.forEach(f => {
    const key = path.basename(f, '.html');
    map[key] = load(path.join(dir, f));
  });
  return map;
}

function tokensToCss(tokens = {}) {
  const map = {
    bgPage: '--bg-page',
    bg: '--bg',
    card: '--card',
    accent: '--accent',
    accentSoft: '--accent-soft',
    text: '--text',
    muted: '--muted',
    border: '--border',
    shadow: '--shadow',
    fontHead: '--font-head',
    fontBody: '--font-body',
    bgPattern: '--bg-pattern',
  };
  const lines = Object.entries(map)
    .filter(([k]) => tokens[k])
    .map(([k, cssVar]) => `  ${cssVar}: ${tokens[k]};`);
  return lines.join('\n');
}

function buildThemeStyle(entry) {
  const cssVars = tokensToCss(entry.tokens || {});
  let extra = '';
  if (entry.ornaments?.hero) {
    extra += `.hero::after { content: ''; display: block; width: 64px; height: 64px; margin: 12px auto 0; background: url('${entry.ornaments.hero}') center/contain no-repeat; opacity: 0.6; }\n`;
  }
  const style = `<style>\n:root {\n${cssVars}\n}\n${extra}</style>`;
  return style;
}

function buildDecorations(entry) {
  const border = entry.ornaments?.border;
  if (!border) return '';
  const safe = border.replace(/"/g, '&quot;');
  return [
    `<div class="border-strip left" style="background-image:url('${safe}')"></div>`,
    `<div class="border-strip right" style="background-image:url('${safe}')"></div>`
  ].join('\n');
}

function render(entry, partials) {
  const layoutPath = layouts[entry.layout];
  if (!layoutPath) throw new Error(`Unknown layout ${entry.layout}`);
  let html = load(layoutPath);

  const title = entry.title || `${entry.category} invitation`;
  const themeStyle = buildThemeStyle(entry);
  const decorations = buildDecorations(entry);
  const tplKey = `${entry.category}/${entry.variant}.html`;

  const heroPartial = entry.layout === 'couple' ? (partials['hero-couple'] || '') : (partials.hero || '');
  const replacements = {
    hero: heroPartial,
    info: partials.info,
    gallery: partials.gallery,
    countdown: partials.countdown,
    calendar: partials.calendar,
    rsvp: partials.rsvp,
    footer: partials.footer,
  };

  Object.entries(replacements).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value || '');
  });

  let headHtml = (partials.head || '')
    .replace(/{{\s*TITLE\s*}}/g, title)
    .replace(/{{\s*THEME_STYLE\s*}}/g, themeStyle);
  html = html.replace(/{{\s*head\s*}}/g, headHtml);

  html = html.replace(/{{\s*DECORATIONS\s*}}/g, decorations);
  html = html.replace(/{{\s*TEMPLATE_KEY\s*}}/g, tplKey);

  return html;
}

function main() {
  if (!fs.existsSync(themesPath)) {
    console.error('themes.json not found:', themesPath);
    process.exit(1);
  }
  const themes = JSON.parse(load(themesPath));
  const partials = loadPartials();
  if (!partials) {
    console.log('No HTML partials found. HTML template generation skipped (PHP system in use).');
    process.exit(0);
  }
  let built = 0;

  themes.forEach(entry => {
    try {
      const html = render(entry, partials);
      const outDir = path.join(root, entry.category);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${entry.variant}.html`);
      fs.writeFileSync(outPath, html, 'utf8');
      built += 1;
      console.log('✓ built', path.relative(process.cwd(), outPath));
    } catch (err) {
      console.error('✗ failed', entry.category, entry.variant, err.message);
    }
  });

  console.log(`Done. ${built} template(s) generated.`);
}

if (require.main === module) main();
