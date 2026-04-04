import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutMissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full bg-[#F9FAFB] py-20">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - About Us */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
              ABOUT US
            </div>
            <h2 className="text-[#333333] text-[32px] font-bold mt-3">
              We represent the voice of CEAS students
            </h2>
            <p className="text-gray-600 text-base mt-4 leading-relaxed">
              The CEAS Tribunal organizes and assures student participation on
              all College of Engineering and Applied Science related committees.
              We advocate for curriculum, academic standards, professional
              development, and university computing services.
            </p>
            <div className="mt-6 rounded-xl aspect-video bg-gray-200"></div>
          </motion.div>

          {/* Right Column - Our Mission */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
              OUR MISSION
            </div>
            <h2 className="text-[#333333] text-[32px] font-bold mt-3">
              Founded in 1908, serving students for over a century
            </h2>
            <p className="text-gray-600 text-base mt-4 leading-relaxed">
              As one of the largest and most active student organizations on
              campus, we serve as the student government entity for the college.
              Our mission is to act as a liaison between administration and
              students concerning policies, curriculum, and student life.
            </p>
            <div className="mt-6 rounded-xl aspect-video bg-gray-200"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMissionSection;
