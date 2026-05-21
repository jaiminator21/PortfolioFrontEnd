import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getProjectById, professionalProjects } from '@/data/professionalProjects';
import { routing } from '@/i18n/routing';
import ProjectDetailView from './ProjectDetailView';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    professionalProjects.map((p) => ({ locale, id: p.id }))
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const project = getProjectById(id);
  if (!project) {
    notFound();
  }

  return <ProjectDetailView projectId={project.id} tags={project.tags} imageUrl={project.imageUrl} />;
}
