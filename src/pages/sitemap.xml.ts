import type { APIRoute } from 'astro';

const SITE = 'https://linklasso.fodylabs.com';
const pages = ['/', '/linkclump-alternative/', '/privacy/', '/terms/'];

export const GET: APIRoute = () => {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
