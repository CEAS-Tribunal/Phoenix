import axios from 'axios';

import { getAccessToken, registerAdminApiAuthRefresh } from '@auth';

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== ''
    ? HOST_URL
    : ''; // In dev with no env, use same origin so Vite proxy handles /api

export interface EmployerRegisterResponse {
  message: string;
  id?: string;
}

/** POST /api/resume-review-day/employer/ — `max_resumes` is set server-side from the time window. */
export interface EmployerData {
  full_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  diet_restriction: string;
  start_time: string;
  end_time: string;
  uc_alumni: boolean;
  selected_majors: string[];
}

/** Public GET /api/resume-review-day/employer/ list item */
export interface EmployerListItem {
  id: string;
  full_name: string;
  company_name: string;
  selected_majors: string[];
  available_slots: number;
}

export interface StudentData {
  full_name: string;
  email: string;
  grad_year: number;
  major: string;
  resume: File;
  timeslots: string[]; // Timeslot IDs
}

export interface AssignedTimeslotEntry {
  id: string;
  timeslot: string;
}

export interface StudentResponse {
  message: string;
  student_id: string;
  full_name: string;
  assigned_timeslots: AssignedTimeslotEntry[];
}

export interface EmployerTimeslot {
    id: string
    full_name: string
    company_name: string
    timeslots: Timeslot[]
}

export interface Timeslot {
    id: string
    time?: string
    timeslot?: string  // API returns this for TimeField
}

/** GET /api/resume-review-day/roster/ (authenticated) */
export interface RosterStudent {
  id: string;
  full_name: string;
  email: string;
  major: string;
  grad_year: number;
}

export interface RosterSlot {
  slot_id: string;
  time: string;
  student: RosterStudent | null;
}

export interface RosterEmployer {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  selected_majors: string[];
  start_time: string;
  end_time: string;
  max_resumes: number;
  slots: RosterSlot[];
}

export interface ResumeReviewSettings {
  employer_page_open: boolean;
  student_page_open: boolean;
}

function authHeader(): { Authorization: string } | Record<string, never> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

registerAdminApiAuthRefresh(axiosInstance);

export interface GetTimeslotsParams {
  major?: string;
  time?: string[];
}

export const ResumeReviewDay = {
  async getTimeslots(params?: GetTimeslotsParams): Promise<EmployerTimeslot[]> {
    const searchParams = new URLSearchParams();
    if (params?.major) searchParams.set('major', params.major);
    if (params?.time?.length) params.time.forEach((t) => searchParams.append('time', t));
    const query = searchParams.toString();
    const url = query
      ? `/api/resume-review-day/timeslots/?${query}`
      : '/api/resume-review-day/timeslots/';
    const { data } = await axiosInstance.get<EmployerTimeslot[]>(url);
    return data;
  },

  async getEmployers(): Promise<EmployerListItem[]> {
    const { data } = await axiosInstance.get<EmployerListItem[]>(
      '/api/resume-review-day/employer/'
    );
    return data;
  },

  async getRoster(): Promise<RosterEmployer[]> {
    const { data } = await axiosInstance.get<RosterEmployer[]>(
      '/api/resume-review-day/roster/',
      { headers: authHeader() }
    );
    return data;
  },

  async downloadResumesZip(): Promise<void> {
    const { data } = await axiosInstance.get<Blob>(
      '/api/resume-review-day/resumes/download/',
      { headers: authHeader(), responseType: 'blob' }
    );
    const objectUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'resume-review-day-resumes.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  },

  async getSettings(): Promise<ResumeReviewSettings> {
    const { data } = await axiosInstance.get<ResumeReviewSettings>(
      '/api/resume-review-day/settings/',
      { headers: authHeader() }
    );
    return data;
  },

  async updateSettings(
    settings: Partial<ResumeReviewSettings>
  ): Promise<ResumeReviewSettings> {
    const { data } = await axiosInstance.patch<ResumeReviewSettings>(
      '/api/resume-review-day/settings/',
      settings,
      { headers: authHeader() }
    );
    return data;
  },

  async registerEmployer(data: Record<string, unknown>) {
    const response = await axiosInstance.post<EmployerRegisterResponse>(
      '/api/resume-review-day/employer/',
      data
    );
    return { data: response.data, status: response.status };
  },

  async registerStudent(data: StudentData) {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('grad_year', String(data.grad_year));
    formData.append('major', data.major);
    formData.append('resume', data.resume);
    formData.append('timeslots', data.timeslots.join(','));
    // Let the browser set multipart boundary; a bare multipart/form-data header breaks uploads.
    const response = await axiosInstance.post<StudentResponse>(
      '/api/resume-review-day/student/',
      formData
    );
    return { data: response.data, status: response.status };
  }
};
