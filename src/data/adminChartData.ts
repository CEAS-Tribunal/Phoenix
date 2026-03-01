/**
 * Mock data for admin dashboard charts (frontend-only placeholders).
 */

export const ATTENDANCE_BY_EVENT = [
  { event: "General Body Meeting", attendance: 85 },
  { event: "Career Fair", attendance: 320 },
  { event: "CEAS EXPO", attendance: 180 },
  { event: "Resume Review Day", attendance: 95 },
  { event: "E-Week Kickoff", attendance: 150 },
  { event: "Committee Mixer", attendance: 62 },
];

export const GBM_ATTENDANCE_TREND = [
  { month: "Sep", attendance: 72 },
  { month: "Oct", attendance: 78 },
  { month: "Nov", attendance: 85 },
  { month: "Dec", attendance: 68 },
  { month: "Jan", attendance: 82 },
  { month: "Feb", attendance: 90 },
];

export const chartConfigEventAttendance = {
  event: { label: "Event" },
  attendance: { label: "Attendance", color: "#E00122" },
} as const;

export const chartConfigGBMTrend = {
  month: { label: "Month" },
  attendance: { label: "Attendance", color: "#E00122" },
} as const;
