import { setRequestLocale } from 'next-intl/server';
import ProfessionalProjects from '@/components/ProfessionalProjects';
import styles from '@/styles/SecondaryPage.module.css';

export default async function ProfessionalProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.wrapper}>
      <ProfessionalProjects />
    </div>
  );
}
