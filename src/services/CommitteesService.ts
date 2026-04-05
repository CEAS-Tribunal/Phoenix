import axios from 'axios';

export type CommitteeColor = 'indigo' | 'teal' | 'sky' | 'rose';

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL =
  HOST_URL !== undefined && HOST_URL !== ''
    ? HOST_URL
    : '';

/** Executive member (from GET /dashboard/exec-member/?roleId= or embedded in exec-role). */
export interface ExecMemberPerson {
  id: string;
  name: string;
  email: string;
  imgURL?: string | null;
}

/** Executive role, optionally with members (when include_members=true). */
export interface ExecRoleItem {
  id: number;
  role: string;
  description: string;
  members?: ExecMemberPerson[];
}

/** Executive section (Officers, Chief of Staff, VPCA, VPE) from GET /dashboard/exec-role. */
export interface ExecRoleSection {
  id: string;
  color: CommitteeColor;
  title: string;
  subtitle?: string;
  roles: ExecRoleItem[];
}

/** Legacy alias for ExecRoleSection (used by getCommittees). */
export interface Committee {
  id: string;
  title: string;
  subtitle?: string;
  color: CommitteeColor;
  roles: ExecRoleItem[];
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

export const CommitteesService = {
  /** GET /dashboard/exec-role -> ExecRoleSection[] (Officers, CoS, VPCA, VPE with roles). */
  async getExecRoleSections(): Promise<ExecRoleSection[]> {
    const { data } = await axiosInstance.get<ExecRoleSection[]>('/dashboard/exec-role/');
    return data;
  },

  /** GET /dashboard/exec-role?include_members=true -> sections with roles and members in one call. */
  async getExecRoleSectionsWithMembers(): Promise<ExecRoleSection[]> {
    const { data } = await axiosInstance.get<ExecRoleSection[]>('/dashboard/exec-role/', {
      params: { include_members: 'true' },
    });
    return data;
  },

  /** GET /dashboard/exec-member/?roleId= -> ExecMemberPerson[] for a given role. */
  async getExecMembersByRoleId(roleId: number): Promise<ExecMemberPerson[]> {
    const { data } = await axiosInstance.get<ExecMemberPerson[]>('/dashboard/exec-member/', {
      params: { roleId },
    });
    return data;
  },

  /** Alias for getExecRoleSections for backward compatibility. */
  async getCommittees(): Promise<Committee[]> {
    return this.getExecRoleSections();
  },

  /** Alias for getExecMembersByRoleId. */
  async getMembers(roleId: number): Promise<ExecMemberPerson[]> {
    return this.getExecMembersByRoleId(roleId);
  },
};
