/**
 * AlumniPage - Alumni spotlight grouped by graduation year
 * Data is fetched from the Django REST API.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Quote, User } from "lucide-react";

import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Card } from "@shared/ui/card";

interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: number;
  roleCompany: string;
  quote: string;
  imageURL: string | null;
}

const API_URL = "http://localhost:8000/api/alumni/";

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
        <div className="shrink-0 w-14 h-14 rounded-full bg-[#F9FAFB] border border-gray-200 overflow-hidden flex items-center justify-center">
          {profile.imageURL ? (
            <img
              src={profile.imageURL}
              alt={profile.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <User className="h-7 w-7 text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
            Class of {profile.graduationYear}
          </p>

          <h3 className="mt-1 font-bold text-[#333333]">
            {profile.name}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {profile.roleCompany}
          </p>
        </div>
      </div>

      <blockquote className="mt-4 flex gap-2 text-sm leading-relaxed text-gray-600 flex-grow">
        <Quote className="h-4 w-4 shrink-0 text-[#E00122] mt-0.5" />

        <span className="italic">
          &ldquo;{profile.quote}&rdquo;
        </span>
      </blockquote>
    </Card>
  );
}

export default function AlumniPage() {
  const heroRef = useRef(null);

  const inView = useInView(heroRef, {
    once: true,
    margin: "-100px",
  });

  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch alumni profiles (${response.status})`,
          );
        }

        const data: AlumniProfile[] = await response.json();

        setAlumni(data);
      } catch (err) {
        console.error("Error fetching alumni:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load alumni profiles.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const byYear = useMemo(() => {
    const map = new Map<number, AlumniProfile[]>();

    for (const profile of alumni) {
      const list = map.get(profile.graduationYear) ?? [];

      list.push(profile);
      map.set(profile.graduationYear, list);
    }

    return Array.from(map.entries()).sort(
      ([a], [b]) => b - a,
    );
  }, [alumni]);

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
                CEAS Tribunal alumni are thriving in industry. Here, a few
                share where they are now and a short reflection on their time
                in Tribunal.
              </p>
            </motion.div>

            {/* Loading state */}
            {loading && (
              <div className="mt-12 text-center text-gray-500">
                Loading alumni profiles...
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="mt-12 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
                <p className="font-semibold">
                  Unable to load alumni profiles.
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && alumni.length === 0 && (
              <div className="mt-12 text-center text-gray-500">
                No alumni profiles are currently available.
              </div>
            )}

            {/* Alumni profiles */}
            {!loading && !error && alumni.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
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
                        <AlumniCard
                          key={profile.id}
                          profile={profile}
                        />
                      ))}
                    </div>
                  </motion.section>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}