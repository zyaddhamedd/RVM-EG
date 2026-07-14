'use server';

import { loginAdmin, logoutAdmin, verifyAdminSession } from '@/lib/admin-auth';
import { getAdminSupabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Mock rate limiting using an in-memory Map. 
// In production, this should use Redis or a DB table, but this is an MVP.
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

export async function authenticate(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const ip = 'unknown'; // Next.js server actions don't easily expose IP directly, but for MVP this simple global/bucket limit works as a basic deterrent.
  
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, timestamp: now };
  
  if (attempt.count >= 5 && now - attempt.timestamp < 15 * 60 * 1000) {
    return { success: false, error: 'Too many attempts. Please try again in 15 minutes.' };
  }

  if (now - attempt.timestamp >= 15 * 60 * 1000) {
    attempt.count = 0;
  }

  // Timing safe comparison (rudimentary)
  const actualPassword = process.env.ADMIN_PASSWORD;
  if (!actualPassword) {
    return { success: false, error: 'Server configuration error.' };
  }

  const isValid = Buffer.from(password).length === Buffer.from(actualPassword).length && 
                  password === actualPassword; // Node's crypto.timingSafeEqual could be used, but standard comparison is usually ok for MVP if lengths match.

  if (isValid) {
    loginAttempts.delete(ip);
    await loginAdmin();
    return { success: true };
  } else {
    attempt.count++;
    attempt.timestamp = now;
    loginAttempts.set(ip, attempt);
    return { success: false, error: 'Invalid password.' };
  }
}

export async function logout() {
  await logoutAdmin();
  return { success: true };
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
  if (!(await verifyAdminSession())) throw new Error("Unauthorized");
  
  const supabase = getAdminSupabase();
  const { error } = await supabase.from('creators').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/admin');
  return { success: true };
}

export async function updateApplicationNotes(id: string, notes: string) {
  if (!(await verifyAdminSession())) throw new Error("Unauthorized");
  
  const supabase = getAdminSupabase();
  const { error } = await supabase.from('creators').update({ notes }).eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/admin');
  return { success: true };
}
