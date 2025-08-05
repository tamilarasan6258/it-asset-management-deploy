import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedRequestResponse, RequestData, RequestResponse, RequestSummary } from '../../models/request.model';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/auth.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.request_apiBaseUrl;

  createRequest(data: { asset_category: string; reason: string }) : Observable<RequestResponse> {
    return this.http.post<RequestResponse>(`${this.apiUrl}`, data);
  }


  getMyRequests(page: number = 1, limit: number = 5, search = '', status = ''): Observable<PagedRequestResponse>  {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${search}`;
    if (status) query += `&status=${status}`;
    return this.http.get<any>(`${this.apiUrl}/my${query}`);
  }



  getDeptHeadRequests(): Observable<RequestData[]> {
    return this.http.get<RequestData[]>(`${this.apiUrl}/department`);
  }

  updateRequestStatus(id: string, status: 'approved' | 'rejected'): Observable<RequestResponse> {
    return this.http.patch<RequestResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  reviewRequestByAdmin(id: string, status: string, adminRemarks: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.apiUrl}/admin-review/${id}`, { status, adminRemarks });
  }

  forwardToAdmin(id: string): Observable<MessageResponse>  {
    return this.http.put<MessageResponse>(`${this.apiUrl}/forward/${id}`, {});
  }

  getDeptHeadForwardedRequests(): Observable<RequestData[]> {
    return this.http.get<RequestData[]>(`${this.apiUrl}/forwarded`); // or a custom endpoint for admin view if needed
  }

  getAdminApprovedRequests(): Observable<RequestData[]> {
    return this.http.get<RequestData[]>(`${this.apiUrl}/admin-approved`);
  }

  getRequestAssetSummary(): Observable<RequestSummary[]>{
    return this.http.get<RequestSummary[]>(`${this.apiUrl}/summary`);
  }


}
