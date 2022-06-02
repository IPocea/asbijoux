import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../interfaces/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  getAllCategories(): Observable<ICategories> {
    return this.http.get<ICategories>(
      'http://localhost:8080/api/products/find/categories'
    );
  }
}
