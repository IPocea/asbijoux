import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IImageSimple } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  addImage(API_KEY: string, form: FormData): Observable<any> {
    return this.http.post<IImageSimple>(
      `http://localhost:8080/api/images/${API_KEY}/upload`,
      form
    );
  }
}
