import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ClipboardList,
  HandCoins,
  Printer,
  Receipt,
  Table2,
  UserPlus,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { getIsOrgFundingChairUser, getIsTreasurerUser, useAuthMe } from "@auth";

type DashboardLinkCategory = "general" | "org-funding" | "career-dev" | "ic";

const DASHBOARD_CATEGORIES: { id: DashboardLinkCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "org-funding", label: "Org Funding" },
  { id: "career-dev", label: "Career Development" },
  { id: "ic", label: "Innovation Challenge" }
];

type DashboardLinkItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: DashboardLinkCategory;
  treasurerOnly?: boolean;
  orgFundingChairOnly?: boolean;
};

const DASHBOARD_LINKS: DashboardLinkItem[] = [
  {
    href: "/admin/reimbursements",
    title: "Reimbursement request",
    description: "Submit an internal reimbursement request with receipt and purchase details.",
    icon: Receipt,
    category: "general",
  },
  {
    href: "/admin/reimbursements/requests",
    title: "Reimbursement requests (treasurer)",
    description:
      "Treasurer dashboard: review all requests, filter, and mark each as filed when submitted to the university.",
    icon: Table2,
    category: "general",
    treasurerOnly: true,
  },
  {
    href: "/admin/org-funding",
    title: "Org funding (chair)",
    description:
      "Org Funding chair dashboard: review submissions, verify required documents against the checklist, and update request status.",
    icon: HandCoins,
    category: "org-funding",
    orgFundingChairOnly: true,
  },
  {
    href: "/career-fair/representative-sign-in",
    title: "Career Fair Representative Sign-In",
    description: "Sign in career fair representatives by location.",
    icon: UserPlus,
    category: "career-dev",
  },
  {
    href: "/admin/career-fair/tags",
    title: "Career Fair Tags Printing",
    description: "Print name tags for representatives; select printer and location.",
    icon: Printer,
    category: "career-dev",
  },
  {
    href: "/admin/resume-review-day/roster",
    title: "Resume Review Day Roster",
    description: "View employers and students signed up for Resume Review Day.",
    icon: ClipboardList,
    category: "career-dev",
  },
];

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

  const visibleCategories = useMemo(
    () =>
      DASHBOARD_CATEGORIES.filter((category) =>
        visibleLinks.some((item) => item.category === category.id),
      ),
    [visibleLinks],
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab =
    visibleCategories.find((category) => category.id === requestedTab)?.id ??
    visibleCategories[0]?.id;

  const handleTabChange = (value: string) => {
    setSearchParams(
      (params) => {
        params.set("tab", value);
        return params;
      },
      { replace: true },
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 bg-white">
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
            <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-0">
              <TabsList className="relative h-auto w-full items-end justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-0 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[#E00122]">
                {visibleCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="relative h-auto flex-none rounded-none rounded-t-lg border border-b-0 border-transparent bg-gray-100 px-3 py-2.5 text-gray-600 hover:bg-gray-200/70 hover:text-[#333333] sm:px-5 data-[state=active]:z-10 data-[state=active]:border-[#E00122] data-[state=active]:bg-white data-[state=active]:text-[#E00122] data-[state=active]:shadow-none data-[state=active]:hover:bg-white"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {visibleCategories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="pt-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleLinks
                      .filter((item) => item.category === category.id)
                      .map((item, i) => {
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
                                <Button
                                  asChild
                                  className="bg-[#E00122] hover:bg-[#B8011C] rounded-md"
                                >
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
                </TabsContent>
              ))}
            </Tabs>

            {/* Metrics */}
            {/*}
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
                      className="min-h-60 w-full"
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
                      className="min-h-60 w-full"
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
            */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
