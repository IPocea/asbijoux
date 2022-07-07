import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8080/api/send-key/admin';
const API_URL_COMMENTS = 'http://localhost:8080/api/send-comments-key/admin';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL, { responseType: 'text' });
  }
  getAdminComments(): Observable<any> {
    return this.http.get(API_URL_COMMENTS, { responseType: 'text' });
  }
}
