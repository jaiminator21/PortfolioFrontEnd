export const PROFESSIONAL_PROJECT_IDS = [
  'analytics-tiempo-real',
  'checkout-redesign',
  'monolito-microfrontends',
] as const;

export type ProfessionalProjectId = (typeof PROFESSIONAL_PROJECT_IDS)[number];

export interface ProfessionalProjectMeta {
  id: ProfessionalProjectId;
  tags: string[];
  imageUrl?: string;
}

export const professionalProjects: ProfessionalProjectMeta[] = [
  {
    id: 'analytics-tiempo-real',
    tags: ['React', 'TypeScript', 'WebSockets', 'D3.js', 'Redis'],
  },
  {
    id: 'checkout-redesign',
    tags: ['Next.js', 'Node.js', 'Stripe API', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'monolito-microfrontends',
    tags: ['React', 'Module Federation', 'Webpack 5', 'Docker', 'GitHub Actions'],
  },
];

export function getProjectById(id: string): ProfessionalProjectMeta | undefined {
  return professionalProjects.find((p) => p.id === id);
}
