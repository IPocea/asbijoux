import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { IProductSimple } from 'src/app/interfaces/product.interface';
import { IPublic } from 'src/app/interfaces/public.interface';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @Input() API_KEY: string | undefined;
  errorMessageClass: string = 'error-message-on';
  errorMessage: string = '';
  successMessageClass: string = 'success-message-on';
  successMessage: string = '';
  categoryControl = new FormControl();
  categoryOptions: string[] = [];
  categoryFilteredOptions: Observable<string[]>;
  isLoading: boolean = false;
  title: string = '';
  productDescription: string = '';
  publicChoices: IPublic[] = [
    { value: true, viewValue: 'Da' },
    { value: false, viewValue: 'Nu' },
  ];
  publicSelectValue: boolean = true;
  constructor(
    private productService: ProductService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.successMessage = '';
    this.getCategories();
  }
  getCategories(): void {
    this.isLoading = true;
    this.productService
      .getAllCategories()
      .pipe(take(1))
      .subscribe(
        (data) => {
          for (let category of data.count) {
            this.categoryOptions.push(category.category);
          }
          this.categoryOptions.sort();
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    this.setCategoryFilteredOptions();
  }
  setCategoryFilteredOptions(): void {
    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categoryOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  addFullProduct(): void {
    this.successMessage = '';
    if (
      this.title.trim() === '' ||
      this.categoryControl.value.trim() === '' ||
      this.productDescription === null ||
      this.productDescription === ''
    ) {
      this.errorMessage = 'Te rugam sa completezi toate campurile.';
      return;
    }
    this.errorMessage = '';
    const product: IProductSimple = {
      title: this.title,
      category: this.categoryControl.value.toLowerCase(),
      isPublished: this.publicSelectValue,
      description: this.productDescription,
    };
    const imagesLength =
      document.getElementsByClassName('add-product-images').length;
    const images = [];
    for (let i = 0; i < imagesLength; i++) {
      if (
        (
          document.getElementsByClassName('add-product-images')[
            i
          ] as HTMLInputElement
        ).value
      ) {
        images.push(
          document.getElementsByClassName('add-product-images')[
            i
          ] as HTMLInputElement
        );
      }
    }
    this.isLoading = true;

    this.productService
      .addProduct(this.API_KEY, product)
      .pipe(take(1))
      .subscribe(
        (data) => {
          for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image.files[0] !== undefined) {
              const form = new FormData();
              form.append('file', image.files[0]);
              form.append('productId', data.id.toString());
              this.addSingleImage(this.API_KEY, form);
            }
          }
          this.resetData(images);
          this.getCategories();
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      );
  }
  addSingleImage(API_KEY: string, form: FormData): void {
    this.imageService
      .addImage(API_KEY, form)
      .pipe(take(1))
      .subscribe(
        (data) => {},
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoading = false;
          return;
        }
      );
  }
  resetData(images: HTMLInputElement[]): void {
    this.title = '';
    this.categoryControl = new FormControl();
    this.publicSelectValue = true;
    this.productDescription = '';
    this.categoryOptions = [];
    for (let i = 0; i < images.length; i++) {
      (images[i] as HTMLInputElement).value = '';
    }
    this.successMessage = 'Produsul a fost adaugat cu succes';
    this.isLoading = false;
  }
  counter(i: number) {
    return new Array(i);
  }
  checkSize(ev: any) {
    // 3670016 = 3.5 MB
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
}
