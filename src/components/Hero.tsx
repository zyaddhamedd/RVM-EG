'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
  const handleScroll = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Subtle background gradient or noise can go here, but kept minimal per spec */}
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="z-10 flex flex-col items-center text-center max-w-4xl w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <Image 
            src="/assets/logorvm.png" 
            alt="RVM EG Logo" 
            width={120} 
            height={60} 
            className="h-auto w-auto object-contain"
            priority
          />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8"
        >
          Become an <span className="text-[#CCFF00]">RVM</span> Creator
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-3xl text-neutral-400 font-light mb-12 max-w-2xl"
        >
          Create authentic content.<br />
          Work with leading brands.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScroll}
          className="bg-[#CCFF00] text-black px-10 py-5 rounded-full text-lg font-medium hover:bg-white transition-colors duration-300"
        >
          Apply Now
        </motion.button>
      </div>
    </section>
  );
}
