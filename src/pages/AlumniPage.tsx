/**
 * AlumniPage - Alumni spotlight grouped by graduation year
 * Placeholder data; replace with API or CMS when ready.
 */

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Quote, User } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: number;
  roleCompany: string;
  quote: string;
}

const ALUMNI_PLACEHOLDERS: AlumniProfile[] = [
  {
    id: "a1",
    name: "Alumni Name",
    graduationYear: 2025,
    roleCompany: "Engineer at Company (placeholder)",
    quote:
      "Tribunal gave me leadership experience and connections that helped me land my first role. One of the best decisions in college.",
  },
  {
    id: "a2",
    name: "Alumni Name",
    graduationYear: 2025,
    roleCompany: "Product Manager, Tech Co. (placeholder)",
    quote:
      "CEAS Tribunal taught me how to work across teams and run events that matter. Still use those skills every day.",
  },
  {
    id: "a3",
    name: "Alumni Name",
    graduationYear: 2025,
    roleCompany: "Software Developer (placeholder)",
    quote: "The people and projects in Tribunal set me up for success after graduation.",
  },
  {
    id: "a4",
    name: "Alumni Name",
    graduationYear: 2024,
    roleCompany: "Consultant (placeholder)",
    quote:
      "Tribunal helped me grow as a leader and build lasting relationships. Highly recommend getting involved.",
  },
  {
    id: "a5",
    name: "Alumni Name",
    graduationYear: 2024,
    roleCompany: "Research Engineer (placeholder)",
    quote: "From organizing Career Fair to leading a committee—Tribunal was the highlight of my CEAS experience.",
  },
  {
    id: "a6",
    name: "Alumni Name",
    graduationYear: 2023,
    roleCompany: "Role @ Company (placeholder)",
    quote: "Our club standards show in where our alumni go. Proud to be part of this community.",
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

function AlumniCard({ profile }: { profile: AlumniProfile }) {
  return (
    <Card className="p-6 lg:p-8 border-gray-200 h-full flex flex-col">
      <div className="flex gap-4">
        <div className="shrink-0 w-14 h-14 rounded-full bg-[#F9FAFB] border border-gray-200 flex items-center justify-center">
          <User className="h-7 w-7 text-gray-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
            Class of {profile.graduationYear}
          </p>
          <h3 className="mt-1 font-bold text-[#333333]">{profile.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{profile.roleCompany}</p>
        </div>
      </div>
      <blockquote className="mt-4 flex gap-2 text-sm leading-relaxed text-gray-600 flex-grow">
        <Quote className="h-4 w-4 shrink-0 text-[#E00122] mt-0.5" />
        <span className="italic">&ldquo;{profile.quote}&rdquo;</span>
      </blockquote>
    </Card>
  );
}

export default function AlumniPage() {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true, margin: "-100px" });

  const byYear = useMemo(() => {
    const map = new Map<number, AlumniProfile[]>();
    for (const p of ALUMNI_PLACEHOLDERS) {
      const list = map.get(p.graduationYear) ?? [];
      list.push(p);
      map.set(p.graduationYear, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
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
              <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Alumni
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#333333]">
                Alumni spotlight
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                CEAS Tribunal alumni are thriving in industry. Here, a few share
                where they are now and a short reflection on their time in
                Tribunal. Placeholder profiles until real data is connected.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="mt-12 space-y-12"
            >
              {byYear.map(([year, profiles]) => (
                <motion.section
                  key={year}
                  id={`year-${year}`}
                  variants={fadeInUp}
                  aria-label={`Class of ${year}`}
                >
                  <h2 className="text-2xl font-bold tracking-tight text-[#333333] border-b border-gray-200 pb-2">
                    Class of {year}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                      <AlumniCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
