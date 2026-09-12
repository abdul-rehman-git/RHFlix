import { d as defineEventHandler, s as setResponseHeader } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const sitemap_xml = defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rhflix.rehmanwebs.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rhflix.rehmanwebs.com/movies</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rhflix.rehmanwebs.com/tv</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rhflix.rehmanwebs.com/categories</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rhflix.rehmanwebs.com/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://rhflix.rehmanwebs.com/my-list</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
