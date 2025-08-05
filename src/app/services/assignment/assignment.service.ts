import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignment } from '../../models/assignment.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl = environment.assignment_apiBaseUrl;
  constructor(private http: HttpClient) { }

  getMyAssignments(): Observable<Assignment[]>{
    return this.http.get<Assignment[]>(`${this.apiUrl}/my`);
  }

  assignAsset(requestId: string, assetId: string): Observable<{ message: string; assignment: Assignment }> {
    return this.http.post<{ message: string; assignment: Assignment }>(`${this.apiUrl}`, { requestId, assetId });
  }


  requestReturn(assignmentId: string): Observable<{ message: string; assignment: Assignment }> {
    return this.http.patch<{ message: string; assignment: Assignment }>(`${this.apiUrl}/${assignmentId}/request-return`, {});
  }


  getReturnRequestsForDeptHead(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/return-requests-dept`);
  }



  approveReturnByDeptHead(id: string): Observable<{ message: string; assignment: Assignment }> {
    return this.http.patch<{ message: string; assignment: Assignment }>(`${this.apiUrl}/${id}/approve-return`, {});
  }

  getPendingReturnsForAdmin(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/pending-returns`);
  }

  finalizeReturnByAdmin(id: string, condition: string): Observable<{ message: string; assignment: Assignment }>  {
    return this.http.patch<{ message: string; assignment: Assignment }>(`${this.apiUrl}/${id}/finalize-return`, { condition });
  }


  getAllDeptAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/dept-assets`);
  }

  getAllEmployeeAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/all`);
  }


}
