import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import CertificationsCTA from '@/components/CertificationsCTA';
import { buildMetadata } from '@/lib/metadata';
import {
  getCertificationStats,
  getExperience,
  getPage,
  getPageForMetadata,
  getProfile,
  getProfileForMetadata,
  getSkills,
} from '@/sanity/fetch';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [page, profile] = await Promise.all([
    getPageForMetadata(locale, 'home'),
    getProfileForMetadata(locale),
  ]);

  return buildMetadata({
    // The homepage is a profile page: fall back to the person, not the page copy.
    seo: page?.seo ?? profile?.seo,
    locale,
    href: '/',
    siteName: profile?.fullName ?? '',
    type: 'profile',
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, page, experience, skills, certStats] = await Promise.all([
    getProfile(locale),
    getPage(locale, 'home'),
    getExperience(locale),
    getSkills(locale),
    getCertificationStats(),
  ]);

  // Without a profile there is nothing to show; the Studio has not been filled in.
  if (!profile) return null;

  return (
    <>
      <Hero profile={profile} page={page} locale={locale} />
      <About profile={profile} />
      <Experience items={experience} />
      <Skills skills={skills} />
      <CertificationsCTA stats={certStats} />
      <Contact profile={profile} locale={locale} />
    </>
  );
}
