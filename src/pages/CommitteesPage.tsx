/**
 * CommitteesPage - All roles as separate cards; each card has a dropdown for its members.
 * No section grouping; one flat grid of role cards. Colors and icons vary per card.
 */

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { committeesKeys } from "@/services/queryKeys";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  GraduationCap,
  Users,
  Briefcase,
  Megaphone,
  Award,
  ClipboardList,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CommitteesService,
  type ExecRoleItem,
  type ExecMemberPerson,
} from "@/services/CommitteesService";

/** Palette of accent colors for role cards (varied, deterministic per role). */
const CARD_COLORS = [
  "#E00122", // red (brand)
  "#4F46E5", // indigo
  "#0D9488", // teal
  "#0284C7", // sky
  "#E11D48", // rose
  "#EA580C", // orange
  "#7C3AED", // violet
  "#059669", // emerald
  "#DC2626", // red-6
  "#2563EB", // blue
  "#CA8A04", // yellow
  "#DB2777", // pink
];

/** Icons for role cards (shuffled assignment by index). */
const CARD_ICONS: LucideIcon[] = [
  GraduationCap,
  Users,
  Briefcase,
  Megaphone,
  Award,
  ClipboardList,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Star,
  Target,
];

/** Deterministic index for color/icon from role id and list index (stable across renders). */
function getCardStyle(roleId: number, index: number): { color: string; Icon: LucideIcon } {
  const seed = roleId * 31 + index;
  return {
    color: CARD_COLORS[Math.abs(seed) % CARD_COLORS.length],
    Icon: CARD_ICONS[Math.abs(seed) % CARD_ICONS.length],
  };
}

/** Card for API-driven exec member (id, name, email, imgURL). */
function ExecMemberCard({ member }: { member: ExecMemberPerson }) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-[#F9FAFB] p-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        {member.imgURL ? (
          <img
            src={member.imgURL}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#333333] text-sm">{member.name}</p>
        <a
          href={`mailto:${member.email}`}
          className="text-xs text-[#E00122] hover:underline"
        >
          {member.email}
        </a>
      </div>
    </div>
  );
}

/** Single role card: icon + color, role name + description; dropdown reveals members in that role. */
function RoleCard({
  role,
  index,
  isMembersExpanded,
  onToggleMembers,
}: {
  role: ExecRoleItem;
  index: number;
  isMembersExpanded: boolean;
  onToggleMembers: () => void;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const members = role.members ?? [];
  const { color, Icon } = getCardStyle(role.id, index);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="rounded-xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
      style={{
        borderColor: isMembersExpanded ? color : "rgb(229, 231, 235)",
      }}
      onMouseEnter={(e) => {
        if (!isMembersExpanded) e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        if (!isMembersExpanded) e.currentTarget.style.borderColor = "rgb(229, 231, 235)";
      }}
    >
      <motion.div
        className="mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Icon size={40} strokeWidth={1.5} style={{ color }} />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900">{role.role}</h3>
      {role.description && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{role.description}</p>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="mt-4 w-fit -ml-2 text-gray-600"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleMembers();
        }}
        style={isMembersExpanded ? { color } : undefined}
      >
        {isMembersExpanded ? "Hide members" : "View members"}
        <motion.span
          animate={{ rotate: isMembersExpanded ? 180 : 0 }}
          className="inline-block ml-1"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </Button>
      <AnimatePresence initial={false}>
        {isMembersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {members.length > 0 ? (
                members.map((m) => <ExecMemberCard key={m.id} member={m} />)
              ) : (
                <p className="text-sm text-gray-500 italic">No members listed.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CommitteesPage() {
  const { data: sections = [], isPending: loading, isError, error } = useQuery({
    queryKey: committeesKeys.execRoleWithMembers,
    queryFn: () => CommitteesService.getExecRoleSectionsWithMembers(),
  });
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Failed to load committees."
    : null;
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);

  /** President and Chief of Staff first, then all other roles in their original order. */
  const allRoles = (() => {
    const flat = sections.flatMap((section) => section.roles);
    const president = flat.find((r) => r.role === "President");
    const chiefOfStaff = flat.find((r) => r.role === "Chief of Staff");
    const rest = flat.filter(
      (r) => r.role !== "President" && r.role !== "Chief of Staff" 
    );
    return [president, chiefOfStaff, ...rest].filter(
      (r): r is NonNullable<typeof r> => r != null
    );
  })();

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
              Each role is listed below; use View members on a role to see who holds it.
            </motion.p>
          </div>
        </section>

        {/* Flat grid of role cards; each role is separate, dropdown shows its members */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading roles…</div>
            ) : errorMessage ? (
              <div className="text-center py-12 text-red-600">{errorMessage}</div>
            ) : allRoles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No roles yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRoles.map((role, index) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    index={index}
                    isMembersExpanded={expandedRoleId === role.id}
                    onToggleMembers={() =>
                      setExpandedRoleId((id) => (id === role.id ? null : role.id))
                    }
                  />
                ))}
              </div>
            )}
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
      <Footer />
    </>
  );
}
