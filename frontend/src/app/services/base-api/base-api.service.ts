import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor() {}
  getBaseApi(): string {
    return 'http://localhost:8080/api';
  }
  // getBaseApi(): string {
  //   return 'https://asbijoux.ro:60502/api';
  // }
}
