import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../interfaces/categories.interface';
import { IProductSimple } from '../interfaces/product.interface';

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
  addProduct(
    API_KEY: string,
    product: IProductSimple
  ): Observable<IProductSimple> {
    return this.http.post<IProductSimple>(
      `http://localhost:8080/api/products/${API_KEY}/`,
      product
    );
  }
}
