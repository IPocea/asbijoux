import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IImageSimple, IProduct, IPublic } from '@interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ImageService, ProductService, CommentService } from '@services';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input() productId: number;
  @Input() API_KEY: string | undefined;
  @Output() sendData = new EventEmitter<boolean>();
  product: IProduct;
  isEditing: boolean = true;
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
  publicSelectValue: boolean;

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.successMessage = '';
    this.getData();
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
  deleteImage(image: IImageSimple, i: number): void {
    const result = confirm(`Esti singur ca doresti sa stergi aceasta poza?`);
    if (result) {
      this.isLoading = true;
      this.imageService
        .deleteImage(this.API_KEY, image)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.successMessage = `Poza ${image.name} a fost stearsa cu succes.`;
            this.product.images.splice(i, 1);
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = err.message || err.message.message;
            this.isLoading = false;
          },
        });
    }
  }
  editProduct(ev: Event): void {
    ev.preventDefault();
    this.successMessage = '';
    if (
      this.title.trim() === '' ||
      this.categoryControl.value === null ||
      this.categoryControl.value.trim() === '' ||
      this.productDescription === null ||
      this.productDescription === ''
    ) {
      this.errorMessage = 'Te rugam sa completezi toate campurile.';
      return;
    }
    this.errorMessage = '';
    const productToEdit: IProduct = {
      id: this.productId,
      title: this.title,
      category:
        this.categoryControl.value.slice(0, 1).toUpperCase() +
        this.categoryControl.value.slice(1).toLowerCase(),
      isPublished: this.publicSelectValue,
      description: this.productDescription,
    };
    const mainImage = document.getElementById(
      'edit-product-main-image'
    ) as HTMLInputElement;
    const imagesLength = document.getElementsByClassName(
      'edit-product-images'
    ).length;
    const images = [];
    for (let i = 0; i < imagesLength; i++) {
      if (
        (
          document.getElementsByClassName('edit-product-images')[
            i
          ] as HTMLInputElement
        ).value
      ) {
        images.push(
          document.getElementsByClassName('edit-product-images')[
            i
          ] as HTMLInputElement
        );
      }
    }
    this.isLoading = true;
    this.productService
      .editProduct(this.API_KEY, productToEdit)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (mainImage?.value) {
            const formMainImage = new FormData();
            formMainImage.append('file', mainImage.files[0]);
            formMainImage.append('productId', productToEdit.id.toString());
            formMainImage.append('isMainImage', 'true');
            this.addSingleImage(this.API_KEY, formMainImage);
          }
          for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image.files[0] !== undefined) {
              const form = new FormData();
              form.append('file', image.files[0]);
              form.append('productId', productToEdit.id.toString());
              this.addSingleImage(this.API_KEY, form);
            }
          }
          this.successMessage = 'Produsul a fost editat cu succes.';
          setTimeout(() => {
            this.getData();
          }, 500);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isLoading = false;
          return;
        },
      });
  }
  goBack(): void {
    this.isEditing = false;
    this.sendData.emit(this.isEditing);
  }
  private addSingleImage(API_KEY: string, form: FormData): void {
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
  private getData(): void {
    this.isLoading = true;
    this.productService
      .getProduct(this.productId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.product = data;
          this.imageService.sortImages(this.product);
          this.commentService.sortComments(this.product);
          this.setProductDetails();
          this.getCategories();
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
  private getCategories(): void {
    this.isLoading = true;
    this.productService
      .getAllCategories(this.API_KEY)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.categoryOptions = [];
          for (let category of data.count) {
            this.categoryOptions.push(category.category);
          }
          this.categoryOptions.sort();
          this.setCategoryFilteredOptions();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categoryOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private setCategoryFilteredOptions(): void {
    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  private setProductDetails(): void {
    this.title = this.product.title;
    this.categoryControl = new FormControl(`${this.product.category}`);
    this.publicSelectValue = this.product.isPublished;
    this.productDescription = this.product.description;
  }
}
