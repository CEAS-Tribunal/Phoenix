import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExecRoleService {
  private readonly apiUrl = 'http://localhost:8000/dashboard/exec-role/';

  constructor(private http: HttpClient) {}

  getExecRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
