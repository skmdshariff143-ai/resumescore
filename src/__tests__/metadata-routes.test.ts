import { describe, it, expect } from 'vitest';
import sitemap from '../app/sitemap';
import robots from '../app/robots';
import manifest from '../app/manifest';
import { metadata as termsMetadata } from '../app/terms/page';
import { metadata as privacyMetadata } from '../app/privacy/page';
import { metadata as rootMetadata } from '../app/layout';

describe('Metadata and SEO Routes', () => {
  it('sitemap includes all public canonical routes', () => {
    const map = sitemap();
    const urls = map.map(item => item.url);

    expect(urls).toContain('https://resumescore-phi.vercel.app');
    expect(urls).toContain('https://resumescore-phi.vercel.app/analyze');
    expect(urls).toContain('https://resumescore-phi.vercel.app/privacy');
    expect(urls).toContain('https://resumescore-phi.vercel.app/terms');
    expect(urls).not.toContain('https://resumescore-phi.vercel.app/history');
    expect(urls).not.toContain('https://resumescore-phi.vercel.app/api');
  });

  it('robots restricts private and api routes', () => {
    const rob = robots();
    expect(rob.sitemap).toBe('https://resumescore-phi.vercel.app/sitemap.xml');
    const rules = Array.isArray(rob.rules) ? rob.rules[0] : rob.rules;
    expect(rules.disallow).toContain('/api/');
    expect(rules.disallow).toContain('/history');
    expect(rules.allow).toBe('/');
  });

  it('manifest returns standard web app metadata', () => {
    const pwa = manifest();
    expect(pwa.name).toBe('ResumeScore — AI Resume & Job Match Intelligence');
    expect(pwa.short_name).toBe('ResumeScore');
    expect(pwa.start_url).toBe('/');
    expect(pwa.display).toBe('standalone');
    expect(pwa.icons?.[0]?.src).toBe('/favicon.ico');
  });

  it('terms metadata defines canonical and title', () => {
    expect(termsMetadata.title).toContain('Terms of Service');
    expect(termsMetadata.alternates?.canonical).toBe('/terms');
  });

  it('privacy metadata defines canonical and title', () => {
    expect(privacyMetadata.title).toContain('Privacy Policy');
    expect(privacyMetadata.alternates?.canonical).toBe('/privacy');
  });

  it('root layout metadata defines canonical, OpenGraph, and Twitter tags', () => {
    expect(rootMetadata.alternates?.canonical).toBe('/');
    expect(rootMetadata.openGraph?.images).toBeDefined();
    expect((rootMetadata.twitter as { card?: string })?.card).toBe('summary_large_image');
  });
});
