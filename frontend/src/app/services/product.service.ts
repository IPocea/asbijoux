import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories, IEditDeleteResponse } from '../interfaces';
import { IProduct } from '../interfaces/product.interface';

const BASE_API = 'http://localhost:8080/api';
// const BASE_API = 'https://asbijoux.ro:60502/api';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  addProduct(API_KEY: string, product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(
      BASE_API + `/products/${API_KEY}/`,
      product
    );
  }
  deleteProduct(API_KEY: string, id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(BASE_API + `/products/${API_KEY}/${id}`);
  }
  editProduct(
    API_KEY: string,
    product: IProduct
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      BASE_API + `/products/${API_KEY}/${product.id}`,
      product
    );
  }
  getAllProducts(API_KEY: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(BASE_API + `/products/${API_KEY}`);
  }
  getAllCategories(API_KEY: string): Observable<ICategories> {
    return this.http.get<ICategories>(
      BASE_API + `/products/find/categories/${API_KEY}`
    );
  }
  getAlllPublishedCategories(): Observable<ICategories> {
    return this.http.get<ICategories>(
      BASE_API + '/products/find/published/categories'
    );
  }
  getAllBySelectedCategory(params: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      BASE_API + `/products/find/category?category=${params}`
    );
  }
  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(BASE_API + `/products/${id}`);
  }
  getProductActiveComments(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(
      BASE_API + `/products/active-comments/${id}`
    );
  }
  getProductsByTitle(title: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      BASE_API + `/products/public?title=${title}`
    );
  }
}
