import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '@services';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private baseApiService: BaseApiService
  ) {}
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.baseApiService.getBaseApi() + '/auth/signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }
  logout(): Observable<any> {
    return this.http.post(
      this.baseApiService.getBaseApi() + '/auth/signout',
      {},
      httpOptions
    );
  }
}
