import axios from 'axios';

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== ''
    ? HOST_URL
    : ''; // In dev with no env, use same origin so Vite proxy handles /api

export interface EmployerResponse {
  message: string 
  status: string
}

export interface EmployerData {
  full_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  diet_restriction: string;
  start_time: string;
  end_time: string;
  max_resumes: number;
  uc_alumni: boolean;
  selected_majors: string[];
}

export interface StudentData {
  full_name: string;
  email: string;
  grad_year: number;
  major: string;
  resume: File;
  timeslots: string[]; // Timeslot IDs
}

export interface StudentResponse {
  message: string
  student_id: string
  full_name: string
  assigned_timeslots: string[]
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


const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

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
    const url = query ? `/api/resume-review-day/timeslots?${query}` : '/api/resume-review-day/timeslots';
    const { data } = await axiosInstance.get<EmployerTimeslot[]>(url);
    return data;
  },

  async registerEmployer(data: EmployerData) {
    const response = await axiosInstance.post<EmployerResponse>('/api/resume-review-day/employer/', data);
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
    const response = await axiosInstance.post<StudentResponse>('/api/resume-review-day/student/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: response.data, status: response.status };
  }
};