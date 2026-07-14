'use client';

import { useActionState, useEffect } from 'react';
import { authenticate } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(authenticate, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full border border-neutral-900 bg-neutral-950 p-8 rounded-2xl">
        <div className="flex justify-center mb-8">
          <Image src="/assets/logorvm.png" alt="RVM EG Logo" width={80} height={40} className="h-auto w-auto" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-white mb-6 text-center">Admin Access</h1>
        
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#CCFF00] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded border border-red-900/50 bg-red-950/20 text-red-400 text-sm text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black px-4 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
