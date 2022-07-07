import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEditDeleteResponse } from '../interfaces/edit-delete.interface';
import {
  IImageSimple,
  IObjImagesForDelete,
} from '../interfaces/image.interface';
import { IProduct } from '../interfaces/product.interface';

const BASE_API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  addImage(API_KEY: string, form: FormData): Observable<IImageSimple> {
    return this.http.post<IImageSimple>(
      BASE_API + `/images/${API_KEY}/upload`,
      form
    );
  }
  deleteImage(
    API_KEY: string,
    image: IImageSimple
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      BASE_API + `/images/${API_KEY}/unlink`,
      { fileName: image.name, imageId: image.id }
    );
  }
  deleteAllImages(
    API_KEY: string,
    images: IObjImagesForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      BASE_API + `/images/${API_KEY}/unlink-all`,
      images
    );
  }
  sortImages(product: IProduct): void {
    product.images.sort((a, b) =>
      a.isMainImage > b.isMainImage ? -1 : b.isMainImage > a.isMainImage ? 1 : 0
    );
  }
}
