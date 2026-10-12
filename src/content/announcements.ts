export interface Announcement {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  active: boolean;
}

export const announcements: Announcement[] = [
  {
    id: 'genesis-2026-launch',
    message: 'Registrations opening soon! Follow our socials for latest track reveals.',
    linkText: 'SEE FAQS',
    linkUrl: '/faqs/#q=how-do-i-register',
    active: true,
  },
];
