import axios from 'axios';
const HOST_URL = import.meta.env.VITE_HOST_URL as string;

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

export interface StudentData{
  full_name: string
  email: string
  grad_year: number
  major: string
  resume: File
  timeslot: string[]
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
  baseURL: HOST_URL,
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
    return { message: response.data, status: response.status };
  },

  async registerStudent(data: StudentData) {
    const response = await axiosInstance.post<StudentResponse>('/api/resume-review-day/student/', data);
    return { data: response.data, status: response.status}
  }
};