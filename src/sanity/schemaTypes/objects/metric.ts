import { TrendUpwardIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * A quantified outcome ("checkout abandonment 68% -> 32%").
 *
 * Recruiters scan for numbers, so these render prominently — which is exactly
 * why `verified` exists: the frontend only renders metrics marked verified.
 * An unverified metric stays editable in the Studio and invisible in public.
 */
export const metricType = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'What was measured',
      description: 'Short and concrete: "Deploy time", "Conversion rate", "Load time".',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      description: 'The headline number: "-45%", "<2s", "2h -> 15min".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'direction',
      title: 'Direction',
      description: 'Drives the arrow and colour. "Improvement" covers both up and down.',
      type: 'string',
      options: {
        list: [
          { title: 'Improvement', value: 'improvement' },
          { title: 'Neutral / scale', value: 'neutral' },
        ],
        layout: 'radio',
      },
      initialValue: 'improvement',
    }),
    defineField({
      name: 'context',
      title: 'How it was measured',
      description:
        'Optional but valuable. "Measured over 3 months in GA4" turns a claim into evidence a recruiter can ask about.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'verified',
      title: 'Verified — safe to publish',
      description:
        'Only tick this when you can defend the number in an interview. Unverified metrics are never rendered on the site.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: 'label.0.value', value: 'value', verified: 'verified' },
    prepare: ({ label, value, verified }) => ({
      title: `${value ?? '—'} · ${label ?? 'Untitled metric'}`,
      subtitle: verified ? 'Verified — published' : 'Unverified — hidden on the site',
    }),
  },
});
