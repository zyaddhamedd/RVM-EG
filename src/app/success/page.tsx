'use client';

import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen relative flex items-center justify-center bg-black px-4 py-20 text-center overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#CCFF00]/10 rounded-full blur-[100px] md:blur-[120px]"
          />
        </div>

        {/* Floating light streaks (particles) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: "100%" }}
              animate={{ 
                opacity: [0, 0.3, 0],
                y: ["100%", "-20%"],
              }}
              transition={{ 
                duration: Math.random() * 4 + 6,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 3
              }}
              className="absolute bottom-0 w-[2px] h-24 bg-gradient-to-t from-transparent via-[#CCFF00]/30 to-transparent blur-sm"
              style={{ left: `${15 + Math.random() * 70}%` }}
            />
          ))}
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-lg w-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_0_50px_rgba(204,255,0,0.03)]"
        >
          {/* Animated Icon Container */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 flex items-center justify-center">
            {/* Pulsing ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 rounded-full border border-[#CCFF00]"
            />
            {/* Solid background ring */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20"
            />
            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <Check className="w-10 h-10 md:w-12 md:h-12 text-[#CCFF00]" strokeWidth={3} />
            </motion.div>
          </div>
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">Application Submitted.</h1>
            
            <div className="text-neutral-400 space-y-4 font-light text-[1.05rem] leading-relaxed">
              <p className="text-white font-normal text-lg">Great! Your application is officially in our hands.</p>
              <p>Our team manually reviews every creator's profile to discover the best talent for our upcoming brand campaigns.</p>
              <p>We are excited to look through your work. If your vibe matches what we're looking for, we'll reach out with the next steps.</p>
              <p>Keep creating amazing content!</p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-12 pt-8 border-t border-neutral-900/50"
          >
            <Link 
              href="/" 
              className="group relative flex items-center justify-center w-full bg-[#CCFF00] text-black px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(204,255,0,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Return to Homepage
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
