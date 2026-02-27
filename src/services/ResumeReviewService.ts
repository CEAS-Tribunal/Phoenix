import axios from 'axios';
const HOST_URL = import.meta.env.VITE_HOST_URL as string;

export interface CommitteeRole {
  id: number;
  role: string;
  description: string;
}

export interface EmployerTimeslot {
    id: string
    full_name: string
    company_name: string
    timeslots: Timeslot[]
}

export interface Timeslot {
    id: string
    time: string
}

const axiosInstance = axios.create({
  baseURL: HOST_URL,
  withCredentials: false,
});

export const ResumeReviewDay = {
  async getTimeslots(): Promise<EmployerTimeslot[]> {
    const { data } = await axiosInstance.get<EmployerTimeslot[]>('/api/resume-review-day/timeslots');
    return data;
  },

  async registerEmployer(data: Record<string, unknown>) {
    const response = await axiosInstance.post('/api/resume-review-day/employer/', data);
    return { data: response.data, status: response.status };
  },
};
