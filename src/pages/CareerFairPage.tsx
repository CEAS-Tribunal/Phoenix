import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import careerFairBanner from "@/assets/tribunal-career-fair-banner.jpg";
import { ResumeReviewDay } from "@/services/ResumeReviewService";

type EventCard = {
  title: string;
  dateLine: string;
  timeLine: string;
  icon: React.ElementType;
  tone: "primary" | "neutral";
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

export default function CareerFairPage() {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true, margin: "-100px" });

  const employersQuery = useQuery({
    queryKey: ["rrd-employers"],
    queryFn: () => ResumeReviewDay.getEmployers(),
  });

  const careerWeekCards = useMemo<EventCard[]>(
    () => [
      {
        title: "Business Career Fair",
        dateLine: "Tuesday, September 15th, 2026",
        timeLine: "10AM - 3PM",
        icon: Briefcase,
        tone: "primary",
      },
      {
        title: "Engineering and IT Career Fair",
        dateLine: "Wednesday, September 16th and Thursday, September 17th, 2026",
        timeLine: "10AM - 3PM",
        icon: Users,
        tone: "primary",
      },
      {
        title: "Employer Interviews",
        dateLine: "Friday, September 18th, 2026",
        timeLine: "9AM - 3PM",
        icon: Calendar,
        tone: "neutral",
      },
    ],
    []
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={careerFairBanner}
              alt="Career Week"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>

          <div className="relative py-16 lg:py-24">
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
                <div className="text-white/90 text-xs font-semibold uppercase tracking-wide">
                  Career Week
                </div>
                <h1 className="mt-3 text-white text-4xl sm:text-6xl font-bold tracking-tight">
                  Fall 2026
                </h1>
                <p className="mt-4 text-white/90 text-base leading-relaxed">
                  September 15th-18th
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {careerWeekCards.map((card) => {
                  const Icon = card.icon;
                  const isPrimary = card.tone === "primary";
                  return (
                    <Card
                      key={card.title}
                      className="p-6 lg:p-8 border-white/20 bg-white/10 backdrop-blur-md text-white"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/90">
                            <Icon className="h-4 w-4" />
                            Event
                          </div>
                          <h3 className="mt-3 text-xl font-bold tracking-tight">
                            {card.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/90">
                            {card.dateLine}
                          </p>
                          <p className="mt-1 text-sm text-white/90">
                            {card.timeLine}
                          </p>
                        </div>
                        <Button
                          className={`shrink-0 ${
                            isPrimary
                              ? "bg-[#E00122] hover:bg-[#B8011C] text-white"
                              : "bg-white/15 hover:bg-white/20 text-white"
                          }`}
                          disabled
                        >
                          Join
                        </Button>
                      </div>
                      <p className="mt-4 text-xs text-white/80">
                        Join links will be posted when registration opens.
                      </p>
                    </Card>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* About */}
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
                title="Welcome to Fall 2026 Career Week"
                description="The University of Cincinnati and the College of Engineering and Applied Science Tribunal are thrilled to welcome both employers and students to campus for the Fall 2026 Career Week. The University of Cincinnati Career Week provides students and employers the opportunity to network, interview, and connect through both professional and informal events over the course of five (5) days. Whether looking to hire full-time or part-time, co-op or intern, employers will find an incredibly talented and diverse pool of CEAS candidates. We look forward to hosting you."
              />
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <Sparkles className="h-4 w-4" />
                  General information
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  To learn more about the incredible opportunities offered as a
                  part of the Fall 2026 Career Week please see the general
                  information below!
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <GraduationCap className="h-4 w-4" />
                  Student registration
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Once again, students are recommended to register in advance
                  for the Career Fair. While waiting for the fair, students are
                  encouraged to prepare by saving the fair on Handshake and
                  viewing employers currently registered for the Career Fair.
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <ExternalLink className="h-4 w-4" />
                  Stay updated
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Questions? Be sure to follow us on Instagram{" "}
                  <a
                    href="https://www.instagram.com/uc_careerfair/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E00122] hover:underline"
                  >
                    @uc_careerfair
                  </a>{" "}
                  to receive the most up-to-date information regarding Career
                  Week!
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Key events */}
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
                eyebrow="Highlights"
                title="Career Week experiences"
                description="Explore the signature events that make Career Week valuable for both students and employers."
              />
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Resume Review Day — Monday, February 2nd
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Resume Review Day gives students an opportunity to get their
                  resume reviewed by industry leaders before attending the
                  Career Fair. It&apos;s a great way to begin preparing and
                  allows students to meet employers in advance. Students
                  attending Resume Review Day will have the opportunity to also
                  attend a preemptive student-led resume workshop to further
                  develop and refine their resumes. It is strongly recommended
                  that all underclassmen register to attend both sessions.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  This is an incredible opportunity with limited capacity, so
                  students are encouraged to sign-up as soon as registration
                  opens.
                </p>
                <div className="mt-6">
                  <Button asChild className="bg-[#E00122] hover:bg-[#B8011C] text-white">
                    <Link to="/resume-review-day/students">Join</Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Evening With Industry — Tuesday, February 9th
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  The Society of Women Engineers’ Evening With Industry is an
                  opportunity to interact with highly sought-after female
                  engineering and technology students. The event will consist
                  of several rotational networking sessions and food will be
                  served to all employee attendees and students. From new
                  students to graduating seniors, industry representatives will
                  be able to interact with a broad range of UC&apos;s female
                  CEAS students. Students have the advantage of personal
                  one-on-one or small group discussions with companies that hire
                  their major.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Employers interested in attending this wonderful event will
                  have the opportunity to purchase a set of two tickets as an
                  add-on item when registering for the Career Week. Employers
                  with any questions are encouraged to reach out to the UC
                  Society of Women Engineers at{" "}
                  <a
                    href="mailto:uc.swe.events@gmail.com"
                    className="text-[#E00122] hover:underline"
                  >
                    uc.swe.events@gmail.com
                  </a>{" "}
                  for further information.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Fair details */}
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
                eyebrow="Career fairs"
                title="Business, Engineering, and IT"
                description="Two fairs, one week—each designed to connect students with employers and opportunities."
              />
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Business Career Fair
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  The Business Career Fair is targeted towards employers
                  planning to hire students or recent graduates for full-time
                  and internship positions outside of the engineering fields.
                  Graduate schools are also invited to attend. A wide variety
                  of majors are included in this fair.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  To see the full list of majors attending the Business Career
                  Fair, you can filter through your major of interest.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  The Business Career Fair is held in the Campus Recreation
                  Center on University of Cincinnati&apos;s main campus.
                  Employers are invited to purchase one or more booths and may
                  bring a display and materials to distribute to students.
                  Lunch is included, complimentary WiFi is available, and
                  day-of power can be accessed for an additional fee during
                  registration.
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Engineering and IT Career Fair
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  The Engineering and IT Career Fair is targeted toward
                  employers looking to hire technical majors for full-time,
                  co-op, and internship positions. Most of these students
                  participate in the University of Cincinnati&apos;s mandatory
                  cooperative education program. A wide variety of majors are
                  included in this fair, including majors in the following
                  categories but not limited to:
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Engineering</li>
                  <li>Engineering Technology</li>
                  <li>Information Technology</li>
                  <li>Operations</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  To see the full list of majors attending the Engineering and
                  IT Career Fair, you can filter through your major of interest.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  The Engineering and IT Career Fair is held in the Campus
                  Recreation Center and Tangeman University Center on
                  University of Cincinnati&apos;s main campus. Employers are
                  invited to purchase one or more booths and may bring a display
                  and materials to distribute to students. Lunch will be served,
                  complimentary WiFi is available, and day-of power can be
                  accessed for an additional fee during registration.
                </p>
              </Card>
            </div>

            <div className="mt-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Interview Days
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  The Career Fair Week Interview Day offers an opportunity for
                  employers participating in the Career Fair to meet with their
                  top candidates one-on-one for 30-minute interviews on-campus
                  the Friday following the Business, Engineering, and IT Career
                  Fairs.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Employers may participate in Interview Day free of charge by
                  clicking on the Interview Day box during registration and
                  selecting the desired number of interview booths.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Employers are to schedule their own interviews directly with
                  student candidates at a mutually agreeable time. At the start
                  of the fair, you will receive a blank interview schedule with
                  a number of 30-minute time blocks from 9:00 a.m. to 3:00 p.m.
                  Fill in your schedule as you talk with candidates, and turn
                  in the carbon copy of your schedule at Employer Check-Out.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Resume Review Day (detail) */}
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
                eyebrow="Resume Review Day"
                title="Get feedback before Career Week"
                description="Two Resume Review opportunities—Engineering/IT and Business—help students prepare and connect with employers."
              />
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Engineering Resume Review Day
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Monday, February 2nd
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Resume Review Day gives students an opportunity to get their
                  resume reviewed by industry leaders before attending the
                  Career Fair. It is a great way to get prepared and it also
                  allows students to meet employers in advanced. Returning in
                  Fall 2026 students attending Resume Review Day will have the
                  opportunity to also attend a preemptive student-led resume
                  workshop to further develop and refine their resumes.
                </p>
                <div className="mt-6">
                  <Button asChild className="bg-[#E00122] hover:bg-[#B8011C] text-white">
                    <Link to="/resume-review-day/students">Join</Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  Lindner College of Business Event TBD
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">TBA</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Lindner business students, come get your resume reviewed
                  before the Career Fair! This is an opportunity to meet with
                  an employer representative one-on-one to go over your resume
                  and ask questions. This will take place virtually and you
                  will be expected to screen share your resume.
                </p>
                <div className="mt-6">
                  <Button
                    className="bg-[#E00122] hover:bg-[#B8011C] text-white"
                    disabled
                  >
                    Join
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Resume Review Day — employers signed up (public API) */}
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
                eyebrow="Resume Review Day"
                title="Signed up employers"
                description="Industry partners registered for Engineering Resume Review Day. Open slots are 20-minute sessions still available for students to book."
              />
            </motion.div>

            {employersQuery.isPending ? (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="p-6 lg:p-8 border-gray-200 overflow-hidden"
                  >
                    <div className="h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-4 h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
                    <div className="mt-6 flex flex-wrap gap-2">
                      <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                      <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                    <div className="mt-4 h-4 w-28 rounded bg-gray-100 animate-pulse" />
                  </Card>
                ))}
              </div>
            ) : employersQuery.isError ? (
              <div className="mt-10 rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800">
                We couldn&apos;t load the employer list. Please try again later.
              </div>
            ) : employersQuery.data?.length === 0 ? (
              <Card className="mt-10 p-8 lg:p-10 border-gray-200 text-center">
                <p className="text-gray-600">
                  No employers signed up yet. Check back as Resume Review Day
                  approaches.
                </p>
              </Card>
            ) : (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {employersQuery.data?.map((emp) => (
                  <Card
                    key={emp.id}
                    className="p-6 lg:p-8 border-gray-200 flex flex-col h-full"
                  >
                    <h3 className="text-lg font-bold text-[#333333] leading-snug">
                      {emp.company_name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{emp.full_name}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {emp.selected_majors.map((major) => (
                        <span
                          key={major}
                          className="inline-flex items-center rounded-full border border-gray-200 bg-[#F9FAFB] px-2.5 py-0.5 text-xs font-medium text-gray-700"
                        >
                          {major}
                        </span>
                      ))}
                    </div>
                    <p className="mt-auto pt-4 text-sm text-gray-600">
                      <span className="font-semibold text-[#333333]">
                        {emp.available_slots}
                      </span>{" "}
                      open slot
                      {emp.available_slots === 1 ? "" : "s"}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How to prepare */}
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
                eyebrow="How to Prepare"
                title="Set yourself up for success"
                description="In-person Career Fair preparation steps from the legacy CEAS Tribunal Career Week guide."
              />
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  In-Person Career Fair
                </h3>
                <ul className="mt-4 list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>Review the list of companies that will be there.</li>
                  <li>Research employers that interest you.</li>
                  <li>
                    Prepare a brief (30-second) self-introduction (e.g., name,
                    major, year, and one question).
                  </li>
                  <li>Attend Resume Review Days.</li>
                  <li>
                    Schedule a meeting with your Co-op Advisor to polish your
                    resume, practice your self-introduction, get ideas for
                    questions to ask, and prepare for interviews.
                  </li>
                  <li>
                    Attend company information sessions. Information sessions
                    let you learn about a company&apos;s culture, hiring
                    process, and current hiring priorities from someone who
                    actually works there. Look for information sessions in
                    Handshake within two weeks of the fair.
                  </li>
                  <li>Plan to spend 1-2 hours at the fair.</li>
                  <li>
                    Read our Student Best Practices for a universal guide on
                    job-seeking at career fairs.
                  </li>
                </ul>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  What to Wear and Bring
                </h3>
                <ul className="mt-4 list-disc pl-5 text-sm text-gray-600 space-y-2">
                  <li>
                    Wear business professional. No student will be admitted
                    wearing jeans, tennis shoes, or t-shirts.
                  </li>
                  <li>
                    See{" "}
                    <a
                      href="https://www.instagram.com/uc_careerfair/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#E00122] hover:underline"
                    >
                      @uc_careerfair
                    </a>{" "}
                    on Instagram for resources on getting dress attire!
                  </li>
                  <li>Bring your Bearcat Card (student ID).</li>
                  <li>
                    Bring a folder or portfolio with five to fifteen copies of
                    your resume, a note pad and pen.
                  </li>
                  <li>
                    Coat and bag check is available, but you can skip the line
                    and save time by leaving your coat and backpack at home or
                    in a secure place while you’re at the fair. The Campus
                    Recreation Center has a limited number of day-use lockers
                    with built-in locks that members and non-members can use
                    for free.
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer + Employer info + Contact */}
        <section className="py-16 lg:py-24 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <MapPin className="h-4 w-4" />
                  Volunteer
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  We provide the opportunity to volunteer at the Career Fair on
                  any of the three days. Volunteering at the Career Fair will
                  give you great opportunity to get involved with your
                  college&apos;s student government. It will also provide you
                  with the opportunity to network with company representatives.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Additional information regarding volunteer opportunities and
                  volunteer registration information for the Fall 2026 Career
                  Week will be emailed to students in the weeks leading up to
                  the event.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Professional dress is required for all volunteers. Contact{" "}
                  <a
                    href="mailto:uccareerfair@gmail.com"
                    className="text-[#E00122] hover:underline"
                  >
                    uccareerfair@gmail.com
                  </a>{" "}
                  for more information.
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <Briefcase className="h-4 w-4" />
                  Employer information
                </div>
                <h3 className="mt-3 text-base font-bold text-[#333333]">
                  Information Sessions & Tabling
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  If you would like to schedule an information session or table
                  in the Lindner College of Business, please contact Andrew
                  Wellendorf (Andrew.Wellendorf@uc.edu) Or, request an event in
                  Handshake. See How to Request an Event and Understanding
                  Event Formats in Handshake. Requests for on-campus events
                  should be made at least two weeks prior to the desired event
                  date.
                </p>
                <h3 className="mt-6 text-base font-bold text-[#333333]">
                  Resume Review Day
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  The Engineering and IT Resume Review Day is an event hosted
                  by the Engineering and Applied Science Tribunal in order to
                  help prepare students for the Career Fair. This event gives
                  students the opportunity to sign up for 20-minute intervals to
                  receive resume feedback from industry leaders and gives
                  students the ability to network with employers before the
                  Engineering and IT Career Fair.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  It is also used as a chance for employers to build student
                  relations, as well as get face-to-face time with additional
                  students that might be seeking a co-op at no cost to them.
                </p>
              </Card>

              <Card className="p-6 lg:p-8 border-gray-200">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                  <Phone className="h-4 w-4" />
                  Contact us
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  The UC Career Week is organized by the Engineering & Applied
                  Science Tribunal, Lindner College of Business Career Services,
                  and the College of Cooperative Education and Professional
                  Studies.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Should you have any questions, please contact us at (513) 556
                  - 7234 or{" "}
                  <a
                    href="mailto:uccareerfair@gmail.com"
                    className="text-[#E00122] hover:underline"
                  >
                    uccareerfair@gmail.com
                  </a>{" "}
                  for the Career Development Team or{" "}
                  <a
                    href="mailto:schindsn@ucmail.uc.edu"
                    className="text-[#E00122] hover:underline"
                  >
                    schindsn@ucmail.uc.edu
                  </a>{" "}
                  for Suzanne Schindler, our events director. Thank you.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

