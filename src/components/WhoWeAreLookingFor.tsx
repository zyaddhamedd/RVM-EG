'use client';

import { motion } from 'framer-motion';

const niches = [
  "Beauty",
  "Skincare",
  "Fashion",
  "Lifestyle",
  "E-commerce",
  "Men’s Grooming"
];

export function WhoWeAreLookingFor() {
  return (
    <section className="py-20 md:py-32 bg-black border-t border-neutral-900 overflow-hidden">
      <div className="relative w-full py-6 md:py-8 mb-16 md:mb-24">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#CCFF00] origin-left z-0"
        />
        <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-2 relative z-20">Who We&apos;re Looking For</h2>
            <p className="text-neutral-800 text-lg md:text-xl font-light max-w-2xl mx-auto relative z-20">
              We partner with creators across a variety of niches.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {niches.map((niche, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative px-8 py-4 rounded-full border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm text-neutral-300 text-lg md:text-xl font-medium overflow-hidden transition-all duration-500 hover:border-[#CCFF00]/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(204,255,0,0.1)] cursor-default"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/0 via-[#CCFF00]/[0.05] to-[#CCFF00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <span className="relative z-10 group-hover:text-[#CCFF00] transition-colors duration-500">
                {niche}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
