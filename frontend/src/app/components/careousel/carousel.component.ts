import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ICarousel } from '@interfaces';
import { CarouselService } from '@services';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  carouselClass: string = 'carousel-item active';
  srcMain: string = 'assets/asbijoux-atelierelor-main-image.jpg';
  srcRightItem: string = 'assets/asbijoux-inel-de-logodna.jpg';
  srcLeftItem: string = 'assets/asbijoux-inel-roman.PNG';
  titleMain: string = 'Verighete din Aur AsBijoux';
  titleRight: string = 'Inel de logodna AsBijoux';
  titleLeft: string = 'Inel roman AsBijoux';
  private imgArray: string[] = [
    'assets/asbijoux-atelierelor-main-image.jpg',
    'assets/asbijoux-inel-de-logodna.jpg',
    'assets/asbijoux-inel-roman.PNG',
  ];
  private titlesArray: string[] = [
    'Verighete din Aur AsBijoux',
    'Inel de logodna AsBijoux',
    'Inel roman AsBijoux',
  ];
  private productsId: number[] = [];
  private carouselProducts: ICarousel[] = [];
  private indexMain: number = 0;
  private indexRight: number = 1;
  private indexLeft: number = 2;
  private int: any;
  constructor(
    private carouselService: CarouselService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.carouselService
      .getAllImages()
      .pipe(take(1))
      .subscribe({
        next: (datas) => {
          if (datas.length >= 3) {
            this.indexMain = 1;
            this.indexRight = 2;
            this.indexLeft = 0;
            this.carouselProducts = datas;
            this.carouselService.sortImages(this.carouselProducts);
            this.imgArray = [];
            this.titlesArray = [];
            for (let item of this.carouselProducts) {
              this.imgArray.push(item.url);
              this.productsId.push(item.productId);
              this.titlesArray.push(item.product.title);
            }
            this.srcLeftItem = this.imgArray[this.indexLeft];
            this.srcMain = this.imgArray[this.indexMain];
            this.srcRightItem = this.imgArray[this.indexRight];
            this.titleLeft = this.titlesArray[this.indexLeft];
            this.titleMain = this.titlesArray[this.indexMain];
            this.titleRight = this.titlesArray[this.indexRight];
            setTimeout(this.toggleImage.bind(this), 2000);
            this.int = setInterval(this.toggleImage.bind(this), 7000);
            this.isLoading = false;
          } else {
            setTimeout(this.toggleImage.bind(this), 2000);
            this.int = setInterval(this.toggleImage.bind(this), 7000);
            this.isLoading = false;
          }
        },
        error: (err) => {
          setTimeout(this.toggleImage.bind(this), 2000);
          this.int = setInterval(this.toggleImage.bind(this), 7000);
          this.isLoading = false;
        },
      });
  }
  goToProduct(src: string): void {
    if (this.carouselProducts.length) {
      for (let item of this.carouselProducts) {
        if (src === item.url) {
          this.router.navigate([
            '/produs',
            item.product.category,
            item.product.title,
            item.product.id,
          ]);
          return;
        }
      }
    }
  }
  private toggleImage(): void {
    this.carouselClass = 'carousel-item';
    setTimeout(() => {
      if (this.indexMain < this.imgArray.length - 1) {
        this.indexMain++;
      } else {
        this.indexMain = 0;
      }
      if (this.indexRight < this.imgArray.length - 1) {
        this.indexRight++;
      } else {
        this.indexRight = 0;
      }
      if (this.indexLeft < this.imgArray.length - 1) {
        this.indexLeft++;
      } else {
        this.indexLeft = 0;
      }
      this.srcMain = this.imgArray[this.indexMain];
      this.srcRightItem = this.imgArray[this.indexRight];
      this.srcLeftItem = this.imgArray[this.indexLeft];
      this.titleMain = this.titlesArray[this.indexMain];
      this.titleRight = this.titlesArray[this.indexRight];
      this.titleLeft = this.titlesArray[this.indexLeft];
      this.carouselClass = 'carousel-item';

      setTimeout(() => {
        this.carouselClass = 'carousel-item active';
      }, 500);
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.int);
  }
}
