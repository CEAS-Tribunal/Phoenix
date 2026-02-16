import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const handleScrollToMeetings = () => {
    const meetingsSection = document.getElementById("meetings");
    if (meetingsSection) {
      meetingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className={`w-full bg-white ${className}`}>
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Eyebrow text */}
        <motion.div 
          className="text-[#E00122] text-xs font-semibold uppercase tracking-wide mb-6"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          EST. 1908
        </motion.div>

        {/* Main headline */}
        <motion.h1 
          className="text-[#333333] text-[48px] lg:text-[64px] font-bold leading-tight mb-4"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Engineering & Applied Science Tribunal
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          className="text-gray-600 text-lg lg:text-xl mt-4"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The voice of CEAS students at the University of Cincinnati
        </motion.p>

        {/* Paragraph */}
        <motion.p 
          className="text-gray-600 text-base mt-6 max-w-2xl"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          We represent students on curriculum, academic standards, professional
          development, and university services. Join us to make an impact.
        </motion.p>

        {/* CTA row */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-8"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleScrollToMeetings}
            className="bg-[#E00122] text-white hover:bg-[#c00115] shadow-md transition-colors"
            size="lg"
          >
            Join General Body Meeting
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              to="/committees"
              className="border-[#E00122] text-[#E00122] hover:bg-[#E00122] hover:text-white transition-colors"
            >
              Get Involved
            </Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div 
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center sm:text-left"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[#E00122] text-5xl font-bold">
              {isStatsInView && (
                <CountUp start={0} end={200} duration={2.5} suffix="+" />
              )}
            </div>
            <div className="text-gray-600 text-sm mt-2">Student Groups</div>
          </motion.div>
          <motion.div 
            className="text-center sm:text-left"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-[#E00122] text-5xl font-bold">
              {isStatsInView && (
                <CountUp start={0} end={450} duration={2.5} suffix="+" />
              )}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              Career Fair Employers
            </div>
          </motion.div>
          <motion.div 
            className="text-center sm:text-left"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[#E00122] text-5xl font-bold">
              {isStatsInView && (
                <CountUp start={0} end={115} duration={2.5} suffix="+" />
              )}
            </div>
            <div className="text-gray-600 text-sm mt-2">Years Serving CEAS</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
