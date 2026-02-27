/**
 * ExpoPage - CEAS EXPO 2026 event page
 * Content source: https://tribunal.uc.edu/ceasexpo
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Calendar,
  ExternalLink,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const JUDGING_CATEGORIES = [
  {
    title: "Technical Excellence",
    description:
      "Recognizes projects that demonstrate a high level of technical rigor, precision, and mastery of engineering and scientific principles. Strong analytical work, appropriate use of modeling or simulation tools, and sound methodology.",
    icon: Award,
  },
  {
    title: "Innovation, Creativity, and Entrepreneurship",
    description:
      "Recognizes projects that demonstrate exceptional creativity, problem-solving, and strategic vision. Emphasis on emerging marketing potential, real-world business applicability, and consumer-focused design.",
    icon: Lightbulb,
  },
  {
    title: "Real-World Systems, Solutions, or Process Design",
    description:
      "Recognizes projects that demonstrate how engineering or research principles were applied to address a real-world challenge through a well-designed system, product, or process.",
    icon: Sparkles,
  },
  {
    title: "Sustainability and Environmental Responsibility",
    description:
      "Recognizes projects that prioritize environmental stewardship and long-term sustainability in design, research, or implementation.",
    icon: Award,
  },
  {
    title: "Human-Centered Research and Design",
    description:
      "Recognizes projects that place people at the core of the research and design process, with thoughtful integration of human factors, usability, and empathy.",
    icon: Users,
  },
  {
    title: "Interdisciplinary Collaboration",
    description:
      "Focuses on the intersection of multiple engineering disciplines, recognizing successful collaboration and balanced contribution of each field.",
    icon: Handshake,
  },
  {
    title: "Student Organization Project",
    description:
      "Recognizes the success of our engineering student organizations, highlighting collaborative efforts and collective achievements.",
    icon: Users,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow && (
        <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#333333]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          {description}
        </p>
      )}
    </header>
  );
}

export default function ExpoPage() {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <div className="bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-[#F9FAFB]">
          <div
            ref={heroRef}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
                CEAS EXPO
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#333333]">
                CEAS EXPO 2026
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Brought to you by CEAS Tribunal and the College of Engineering
                and Applied Science
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E00122]" />
                  Tuesday, April 7th, 2026
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E00122]" />
                  Fifth Third Arena
                </span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  className="border-[#E5E7EB] text-[#333333]"
                  disabled
                >
                  Registration (coming soon)
                </Button>
                <Button asChild className="bg-[#E00122] hover:bg-[#B8011C] text-white">
                  <a
                    href="https://tribunal.uc.edu/ceasexpo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Legacy EXPO page <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About + Students + Logistics */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                eyebrow="About"
                title="A large-scale showcase event"
                description="The CEAS EXPO is a large-scale showcase event where graduating seniors present their final capstone projects. EXPO brings together 200+ student groups across all undergraduate departments. There are several ways to support our students as they showcase their final projects, including sponsorships, donations and judging. For more details on how to get involved visit the CEAS EXPO webpage."
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-6 lg:p-8 border-gray-200">
                  <GraduationCap className="h-8 w-8 text-[#E00122]" />
                  <h3 className="mt-4 text-lg font-bold text-[#333333]">
                    Students
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    This event is made by students for students! Graduating
                    seniors will have a chance to show off their dedication and
                    commitment to their Senior Design Capstone Projects. They
                    present their projects in Fifth Third Arena on the day of
                    EXPO.
                  </p>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-6 lg:p-8 border-gray-200">
                  <MapPin className="h-8 w-8 text-[#E00122]" />
                  <h3 className="mt-4 text-lg font-bold text-[#333333]">
                    Logistics
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    The 2026 CEAS EXPO will be hosted on campus at Fifth Third
                    Arena. We welcome all members of the UC and Cincinnati
                    communities to attend. Undergraduate students, faculty,
                    staff, family members, and friends are encouraged to join us
                    in celebrating the innovation and hard work of our fifth-year
                    students.
                  </p>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-6 lg:p-8 border-gray-200">
                  <Award className="h-8 w-8 text-[#E00122]" />
                  <h3 className="mt-4 text-lg font-bold text-[#333333]">
                    Judging
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Several judging groups will traverse the exhibit hall
                    listening to presentations from all capstone groups. Each
                    capstone group is scored by multiple judging groups, with
                    each presentation counting towards their final scoring. The
                    judging schedule is subject to change as the EXPO approaches.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Judging categories */}
        <section className="py-16 lg:py-24 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                eyebrow="Volunteer Judging"
                title="Judging categories"
                description="The EXPO relies on the support of alumni, industry partners, and individuals with engineering or technical backgrounds to serve as judges. Volunteers receive a schedule, rubric, and set of expectations. Please check back at a later date for judge registration."
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {JUDGING_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.title} variants={fadeInUp}>
                    <Card className="h-full p-6 lg:p-8 border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-lg bg-[#F9FAFB] p-2">
                          <Icon className="h-5 w-5 text-[#E00122]" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#333333]">
                            {category.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Sponsorship + Contact */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                <SectionHeader
                  eyebrow="Company Sponsorship"
                  title="Support our students"
                  description="Sponsorship plays a key role in making this event a success. Your support helps us deliver high-impact experiences for attendees and celebrate the hard work and innovation of our fifth-year students as they showcase their capstone projects. Sponsorship opportunities are available through tiered packages. Full details of company sponsorship opportunities and the sponsorship packet can be found on the CEAS EXPO webpage under Company Sponsorship."
                />
                <Button
                  className="mt-6 bg-[#E00122] hover:bg-[#B8011C] text-white"
                  disabled
                >
                  Sponsorship info (coming soon)
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6 lg:p-8 border-gray-200">
                  <div className="inline-flex items-center gap-2 text-[#E00122] text-xs font-semibold uppercase tracking-wide">
                    <Mail className="h-4 w-4" />
                    Contact us
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    For questions or more information, please contact the CEAS
                    EXPO team at{" "}
                    <a
                      href="mailto:ceasexpo@ucmail.uc.edu"
                      className="text-[#E00122] font-medium hover:underline"
                    >
                      ceasexpo@ucmail.uc.edu
                    </a>
                    .
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
