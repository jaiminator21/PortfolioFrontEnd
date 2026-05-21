import { setRequestLocale, getTranslations } from 'next-intl/server';
import Minesweeper from '@/components/Minesweeper/Minesweeper';

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Minesweeper');

  return (
    <main className="min-h-screen py-20 flex flex-col items-center bg-background">
      <h1 className="text-4xl font-bold mb-10">{t('title')}</h1>
      <Minesweeper rows={10} cols={10} mines={15} />
    </main>
  );
}
