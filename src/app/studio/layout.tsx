import { SanityLive } from '@/sanity/lib/live';

/**
 * The Studio sits outside `[locale]`, so it needs its own root layout: it is a
 * full-screen app that must not inherit the site's Header, Footer, fonts or
 * i18n provider.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        {/*
         * `sanityFetch` caches with no expiry and relies on <SanityLive /> to
         * revalidate on publish — but only while some page is open to hear the
         * event. The Studio is always open when something is published, so
         * listening here means every publish refreshes the site's cache, even
         * with no visitors on it.
         */}
        <SanityLive />
      </body>
    </html>
  );
}
