import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ICarousel, IObjCarouselImagesForDelete } from '@interfaces';
import { CarouselService } from '@services';

@Component({
  selector: 'app-carousel-admin',
  templateUrl: './carousel-admin.component.html',
  styleUrls: ['./carousel-admin.component.scss'],
})
export class CarouselAdminComponent implements OnInit {
  @Input() API_KEY: string;
  isLoading: boolean = false;
  carouselImages: ICarousel[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.getData();
  }
  counter(i: number) {
    return new Array(i);
  }
  checkSize(ev: any) {
    if (ev.target.files[0]) {
      if (ev.target.files[0].size > 3670016) {
        ev.target.value = '';
        this.errorMessage =
          'Imaginea depaseste dimensiunea 3.5MB. Te rugam sa alegi o imagine cu o dimensiune mai mica.';
      } else {
        this.errorMessage = '';
      }
    }
  }
  deleteCarousel(): void {
    const result = confirm(`Esti singur ca doresti sa stergi toate pozele?`);
    if (result) {
      this.deleteAllCarouselImages(this.API_KEY, this.carouselImages);
    }
  }
  deleteImage(carousel: ICarousel, i: number): void {
    const result = confirm(`Esti singur ca doresti sa stergi aceasta poza?`);
    if (result) {
      this.isLoading = true;
      this.carouselService
        .deleteImage(this.API_KEY, carousel)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.displayMessage(
              true,
              `Poza ${carousel.name} a fost stearsa cu succes.`
            );
            this.carouselImages.splice(i, 1);
            this.isLoading = false;
          },
          error: (err) => {
            this.displayMessage(false, err.message);
            this.isLoading = false;
          },
        });
    }
  }
  updateCarousel(): void {
    const imagesLength =
      document.getElementsByClassName('carousel-inputs').length;
    const images = [];
    for (let i = 0; i < imagesLength; i++) {
      if (
        (
          document.getElementsByClassName('carousel-admin-images')[
            i
          ] as HTMLInputElement
        ).value &&
        (
          document.getElementsByClassName('carousel-admin-ids')[
            i
          ] as HTMLInputElement
        ).valueAsNumber > 0 &&
        (
          document.getElementsByClassName('carousel-admin-ids')[
            i
          ] as HTMLInputElement
        ).valueAsNumber %
          1 ===
          0
      ) {
        images.push({
          image: document.getElementsByClassName('carousel-admin-images')[
            i
          ] as HTMLInputElement,
          productId: (
            document.getElementsByClassName('carousel-admin-ids')[
              i
            ] as HTMLInputElement
          ).valueAsNumber,
          position: (
            document.getElementsByClassName('carousel-admins-positions')[
              i
            ] as HTMLInputElement
          ).valueAsNumber,
        });
      }
    }
    if (!images.length) {
      this.displayMessage(
        false,
        'Nu ai incarcat nici o imagine sau nu ai introdus un id valid'
      );
      return;
    }
    this.isLoading = true;
    for (let i = 0; i < images.length; i++) {
      const imageObj = images[i];
      if (imageObj.image.files[0] !== undefined) {
        const form = new FormData();
        form.append('file', imageObj.image.files[0]);
        form.append('productId', imageObj.productId);
        form.append('position', imageObj.position);
        this.addSingleCarouselImage(this.API_KEY, form);
      }
    }
    this.displayMessage(true, 'Caruselul a fost actualizat cu succes');
    setTimeout(() => {
      this.getData();
    }, 500);
  }
  private addSingleCarouselImage(API_KEY: string, form: FormData): void {
    this.carouselService
      .addImage(API_KEY, form)
      .pipe(take(1))
      .subscribe({
        next: (res) => {},
        error: (err) => {
          this.displayMessage(false, err.message);
          this.isLoading = false;
        },
      });
  }
  private deleteAllCarouselImages(
    API_KEY: string,
    carouselImages: ICarousel[]
  ): void {
    this.isLoading = true;
    const carousel: IObjCarouselImagesForDelete = {
      carouselImages: [],
    };
    for (let item of carouselImages) {
      carousel.carouselImages.push({ name: item.name });
    }
    this.carouselService
      .deleteAllImages(API_KEY, carousel)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.displayMessage(true, 'Imaginile au fost sterse cu succes');
          this.getData();
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Te rugam sa incerci din nou'
          );
          this.isLoading = false;
        },
      });
  }
  private displayMessage(type: boolean, message: string): void {
    if (type) {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    this.hideMessage();
  }
  private hideMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 2000);
  }
  private getData(): void {
    this.isLoading = true;
    this.carouselService
      .getAllImages()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.carouselImages = data;
          this.carouselService.sortImages(this.carouselImages);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
}
