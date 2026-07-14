'use client';

import { motion } from 'framer-motion';
import { BadgeDollarSign, CalendarDays, Users, Handshake } from 'lucide-react';

const reasons = [
  {
    title: "Paid Collaborations",
    description: "Get fairly compensated for the authentic content you produce for top-tier brands.",
    icon: BadgeDollarSign
  },
  {
    title: "Flexible Projects",
    description: "Work on your own terms. Choose the campaigns that align with your schedule and interests.",
    icon: CalendarDays
  },
  {
    title: "No Follower Minimum",
    description: "We care about the quality of your content and your ability to tell a story, not your follower count.",
    icon: Users
  },
  {
    title: "Long-term Partnerships",
    description: "Build lasting relationships with brands instead of just doing one-off transactional posts.",
    icon: Handshake
  }
];

export function WhyJoin() {
  return (
    <section className="py-20 md:py-32 bg-black border-t border-neutral-900 overflow-hidden">
      <div className="relative w-full py-6 md:py-8 mb-16 md:mb-24">
        {/* Animated background reveal */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#CCFF00] origin-left z-0"
        />
        <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black relative z-20">Why Join RVM</h2>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 md:p-10 rounded-3xl bg-neutral-950 border border-neutral-900 transition-all duration-500 hover:border-[#CCFF00]/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/0 via-transparent to-[#CCFF00]/0 group-hover:from-[#CCFF00]/[0.03] rounded-3xl transition-all duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-neutral-800 flex items-center justify-center mb-6 group-hover:border-[#CCFF00]/40 transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-6 h-6 text-neutral-400 group-hover:text-[#CCFF00] transition-colors duration-500" />
                  </div>
                  
                  <h3 className="text-2xl font-medium mb-3 text-white group-hover:text-[#CCFF00] transition-colors duration-500">{reason.title}</h3>
                  <p className="text-neutral-400 font-light leading-relaxed text-lg">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
