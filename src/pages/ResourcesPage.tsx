/**
 * ResourcesPage – CEAS & UC resources (external links) and Tribunal resources (404/coming soon).
 * Minimal, subtle, Framer Motion animated cards with icons.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Library,
  FileSearch,
  Building2,
  HeartHandshake,
  Search,
  CalendarDays,
  Printer,
  ExternalLink,
  Tv,
  FileText,
  Scale,
  BookMarked,
  DollarSign,
  MapPin,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** CEAS & University resources – link to official UC/CEAS pages. */
const CEAS_RESOURCES = [
  {
    title: "CEAS Library",
    description:
      "Engineering & applied science library: databases, study rooms, course guides, and reservable spaces via 25 Live.",
    href: "https://www.libraries.uc.edu/libraries/ceas.html",
    icon: Library,
  },
  {
    title: "CEAS Library Services",
    description:
      "Research help, databases, standards, patents, senior design reports, printing, reserves, and borrow/request.",
    href: "https://www.libraries.uc.edu/libraries/ceas/services.html",
    icon: FileSearch,
  },
  {
    title: "College of Engineering & Applied Science",
    description:
      "CEAS homepage: programs, co-op, admissions, and college news.",
    href: "https://www.ceas.uc.edu/",
    icon: Building2,
  },
  {
    title: "CEAS Embedded Counselor (CAPS)",
    description:
      "Free, confidential mental health support for CEAS students. Initial consultation and first three sessions at no cost.",
    href: "https://www.ceas.uc.edu/about/counseling-services.html",
    icon: HeartHandshake,
  },
  {
    title: "UC Research Directory",
    description:
      "Search 10,000+ UC experts, facilities, grants, and patents across the university.",
    href: "https://researchdirectory.uc.edu/",
    icon: Search,
  },
  {
    title: "25 Live – Reserve a Space",
    description:
      "Reserve CEAS Library study rooms, classroom, and other UC spaces online.",
    href: "https://25live.collegenet.com/pro/uc",
    icon: CalendarDays,
  },
  {
    title: "Lab Printing",
    description:
      "600 pages per semester quota for CEAS lab laser printing; mobile and web print options.",
    href: "https://www.ceas.uc.edu/about/college-computing/computing-labs/lab-printing.html",
    icon: Printer,
  },
];

/** Tribunal resources – link to 404 (under construction) paths. */
const TRIBUNAL_RESOURCES = [
  {
    title: "Baldwin Table Reservations",
    description: "Reserve tables in Baldwin for your student organization.",
    to: "/tribunal/baldwin",
    icon: MapPin,
  },
  {
    title: "Funding Guide",
    description: "How to request funding from Tribunal for your org or event.",
    to: "/tribunal/funding-guide",
    icon: FileText,
  },
  {
    title: "Org Funding",
    description:
      "Org leaders pitch Tribunal for funding; we review and fund approved requests.",
    to: "/tribunal/org-funding",
    icon: DollarSign,
  },
  {
    title: "TV Ad Submission",
    description: "Submit ads for display on CEAS building TVs.",
    to: "/tribunal/tv-ad",
    icon: Tv,
  },
  {
    title: "Student Bill of Rights",
    description: "CEAS student rights and advocacy resources.",
    to: "/tribunal/student-bill-of-rights",
    icon: Scale,
  },
  {
    title: "Tribunal Bylaws",
    description: "Governance and procedures of the CEAS Tribunal.",
    to: "/tribunal/bylaws",
    icon: ScrollText,
  },
  {
    title: "Tribunal Constitution",
    description: "Constitution of the CEAS Tribunal.",
    to: "/tribunal/constitution",
    icon: BookMarked,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function ResourceCard({
  title,
  description,
  icon: Icon,
  ...linkProps
}: {
  title: string;
  description: string;
  icon: React.ElementType;
} & (
  | { href: string; to?: never; external: true }
  | { to: string; href?: never; external?: false }
)) {
  const isExternal = "href" in linkProps && linkProps.href;
  const content = (
    <>
      <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F9FAFB] border border-gray-200 flex items-center justify-center">
        <Icon className="h-5 w-5 text-[#E00122]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-[#333333]">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          {description}
        </p>
        <span className="inline-flex items-center gap-1 text-[#E00122] text-sm font-medium mt-2">
          {isExternal ? "Visit resource" : "Learn more"}
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={linkProps.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left group"
      >
        {content}
      </a>
    );
  }

  const internalTo = 'to' in linkProps && linkProps.to != null ? linkProps.to : '/';
  return (
    <Link
      to={internalTo}
      className="flex gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left group"
    >
      {content}
    </Link>
  );
}

const ResourcesPage = () => {
  const ceasRef = useRef<HTMLDivElement>(null);
  const tribunalRef = useRef<HTMLDivElement>(null);
  const ceasInView = useInView(ceasRef, { once: true, margin: "-80px" });
  const tribunalInView = useInView(tribunalRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
            Resources
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#333333]">
            CEAS & Tribunal resources
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Links to official UC and CEAS offerings, plus Tribunal-specific
            resources. Tribunal links are under construction and will redirect
            until available.
          </p>
        </section>

        {/* CEAS & University Resources */}
        <section
          ref={ceasRef}
          className="py-12 lg:py-16 bg-[#F9FAFB]"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={ceasInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="text-[#E00122] text-xs font-semibold uppercase tracking-wide"
            >
              CEAS & University
            </motion.div>
            <motion.h2
              initial="hidden"
              animate={ceasInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ delay: 0.05 }}
              className="mt-2 text-2xl sm:text-3xl font-bold text-[#333333]"
            >
              Libraries, counseling, research, and more
            </motion.h2>
            <motion.div
              initial="hidden"
              animate={ceasInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
            >
              {CEAS_RESOURCES.map((item) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <ResourceCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    href={item.href}
                    external
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tribunal Resources */}
        <section ref={tribunalRef} className="py-12 lg:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={tribunalInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="text-[#E00122] text-xs font-semibold uppercase tracking-wide"
            >
              Tribunal
            </motion.div>
            <motion.h2
              initial="hidden"
              animate={tribunalInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ delay: 0.05 }}
              className="mt-2 text-2xl sm:text-3xl font-bold text-[#333333]"
            >
              Reservations, funding, and governance
            </motion.h2>
            <motion.div
              initial="hidden"
              animate={tribunalInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
            >
              {TRIBUNAL_RESOURCES.map((item) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <ResourceCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    to={item.to}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
