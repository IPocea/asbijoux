import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../interfaces';
import {
  IProductComplete,
  IProductSimple,
} from '../interfaces/product.interface';

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
  getAlllPublishedCategories(): Observable<ICategories> {
    return this.http.get<ICategories>(
      'http://localhost:8080/api/products/find/published/categories'
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
  getAllBySelectedCategory(params: string): Observable<IProductComplete[]> {
    return this.http.get<IProductComplete[]>(
      `http://localhost:8080/api/products/find/category?category=${params}`
    );
  }
  getProduct(id: string): Observable<IProductComplete> {
    return this.http.get<IProductComplete>(
      `http://localhost:8080/api/products/${id}`
    );
  }
  getProductActiveComments(id: string): Observable<IProductComplete> {
    return this.http.get<IProductComplete>(
      `http://localhost:8080/api/products/active-comments/${id}`
    );
  }
  getProductsByTitle(title: string): Observable<IProductComplete[]> {
    return this.http.get<IProductComplete[]>(
      `http://localhost:8080/api/products?title=${title}`
    );
  }
}
