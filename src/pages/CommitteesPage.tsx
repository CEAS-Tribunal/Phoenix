/**
 * CommitteesPage - Modern bento grid layout showcasing CEAS Tribunal committees
 * SEO: Displays 10 committees with descriptions, icons, and contact information
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Megaphone,
  Users,
  Calendar,
  Rocket,
  Lightbulb,
  PartyPopper,
  Sparkles,
  Code,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface Committee {
  id: string;
  name: string;
  icon: React.ElementType;
  accentColor: string;
  description: string;
  chair?: string;
  gridClass: string;
}

const committees: Committee[] = [
  {
    id: "academic-affairs",
    name: "Academic Affairs",
    icon: GraduationCap,
    accentColor: "#E00122",
    description:
      "Organizes student participation on all CEAS-related committees. Liaison between students and administration.",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "career-development",
    name: "Career Development",
    icon: Briefcase,
    accentColor: "#1E40AF",
    description:
      "Hosts Resume Review Day and Technical Career Fair twice yearly. Connects employers with students.",
    gridClass: "md:col-span-2",
  },
  {
    id: "communications",
    name: "Communications",
    icon: Megaphone,
    accentColor: "#7C3AED",
    description:
      "Manages social media, website, newsletters, and PR for CEAS Tribunal events.",
    gridClass: "md:col-span-1",
  },
  {
    id: "esoc",
    name: "ESOC",
    icon: Users,
    accentColor: "#059669",
    description:
      "Coordinates all undergraduate student organizations in CEAS. Manages Baldwin Hall reservations.",
    gridClass: "md:col-span-1",
  },
  {
    id: "eweek",
    name: "EWeek",
    icon: Calendar,
    accentColor: "#DC2626",
    description:
      "Plans and executes annual Engineers Week celebration with competitions and social events.",
    gridClass: "md:col-span-1",
  },
  {
    id: "feld",
    name: "FELD",
    icon: Rocket,
    accentColor: "#EA580C",
    description:
      "Mentors freshman engineering students through leadership workshops and networking events.",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "innovation",
    name: "Innovation",
    icon: Lightbulb,
    accentColor: "#FBBF24",
    description:
      "Supports entrepreneurship, hackathons, and innovation challenges for engineering students.",
    gridClass: "md:col-span-1",
  },
  {
    id: "luau",
    name: "Luau+",
    icon: PartyPopper,
    accentColor: "#EC4899",
    description:
      "Plans annual Luau celebration and other social events to build CEAS community.",
    gridClass: "md:col-span-1",
  },
  {
    id: "special-events",
    name: "Special Events",
    icon: Sparkles,
    accentColor: "#8B5CF6",
    description:
      "Organizes CEAS EXPO, award ceremonies, and special college-wide events.",
    gridClass: "md:col-span-1",
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    accentColor: "#06B6D4",
    description:
      "Maintains tribunal.uc.edu website, develops internal tools, and manages technical infrastructure.",
    gridClass: "md:col-span-2",
  },
];

const CommitteeCard = ({
  committee,
  index,
}: {
  committee: Committee;
  index: number;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const Icon = committee.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={committee.gridClass}
    >
      <Card
        className="h-full p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group cursor-pointer relative overflow-hidden"
        style={{
          borderColor: "rgb(229, 231, 235)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = committee.accentColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgb(229, 231, 235)";
        }}
      >
        {committee.chair && (
          <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
            Chair: {committee.chair}
          </div>
        )}

        <div className="flex flex-col h-full">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon
              size={40}
              strokeWidth={1.5}
              style={{ color: committee.accentColor }}
            />
          </motion.div>

          <h3 className="text-2xl font-bold text-black mt-4">
            {committee.name}
          </h3>

          <p className="text-[15px] text-gray-600 mt-3 leading-relaxed flex-grow">
            {committee.description}
          </p>

          <Link
            to={`/committees/${committee.id}`}
            className="flex items-center gap-2 mt-6 font-medium hover:underline transition-all group-hover:translate-x-1"
            style={{ color: committee.accentColor }}
          >
            Get Involved
            <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default function CommitteesPage() {
  const handleScrollToMeetings = () => {
    // This would scroll to meetings section if available
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Header Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[48px] font-bold text-black"
            >
              Our Committees
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[20px] text-gray-600 mt-4 max-w-3xl mx-auto"
            >
              Join a committee and make an impact in the College of Engineering
              & Applied Science
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[14px] text-gray-500 mt-2"
            >
              Click any committee to learn more and get involved
            </motion.p>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
              {committees.map((committee, index) => (
                <CommitteeCard
                  key={committee.id}
                  committee={committee}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-white to-red-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[36px] font-bold text-black">
                Ready to join a committee?
              </h2>
              <p className="text-[18px] text-gray-600 mt-4">
                Contact us at{" "}
                <a
                  href="mailto:tribunal@uc.edu"
                  className="text-[#E00122] hover:underline"
                >
                  tribunal@uc.edu
                </a>{" "}
                or attend our next general body meeting
              </p>
              <Button
                onClick={handleScrollToMeetings}
                className="bg-[#E00122] text-white hover:bg-[#c00115] shadow-md transition-colors mt-6"
                size="lg"
              >
                Join General Body Meeting
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
