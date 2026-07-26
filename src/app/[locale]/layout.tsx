import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { JsonLd } from '@/components/sanity/JsonLd';
import { routing } from '@/i18n/routing';
import { personSchema } from '@/lib/jsonld';
import { SITE_URL } from '@/lib/metadata';
import {
  getCertifications,
  getExperience,
  getProfile,
  getProfileForMetadata,
  getSkills,
} from '@/sanity/fetch';
import { SanityLive } from '@/sanity/lib/live';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const profile = await getProfileForMetadata(locale);

  const siteName = profile?.fullName
    ? `${profile.fullName} — ${profile.headline ?? ''}`.trim().replace(/—\s*$/, '').trim()
    : t('siteName');

  return {
    // metadataBase lets Next resolve the relative URLs in OG tags and sitemaps.
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${profile?.fullName ?? t('siteName')}`,
    },
    description: profile?.shortBio ?? undefined,
    authors: profile?.fullName ? [{ name: profile.fullName, url: SITE_URL }] : undefined,
    creator: profile?.fullName,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  /**
   * The Person graph lives in the layout so it appears on every page: search
   * engines consolidate the identity across the whole site rather than seeing a
   * separate entity per route.
   */
  const [profile, experience, skills, certifications] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getSkills(locale),
    getCertifications(locale),
  ]);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
          <ThemeProvider>
            <Header profile={profile} />
            {children}
            <Footer profile={profile} />
          </ThemeProvider>
        </NextIntlClientProvider>

        {profile ? (
          <JsonLd
            data={personSchema({
              profile,
              experience,
              skills,
              certifications,
              siteUrl: SITE_URL,
            })}
          />
        ) : null}

        {/* Subscribes to Sanity so published edits appear without a redeploy. */}
        <SanityLive />
      </body>
    </html>
  );
}
