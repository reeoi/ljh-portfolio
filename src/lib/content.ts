import siteData from '@/content/site.json';

export type WorkType = 'video' | 'image' | 'exe';

export interface Work {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: WorkType;
  cover: string;
  tags: string[];
  downloadUrl?: string;
  liveUrl?: string;
}

export interface Skill {
  name: string;
  level: number;
  color: 'sakura' | 'electric' | 'neon';
}

export interface Service {
  no: string;
  icon: string;
  title: string;
  zh: string;
  desc: string;
}

export interface Stat  { k: string; v: string; zh: string; }
export interface Timeline { year: string; title: string; desc: string; icon: string; }

export interface SiteContent {
  personal: {
    name: string; nameEn: string; title: string; major: string; gradYear: string;
    location: string; email: string; phone: string;
    github: string; githubUrl: string;
    resumeUrl: string; noviUrl: string; siteUrl: string;
  };
  home: {
    heroTitle: string; heroSubtitle: string; heroTagline: string;
    services: Service[];
    ctaTitle: string; ctaDesc: string;
  };
  about: {
    subtitle: string;
    intro: string[];
    stats: Stat[];
    timeline: Timeline[];
    preferred: string[];
  };
  skills: Skill[];
  categories: string[];
  works: Work[];
}

export const site = siteData as unknown as SiteContent;

export const WORKS      = site.works;
export const SKILLS     = site.skills;
export const CATEGORIES = site.categories;
export const PERSONAL   = site.personal;
export const HOME       = site.home;
export const ABOUT      = site.about;

export default site;