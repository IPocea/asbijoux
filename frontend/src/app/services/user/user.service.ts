import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private baseApiService: BaseApiService
  ) {}
  getAdminBoard(): Observable<string> {
    return this.http.get(this.baseApiService.getBaseApi() + '/send-key/admin', {
      responseType: 'text',
    });
  }
  getAdminComments(): Observable<string> {
    return this.http.get(
      this.baseApiService.getBaseApi() + '/send-comments-key/admin',
      { responseType: 'text' }
    );
  }
}
