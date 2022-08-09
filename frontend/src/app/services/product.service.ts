import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories, IEditDeleteResponse } from '../interfaces';
import { IProduct } from '../interfaces/product.interface';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private baseApiService: BaseApiService
  ) {}
  addProduct(API_KEY: string, product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(
      this.baseApiService.getBaseApi() + `/products/${API_KEY}/`,
      product
    );
  }
  deleteProduct(API_KEY: string, id: number): Observable<IProduct> {
    return this.http.delete<IProduct>(
      this.baseApiService.getBaseApi() + `/products/${API_KEY}/${id}`
    );
  }
  editProduct(
    API_KEY: string,
    product: IProduct
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      this.baseApiService.getBaseApi() + `/products/${API_KEY}/${product.id}`,
      product
    );
  }
  getAllProducts(API_KEY: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      this.baseApiService.getBaseApi() + `/products/${API_KEY}`
    );
  }
  getAllCategories(API_KEY: string): Observable<ICategories> {
    return this.http.get<ICategories>(
      this.baseApiService.getBaseApi() + `/products/find/categories/${API_KEY}`
    );
  }
  getAlllPublishedCategories(): Observable<ICategories> {
    return this.http.get<ICategories>(
      this.baseApiService.getBaseApi() + '/products/find/published/categories'
    );
  }
  getAllBySelectedCategory(params: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      this.baseApiService.getBaseApi() +
        `/products/find/category?category=${params}`
    );
  }
  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(
      this.baseApiService.getBaseApi() + `/products/${id}`
    );
  }
  getProductActiveComments(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(
      this.baseApiService.getBaseApi() + `/products/active-comments/${id}`
    );
  }
  getProductsByTitle(title: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      this.baseApiService.getBaseApi() + `/products/public?title=${title}`
    );
  }
}
