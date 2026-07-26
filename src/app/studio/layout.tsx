/**
 * The Studio sits outside `[locale]`, so it needs its own root layout: it is a
 * full-screen app that must not inherit the site's Header, Footer, fonts or
 * i18n provider.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
