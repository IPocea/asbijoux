import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICarousel } from '../interfaces/carousel.interface';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  constructor(private http: HttpClient) {}
  getAllImages(): Observable<ICarousel[]> {
    return this.http.get<ICarousel[]>(
      'http://localhost:8080/api/carousel-images'
    );
  }
  sortImages(carouselImages: ICarousel[]) {
    carouselImages.sort((a, b) => {
      return a.position - b.position;
    });
  }
}
