import { z } from 'zod';

const forgivingUrlRegex = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name').max(100),
  age: z.coerce.number({ message: 'Enter a valid age' }).min(16, 'You must be at least 16 to apply').max(100, 'Enter a valid age'),
  gender: z.enum(['male', 'female'], { message: 'Select your gender' }),
  city: z.string().trim().min(2, 'Enter your city').max(100),
  phone: z.string().trim().min(8, 'Add the country code to your phone number').max(20, 'Phone number is too long'),
  email: z.string().trim().email('Enter a valid email address').max(100),
  instagram: z.string().trim().min(1, 'Enter a complete Instagram profile URL or handle').refine(val => val.startsWith('@') || forgivingUrlRegex.test(val), 'Enter a complete Instagram profile URL or handle'),
  tiktok: z.string().trim().min(1, 'Enter a complete TikTok profile URL or handle').refine(val => val.startsWith('@') || forgivingUrlRegex.test(val), 'Enter a complete TikTok profile URL or handle'),
  facebook: z.string().trim().max(100).optional().refine(val => !val || val.startsWith('@') || forgivingUrlRegex.test(val), 'Enter a valid URL or handle'),
  has_ugc_experience: z.coerce.boolean({ message: 'Select if you have UGC experience' }),
  portfolio_url: z.string().trim().max(200).optional().refine(val => !val || forgivingUrlRegex.test(val), 'Enter a valid URL'),
  preferred_niches: z.array(z.string(), { message: 'Select at least one preferred niche' }).min(1, 'Select at least one preferred niche'),
  languages: z.array(z.string(), { message: 'Select at least one language' }).min(1, 'Select at least one language'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});
