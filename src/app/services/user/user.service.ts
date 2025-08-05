import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from '../../models/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
// import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.user_apiBaseUrl;

  constructor(private http: HttpClient) { }

  createUser(data: User) : Observable<UserResponse> {

    return this.http.post<UserResponse>(`${this.apiUrl}`, data);
  }
}
