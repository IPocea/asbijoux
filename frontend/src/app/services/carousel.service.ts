import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEditDeleteResponse } from '../interfaces';
import {
  ICarousel,
  IObjCarouselImagesForDelete,
} from '../interfaces/carousel.interface';

const BASE_API = 'http://localhost:8080/api';
// const BASE_API = 'https://asbijoux.ro:60502/api';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  constructor(private http: HttpClient) {}
  getAllImages(): Observable<ICarousel[]> {
    return this.http.get<ICarousel[]>(BASE_API + '/carousel-images');
  }
  sortImages(carouselImages: ICarousel[]) {
    carouselImages.sort((a, b) => {
      return a.position - b.position;
    });
  }
  deleteImage(
    API_KEY: string,
    carousel: ICarousel
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      BASE_API + `/carousel-images/${API_KEY}/unlink`,
      {
        fileName: carousel.name,
        id: carousel.id,
      }
    );
  }
  deleteAllImages(
    API_KEY: string,
    carouselImages: IObjCarouselImagesForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      BASE_API + `/carousel-images/${API_KEY}/unlink-all`,
      carouselImages
    );
  }
  adImage(API_KEY: string, form: FormData): Observable<ICarousel> {
    return this.http.post<ICarousel>(
      BASE_API + `/carousel-images/${API_KEY}/upload`,
      form
    );
  }
}
