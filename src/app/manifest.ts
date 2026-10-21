import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ResumeScore — AI Resume & Job Match Intelligence',
    short_name: 'ResumeScore',
    description:
      'Match your resume to the job before you apply. Deterministic 7-pillar scoring and job match analysis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
