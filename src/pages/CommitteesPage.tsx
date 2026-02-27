/**
 * CommitteesPage - Committees with expandable executive placeholders per committee
 * Keeps existing bento design; "View members" shows placeholder exec board per committee.
 */

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  HeartHandshake,
  GraduationCap,
  MapPin,
  Briefcase,
  Megaphone,
  Presentation,
  Users,
  Calendar,
  Rocket,
  Lightbulb,
  PartyPopper,
  Sparkles,
  Code,
  ArrowRight,
  ChevronDown,
  User,
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

interface Executive {
  id: string;
  name: string;
  role: string;
  major?: string;
  year?: string;
  bio: string;
}

/** Placeholder executives by committee id; replace with API when ready. */
const EXECUTIVES_BY_COMMITTEE: Record<string, Executive[]> = {
  "academic-affairs": [
    { id: "aa-1", name: "Executive Name", role: "Chair", major: "Engineering", year: "2026", bio: "Short bio placeholder. Replace with real exec info when available." },
    { id: "aa-2", name: "Executive Name", role: "Member", major: "Computer Science", year: "2027", bio: "Short bio placeholder." },
  ],
  "career-development": [
    { id: "cd-1", name: "Executive Name", role: "Chair", major: "Mechanical Engineering", year: "2026", bio: "Short bio placeholder. Connects students with employers and supports Career Fair." },
  ],
  "college-wide-events": [],
  communications: [
    { id: "com-1", name: "Executive Name", role: "Chair", bio: "Short bio placeholder. Manages Tribunal branding and events record." },
  ],
  esoc: [
    { id: "esoc-1", name: "Executive Name", role: "Chair", bio: "Short bio placeholder. Coordinates student organizations." },
  ],
  "equity-inclusion": [],
  "e-week": [],
  expo: [],
  "first-year-engagement": [],
  innovation: [
    { id: "inn-1", name: "Executive Name", role: "Chair", bio: "Short bio placeholder." },
  ],
  internship: [],
  "pre-engineering": [],
  secretary: [],
  "social-events": [],
  technology: [
    { id: "tech-1", name: "Executive Name", role: "Chair", major: "Computer Science", year: "2026", bio: "Short bio placeholder. Leads website and tech initiatives." },
  ],
};

const committees: Committee[] = [
  {
    id: "academic-affairs",
    name: "Academic Affairs",
    icon: GraduationCap,
    accentColor: "#E00122",
    description:
      "This committee shall organize and assure student participation on all College of Engineering and Applied Science related committees.",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "career-development",
    name: "Career Development",
    icon: Briefcase,
    accentColor: "#1E40AF",
    description:
      "The Career Development committee is responsible for all career-related events hosted by the CEAS Tribunal.",
    gridClass: "md:col-span-2",
  },
  {
    id: "college-wide-events",
    name: "College Wide Events",
    icon: Calendar,
    accentColor: "#DC2626",
    description:
      "Be actively involved in events hosted and ran by CEAS Tribunal throughout the semester, including Career Fair and other college-wide programs.",
    gridClass: "md:col-span-1",
  },
  {
    id: "communications",
    name: "Communications",
    icon: Megaphone,
    accentColor: "#7C3AED",
    description:
      "This committee shall publicize Tribunal events, maintain and promote Tribunal branding, and create a yearly record of Tribunal events.",
    gridClass: "md:col-span-1",
  },
  {
    id: "esoc",
    name: "ESOC",
    icon: Users,
    accentColor: "#059669",
    description:
      "This committee is responsible for coordinating student organizations within the college and their relations with administration and student government.",
    gridClass: "md:col-span-1",
  },
  {
    id: "equity-inclusion",
    name: "Equity & Inclusion",
    icon: HeartHandshake,
    accentColor: "#EC4899",
    description:
      "Responsible for reviewing and researching issues pertinent to ensuring the protection and promotion of diversity and student rights within CEAS.",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "e-week",
    name: "E-Week",
    icon: PartyPopper,
    accentColor: "#EA580C",
    description:
      "Engineering Week is dedicated to celebrating engineers with events, competitions, and community programming throughout the week.",
    gridClass: "md:col-span-1",
  },
  {
    id: "expo",
    name: "EXPO",
    icon: Presentation,
    accentColor: "#8B5CF6",
    description:
      "The EXPO Chair serves as the main event manager for CEAS EXPO, where graduating seniors present capstone projects to judges and attendees.",
    gridClass: "md:col-span-1",
  },
  {
    id: "first-year-engagement",
    name: "First Year Engagement",
    icon: Rocket,
    accentColor: "#06B6D4",
    description:
      "Sponsors programs that promote freshmen interaction through social events, leadership development, community service, and college engagement.",
    gridClass: "md:col-span-1",
  },
  {
    id: "innovation",
    name: "Innovation",
    icon: Lightbulb,
    accentColor: "#FBBF24",
    description:
      "Responsible for initiatives that broaden CEAS Tribunal outreach through new programs and campus engagement.",
    gridClass: "md:col-span-1",
  },
  {
    id: "internship",
    name: "Internship",
    icon: Briefcase,
    accentColor: "#1E40AF",
    description:
      "Applications are open for CEAS Tribunal’s Internship Program, pairing first-year students with executive board members to support initiatives throughout the year.",
    gridClass: "md:col-span-2",
  },
  {
    id: "pre-engineering",
    name: "Pre-Engineering",
    icon: MapPin,
    accentColor: "#059669",
    description:
      "Connects CEAS students at UC Blue Ash and UC Clermont with UC Main Campus, CEAS, and CEAS Tribunal, and supports satellite-campus programming.",
    gridClass: "md:col-span-1",
  },
  {
    id: "secretary",
    name: "Secretary",
    icon: ClipboardList,
    accentColor: "#6B7280",
    description:
      "Responsible for taking attendance at meetings, recording meeting minutes, and supporting meeting operations.",
    gridClass: "md:col-span-1",
  },
  {
    id: "social-events",
    name: "Social Events",
    icon: Sparkles,
    accentColor: "#7C3AED",
    description:
      "Plans social and community service events to engage members within CEAS and supports key semester programs like Exam Week Breakfast.",
    gridClass: "md:col-span-1",
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    accentColor: "#E00122",
    description:
      "Maintains proper function of CEAS Tribunal technology assets and leads modernization of web and event technology initiatives.",
    gridClass: "md:col-span-2 md:row-span-2",
  },
];

