import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IEditDeleteResponse,
  ICarousel,
  IObjCarouselImagesForDelete,
} from '@interfaces';
import { BaseApiService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  constructor(
    private http: HttpClient,
    private baseApiService: BaseApiService
  ) {}
  getAllImages(): Observable<ICarousel[]> {
    return this.http.get<ICarousel[]>(
      this.baseApiService.getBaseApi() + '/carousel-images'
    );
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
      this.baseApiService.getBaseApi() + `/carousel-images/${API_KEY}/unlink`,
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
      this.baseApiService.getBaseApi() +
        `/carousel-images/${API_KEY}/unlink-all`,
      carouselImages
    );
  }
  addImage(API_KEY: string, form: FormData): Observable<ICarousel> {
    return this.http.post<ICarousel>(
      this.baseApiService.getBaseApi() + `/carousel-images/${API_KEY}/upload`,
      form
    );
  }
}
