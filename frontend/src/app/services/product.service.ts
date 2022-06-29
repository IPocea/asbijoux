import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories, IEditDeleteResponse } from '../interfaces';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  addProduct(API_KEY: string, product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(
      `http://localhost:8080/api/products/${API_KEY}/`,
      product
    );
  }
  deleteProduct(API_KEY: string, id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(
      `http://localhost:8080/api/products/${API_KEY}/${id}`
    );
  }
  editProduct(
    API_KEY: string,
    product: IProduct
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      `http://localhost:8080/api/products/${API_KEY}/${product.id}`,
      product
    );
  }
  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>('http://localhost:8080/api/products');
  }
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
  getAllBySelectedCategory(params: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      `http://localhost:8080/api/products/find/category?category=${params}`
    );
  }
  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`http://localhost:8080/api/products/${id}`);
  }
  getProductActiveComments(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(
      `http://localhost:8080/api/products/active-comments/${id}`
    );
  }
  getProductsByTitle(title: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      `http://localhost:8080/api/products?title=${title}`
    );
  }
}
