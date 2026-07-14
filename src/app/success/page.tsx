import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4 text-center">
      <div className="max-w-md w-full border border-neutral-900 bg-neutral-950 p-12 rounded-3xl">
        <CheckCircle2 className="w-16 h-16 text-[#CCFF00] mx-auto mb-8" />
        
        <h1 className="text-3xl font-medium tracking-tight text-white mb-4">Application Received.</h1>
        
        <div className="text-neutral-400 space-y-4 font-light">
          <p>Thank you for applying.</p>
          <p>Our team reviews every application manually.</p>
          <p>Selected creators will be contacted soon.</p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900">
          <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
