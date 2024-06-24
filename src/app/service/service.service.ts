import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl = 'http://localhost:3500';

  constructor(private http: HttpClient) {}


  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, user);
  }
  
  checksession(token: string | null): Observable<any> {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.baseUrl}/users/checksession`, { headers });
  }

  getGames() {
    return this.http.get(`${this.baseUrl}/games`);
  }


}
