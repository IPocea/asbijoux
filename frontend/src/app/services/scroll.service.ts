import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor() {}
  scrollTo(id: string): void {
    setTimeout(() => {
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  }
}
