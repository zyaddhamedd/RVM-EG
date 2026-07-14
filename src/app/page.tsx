import { Hero } from '@/components/Hero';
import { WhyJoin } from '@/components/WhyJoin';
import { WhoWeAreLookingFor } from '@/components/WhoWeAreLookingFor';
import { ApplicationForm } from '@/components/ApplicationForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <WhyJoin />
      <WhoWeAreLookingFor />
      <ApplicationForm />
      
      <footer className="py-12 text-center border-t border-neutral-900 bg-black text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} RVM EG. All rights reserved.</p>
      </footer>
    </main>
  );
}
