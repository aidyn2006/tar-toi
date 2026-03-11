/** Tailwind for static templates (purged to templates HTML) */
module.exports = {
  content: [
    './src/templates/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ['Playfair Display', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        alt: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#f4a261',
        accentSoft: '#ffe3d0',
        textmain: '#4a4542',
        muted: '#6d635e',
        card: '#fff9f5',
        border: 'rgba(204,109,82,0.2)',
      },
      boxShadow: {
        card: '0 10px 28px rgba(0,0,0,0.08)',
        btn: '0 6px 16px rgba(0,0,0,0.1)',
      },
      maxWidth: {
        invite: '480px',
      },
      borderRadius: {
        soft: '18px',
      },
    },
  },
  safelist: [
    // common utility buckets we know we'll use in dynamic HTML
    'grid', 'flex', 'items-center', 'justify-center', 'justify-between', 'gap-2', 'gap-3', 'gap-4',
    'text-center', 'text-sm', 'text-base', 'text-lg', 'font-bold', 'font-semibold',
    'rounded-xl', 'rounded-2xl', 'border', 'border-dashed', 'border-solid',
    'p-3', 'p-4', 'p-5', 'px-4', 'py-3', 'py-4', 'mt-2', 'mb-2', 'mt-3', 'mb-3',
    'w-full', 'h-full', 'min-h-screen', 'shadow', 'shadow-card'
  ],
  corePlugins: {
    preflight: false, // keep our own base reset
  },
};
