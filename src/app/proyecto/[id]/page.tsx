import { notFound } from 'next/navigation';
import { getProjectById, professionalProjects } from '@/data/professionalProjects';
import ProjectDetailView from './ProjectDetailView';

export function generateStaticParams() {
  return professionalProjects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}
