import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/teams', '/players', '/matches', '/tournament', '/maps', '/veto'];
  for (const [collection, route] of [['teams', 'teams'], ['players', 'players'], ['matches', 'matches'], ['tournaments', 'tournament'], ['maps', 'maps']] as const) {
    for (const entry of await getCollection(collection)) paths.push(`/${route}/${entry.id}`);
  }
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(new URL(path, site).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