function ExecutiveCard({ exec }: { exec: Executive }) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-[#F9FAFB] p-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
        <User className="h-5 w-5 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#333333] text-sm">{exec.name}</p>
        <p className="text-xs font-medium text-[#E00122]">{exec.role}</p>
        {(exec.major || exec.year) && (
          <p className="text-xs text-gray-500 mt-0.5">
            {[exec.major, exec.year].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{exec.bio}</p>
      </div>
    </div>
  );
}

const CommitteeCard = ({
  committee,
  index,
  isExpanded,
  onToggle,
  executives,
}: {
  committee: Committee;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  executives: Executive[];
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const Icon = committee.icon;
  const mailtoHref = `mailto:tribunal@uc.edu?subject=${encodeURIComponent(
    `Committee interest: ${committee.name}`
  )}`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={committee.gridClass}
    >
      <Card
        className="h-full p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden"
        style={{
          borderColor: isExpanded ? committee.accentColor : "rgb(229, 231, 235)",
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) e.currentTarget.style.borderColor = committee.accentColor;
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) e.currentTarget.style.borderColor = "rgb(229, 231, 235)";
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

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-fit -ml-2 text-gray-600 hover:text-[#E00122]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            style={isExpanded ? { color: committee.accentColor } : undefined}
          >
            {isExpanded ? "Hide members" : "View members"}
            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} className="inline-block ml-1">
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </Button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Committee members
                </p>
                {executives.length > 0 ? (
                  <div className="space-y-3">
                    {executives.map((exec) => (
                      <ExecutiveCard key={exec.id} exec={exec} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Member info coming soon.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={mailtoHref}
            className="flex items-center gap-2 mt-6 font-medium hover:underline transition-all group-hover:translate-x-1"
            style={{ color: committee.accentColor }}
          >
            Get Involved
            <ArrowRight size={16} />
          </a>
        </div>
      </Card>
    </motion.div>
  );
};

export default function CommitteesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleScrollToMeetings = () => {
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
              Click any committee to learn more; use View members to see the board.
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
                  isExpanded={expandedId === committee.id}
                  onToggle={() =>
                    setExpandedId((id) => (id === committee.id ? null : committee.id))
                  }
                  executives={EXECUTIVES_BY_COMMITTEE[committee.id] ?? []}
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
