import { z } from 'zod';

// Regex for 10-digit Indian mobile numbers (optional +91 prefix, starts with 6, 7, 8, or 9)
const INDIAN_MOBILE_REGEX = /^(?:\+91[\-\s]?)?[6-9]\d{9}$/;

// Regex for international or secondary phone numbers (10-15 digits)
const GENERAL_PHONE_REGEX = /^\+?[0-9\s\-]{10,15}$/;

export const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Member name must be at least 2 characters' })
    .max(50, { message: 'Member name must not exceed 50 characters' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Valid member email is required' }),
  phone: z
    .string()
    .trim()
    .regex(GENERAL_PHONE_REGEX, { message: 'Enter a valid phone number (10-15 digits)' })
    .optional()
    .or(z.literal('')),
});

export const registrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(2, { message: 'Team name must be at least 2 characters' })
      .max(40, { message: 'Team name must not exceed 40 characters' }),
    track: z.enum(['gaming', 'vr'], {
      errorMap: () => ({ message: 'Select either Gaming Championship or VR Track' }),
    }),
    college: z
      .string()
      .trim()
      .min(2, { message: 'College / Institute name must be at least 2 characters' })
      .max(100, { message: 'College / Institute name cannot exceed 100 characters' }),
    city: z
      .string()
      .trim()
      .min(2, { message: 'City must be at least 2 characters' })
      .max(50, { message: 'City cannot exceed 50 characters' }),
    leaderName: z
      .string()
      .trim()
      .min(2, { message: 'Leader name must be at least 2 characters' })
      .max(50, { message: 'Leader name must not exceed 50 characters' }),
    leaderEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Valid leader email is required' }),
    leaderPhone: z
      .string()
      .trim()
      .regex(INDIAN_MOBILE_REGEX, { message: 'Enter a valid 10-digit Indian mobile number' }),
    members: z
      .array(memberSchema)
      .max(3, { message: 'Maximum 3 additional team members allowed (squad cap is 4 players)' })
      .default([]),
    consent: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the tournament rules and privacy policy',
      }),
    }),
    privacyVersion: z.string().default('1.0'),
    turnstileToken: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Check for duplicate emails between leader and members, or among members
    const emailsSeen = new Set<string>();
    emailsSeen.add(data.leaderEmail.toLowerCase());

    data.members.forEach((member, index) => {
      const emailLower = member.email.toLowerCase();
      if (emailsSeen.has(emailLower)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate email detected: ${member.email} is already used by another team member or the leader`,
          path: ['members', index, 'email'],
        });
      } else {
        emailsSeen.add(emailLower);
      }
    });
  });

export type TeamMember = z.infer<typeof memberSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;

export interface RegistrationRecord {
  id: string;
  team_id: string;
  edition: string;
  team_name: string;
  track: 'gaming' | 'vr';
  college: string;
  city: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  members: TeamMember[];
  consent: boolean;
  consent_timestamp: string;
  privacy_version: string;
  created_at: string;
}
