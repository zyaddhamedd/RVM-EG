'use server';

import { supabase } from '@/lib/supabase';
import { z } from 'zod';

import { applicationSchema } from '@/lib/schema';

export async function submitApplication(prevState: unknown, formData: FormData) {
  try {
    if (formData.get('honeypot')) {
      return { success: false, error: 'Invalid submission' };
    }

    const data = {
      full_name: formData.get('full_name'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      city: formData.get('city'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      instagram: formData.get('instagram'),
      tiktok: formData.get('tiktok'),
      facebook: formData.get('facebook') ? String(formData.get('facebook')) : undefined,
      has_ugc_experience: formData.get('has_ugc_experience') === 'true',
      portfolio_url: formData.get('portfolio_url') ? String(formData.get('portfolio_url')) : undefined,
      preferred_niches: formData.getAll('preferred_niches'),
      languages: formData.getAll('languages'),
      honeypot: formData.get('honeypot') ? String(formData.get('honeypot')) : undefined,
    };

    const validated = applicationSchema.parse(data);
    
    // Normalize phone and email
    const email = validated.email.toLowerCase().trim();
    const phone = validated.phone.replace(/[^0-9+]/g, '');

    const { error } = await supabase.from('creators').insert({
      full_name: validated.full_name,
      age: validated.age,
      gender: validated.gender,
      city: validated.city,
      phone,
      email,
      instagram: validated.instagram,
      tiktok: validated.tiktok,
      facebook: validated.facebook || null,
      has_ugc_experience: validated.has_ugc_experience,
      portfolio_url: validated.portfolio_url || null,
      preferred_niches: validated.preferred_niches,
      languages: validated.languages,
    });

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'An application with this email or phone already exists.' };
      }
      console.error('Supabase Insert Error:', error);
      return { success: false, error: error.message || 'Failed to submit application. Please try again.' };
    }

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError || (error && (error.errors || error.issues))) {
      const errList = error.errors || error.issues || [];
      if (errList.length > 0) {
        const firstError = errList[0];
        const fieldName = firstError.path ? firstError.path.join('.') : '';
        return { success: false, error: `${fieldName ? fieldName + ': ' : ''}${firstError.message}` };
      }
    }
    console.error('Unexpected Submit Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
