// committeesService.ts
// Replace the API URLs with your real backend routes.

export type CommitteeColor = 'indigo' | 'teal' | 'sky' | 'rose';

const HOST_URL = 'http://localhost:8000';

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

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const CommitteesService = {
  /** GET /api/committees -> Committee[] */
  async getCommittees(): Promise<Committee[]> {
    const res = await fetch(HOST_URL + '/dashboard/exec-role', { credentials: 'include' });
    return json<Committee[]>(res);
  },

  /** GET /api/committees/roles/:roleId/members -> Person[] */
  async getMembers(roleId: number): Promise<Person[]> {
    const res = await fetch(HOST_URL + `/api/committees/roles/${roleId}/members`, {
      credentials: 'include',
    });
    return json<Person[]>(res);
  },
};
