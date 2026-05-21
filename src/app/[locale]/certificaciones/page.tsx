import { setRequestLocale } from 'next-intl/server';
import Certifications from '@/components/Certifications';
import styles from '@/styles/SecondaryPage.module.css';

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.wrapper}>
      <Certifications />
    </div>
  );
}
