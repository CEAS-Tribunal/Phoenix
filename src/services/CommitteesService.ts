import axios from 'axios';

export type CommitteeColor = 'indigo' | 'teal' | 'sky' | 'rose';

const HOST_URL = import.meta.env.VITE_HOST_URL as string;

export interface CommitteeRole {
  id: number;
  role: string;
  description: string;
}

export interface Committee {
  id: string;
  title: string;
  subtitle?: string;
  color: CommitteeColor;    
  roles: CommitteeRole[];
}

export interface Person {
  name: string;
  email: string;
  imgURL?: string;
}

const axiosInstance = axios.create({
  baseURL: HOST_URL,
  withCredentials: false,
});

export const CommitteesService = {
  /** GET /dashboard/exec-role -> Committee[] */
  async getCommittees(): Promise<Committee[]> {
    console.log(HOST_URL + '/dashboard/exec-role');
    const { data } = await axiosInstance.get<Committee[]>(HOST_URL + '/dashboard/exec-role');
    return data;
  },

  /** GET /api/committees/roles/:roleId/members -> Person[] */
  async getMembers(roleId: number): Promise<Person[]> {
    const { data } = await axiosInstance.get<Person[]>(HOST_URL + `/dashboard/exec-member/?roleId=${roleId}`);
    return data;
  },
};