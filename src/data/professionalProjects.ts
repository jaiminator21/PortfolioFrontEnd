export interface ProfessionalProject {
  id: string;
  title: string;
  context: string;
  problem: string;
  role: string;
  solution: string;
  result: string;
  tags: string[];
  imageUrl?: string;
}

export const professionalProjects: ProfessionalProject[] = [
  {
    id: 'analytics-tiempo-real',
    title: 'Sistema de Analíticas en Tiempo Real',
    context:
      'Plataforma SaaS B2B con +10k usuarios empresariales necesitaba mejorar su sistema de reporting',
    problem:
      'Los usuarios tardaban hasta 5 minutos en obtener reports actualizados, generando fricción y abandono de la feature',
    role: 'Tech Lead Frontend — Coordinación con backend y diseño de arquitectura cliente',
    solution:
      'Implementación de dashboard con actualizaciones en tiempo real usando WebSockets, optimización de queries y virtualización de listas grandes',
    result:
      'Tiempo de carga reducido a <2s. Engagement con la feature incrementó 180%. Procesamiento de hasta 100k datapoints sin lag',
    tags: ['React', 'TypeScript', 'WebSockets', 'D3.js', 'Redis'],
  },
  {
    id: 'checkout-redesign',
    title: 'Rediseño de Checkout Flow',
    context: 'E-commerce de retail con abandono del 68% en proceso de compra',
    problem:
      'Flujo de pago complejo con 7 pasos, múltiples validaciones lentas y UX confusa en mobile',
    role: 'Full Stack Developer — Desarrollo end-to-end del nuevo flujo',
    solution:
      'Simplificación a 3 pasos, validaciones asíncronas optimizadas, persistencia de datos en sesión, diseño mobile-first y integración con Stripe',
    result:
      'Abandono reducido al 32%. Conversión aumentó 45%. Tiempo promedio de compra de 8min a 3min. +$2M adicionales en revenue anual',
    tags: ['Next.js', 'Node.js', 'Stripe API', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'monolito-microfrontends',
    title: 'Migración de Monolito a Microfrontends',
    context: 'Aplicación legacy de 5 años con codebase de +200k líneas difícil de mantener',
    problem:
      'Deploys arriesgados, equipos bloqueados entre sí, testing lento, onboarding de nuevos devs de 3+ semanas',
    role: 'Senior Developer — Arquitectura y migración incremental',
    solution:
      'Implementación de Module Federation (Webpack 5), CI/CD independiente por módulo, migración progresiva sin downtime',
    result:
      'Tiempo de deploy de 2h a 15min. Velocidad de features +60%. Onboarding reducido a 1 semana. 0 incidents críticos durante migración',
    tags: ['React', 'Module Federation', 'Webpack 5', 'Docker', 'GitHub Actions'],
  },
];

export function getProjectById(id: string) {
  return professionalProjects.find((p) => p.id === id);
}
