import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Person {
  id: string;
  name: string;
  email: string;
  imgURL: string;
}

export interface CommitteeRole {
  id: number;
  role: string;
  description: string;
}

export interface Committee {
  id: string;
  color: string;
  title: string;
  subtitle: string;
  roles: CommitteeRole[];
}

@Injectable({
  providedIn: 'root',
})
export class CommitteesService {
  private baseUrl = 'http://localhost:8000'; // adjust if needed

  constructor(private http: HttpClient) {}

  /** Replace '/committees' with your actual endpoint */
  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>(`${this.baseUrl}/dashboard/exec-role/`);
  }

  /** Fetch members for a given role ID */
  getMembers(roleId: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/dashboard/exec-member/?roleId=${roleId}`);
  }
}