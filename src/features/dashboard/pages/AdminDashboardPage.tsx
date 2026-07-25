import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  HandCoins,
  Printer,
  Receipt,
  Table2,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shared/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Area, AreaChart, YAxis } from "recharts";
import {
  ATTENDANCE_BY_EVENT,
  GBM_ATTENDANCE_TREND,
  chartConfigEventAttendance,
  chartConfigGBMTrend,
} from "../data/adminChartData";
import { getIsOrgFundingChairUser, getIsTreasurerUser, useAuthMe } from "@auth";

type DashboardLinkItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Shown only when `/dashboard/auth/me/` reports Treasurer exec role (or superuser). */
  treasurerOnly?: boolean;
  /** Shown only when `/dashboard/auth/me/` reports Org Funding chair exec role (or superuser). */
  orgFundingChairOnly?: boolean;
};

const DASHBOARD_LINKS: DashboardLinkItem[] = [
  {
    href: "/admin/reimbursements",
    title: "Reimbursement request",
    description: "Submit an internal reimbursement request with receipt and purchase details.",
    icon: Receipt,
  },
  {
    href: "/admin/reimbursements/requests",
    title: "Reimbursement requests (treasurer)",
    description:
      "Treasurer dashboard: review all requests, filter, and mark each as filed when submitted to the university.",
    icon: Table2,
    treasurerOnly: true,
  },
  {
    href: "/admin/org-funding",
    title: "Org funding (chair)",
    description:
      "Org Funding chair dashboard: review submissions, verify required documents against the checklist, and update request status.",
    icon: HandCoins,
    orgFundingChairOnly: true,
  },
  {
    href: "/admin/career-fair/representative-sign-in",
    title: "Career Fair Representative Sign-In",
    description: "Sign in career fair representatives by location.",
    icon: UserPlus,
  },
  {
    href: "/admin/career-fair/tags",
    title: "Career Fair Tags Printing",
    description: "Print name tags for representatives; select printer and location.",
    icon: Printer,
  },
  {
    href: "/admin/resume-review-day/roster",
    title: "Resume Review Day Roster",
    description: "View employers and students signed up for Resume Review Day.",
    icon: ClipboardList,
  },
];

const eventChartConfig = chartConfigEventAttendance;
const gbmChartConfig = chartConfigGBMTrend;

export default function AdminDashboardPage() {
  const meQuery = useAuthMe();

  const visibleLinks = useMemo(() => {
    const showTreasurer = (meQuery.data?.is_treasurer ?? getIsTreasurerUser()) === true;
    const showOrgFundingChair =
      (meQuery.data?.is_org_funding_chair ?? getIsOrgFundingChairUser()) === true;
    return DASHBOARD_LINKS.filter((item) => {
      if (item.treasurerOnly && !showTreasurer) return false;
      if (item.orgFundingChairOnly && !showOrgFundingChair) return false;
      return true;
    });
  }, [meQuery.data]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#333333]">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Submit reimbursements, manage career fair sign-in and tags, and open the Resume
                Review Day roster. Treasurers see an extra tile for the reimbursement requests
                table. Engagement metrics are below.
              </p>
            </motion.div>

            {/* Quick links */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {visibleLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                  >
                    <Card className="h-full border-gray-200 transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-3 text-[#E00122]">
                          <Icon className="h-6 w-6" />
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-gray-600">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="bg-[#E00122] hover:bg-[#B8011C] rounded-md">
                          <Link to={item.href} className="inline-flex items-center gap-2">
                            Open
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-[#E00122]" />
                <h2 className="text-2xl font-bold tracking-tight text-[#333333]">
                  Engagement Metrics
                </h2>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Event Attendance</CardTitle>
                    <CardDescription>Attendance at recent events (placeholder data)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={eventChartConfig}
                      className="min-h-[240px] w-full"
                    >
                      <BarChart
                        data={ATTENDANCE_BY_EVENT}
                        margin={{ left: 12, right: 12 }}
                        accessibilityLayer
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="event"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(v) => (v.length > 12 ? v.slice(0, 12) + "…" : v)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#E00122]" />
                      General Body Meeting Trend
                    </CardTitle>
                    <CardDescription>Monthly GBM attendance (placeholder data)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={gbmChartConfig}
                      className="min-h-[240px] w-full"
                    >
                      <AreaChart
                        data={GBM_ATTENDANCE_TREND}
                        margin={{ left: 12, right: 12 }}
                        accessibilityLayer
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="attendance"
                          fill="var(--color-attendance)"
                          fillOpacity={0.3}
                          stroke="var(--color-attendance)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
