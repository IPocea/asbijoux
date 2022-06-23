import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith, take } from 'rxjs/operators';
import { IProductComplete } from 'src/app/interfaces';
import { ICheckbox } from 'src/app/interfaces/checkbox.interface';
import { ProductService } from 'src/app/services/product.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss'],
})
export class ViewProductsComponent implements OnInit {
  @Input() API_KEY: string;
  isLoading: boolean = false;
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedForEditProduct: IProductComplete = null;
  products: IProductComplete[] = [];
  filteredProducts: IProductComplete[] = [];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  searchValue: string = '';
  categoryControl = new FormControl('');
  categoryOptions: string[] = [];
  categoryFilteredOptions: Observable<string[]>;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50];
  pageIndex: number = 0;
  showFirstLastButtons: BooleanInput = true;
  selectedProducts: IProductComplete[] = [];
  filterCheckbox: ICheckbox = {
    published: false,
    unpublished: false,
    withImages: false,
    withoutImages: false,
    withComments: false,
    withoutComments: false,
  };
  constructor(
    private productServices: ProductService,
    private scrollService: ScrollService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  applyFilters(): void {
    this.applyCheckboxFilter();
    this.applyCategoryFilter();
    this.applyTitleFilter();
    if (this.filteredProducts.length) {
      this.length = this.filteredProducts.length;
      this.selectPageAndFillWithData();
    }
  }
  applyCategoryByEnter(): void {
    if (
      this.categoryControl.value &&
      this.categoryOptions.indexOf(this.categoryControl.value) !== -1
    ) {
      this.applyFilters();
    } else {
      this.showMessage('Categoria introdusa nu exista');
    }
  }
  applyCategoryFilter(): void {
    if (this.categoryOptions.indexOf(this.categoryControl.value) !== -1) {
      this.filteredProducts = this.filteredProducts.filter(
        (ele) => ele.category === this.categoryControl.value
      );
    }
  }
  applyCheckboxFilter(): void {
    this.filteredProducts = this.products.filter((ele) => {
      if (this.filterCheckbox.published && !ele.isPublished) {
        return false;
      }
      if (this.filterCheckbox.unpublished && ele.isPublished) {
        return false;
      }
      if (this.filterCheckbox.withComments && !ele.comments.length) {
        return false;
      }
      if (this.filterCheckbox.withoutComments && ele.comments.length) {
        return false;
      }
      if (this.filterCheckbox.withImages && !ele.images.length) {
        return false;
      }
      if (this.filterCheckbox.withoutImages && ele.images.length) {
        return false;
      }
      return true;
    });
  }
  applyTitleFilter(): void {
    this.filteredProducts = this.filteredProducts.filter(
      (ele) => ele.title.toLocaleLowerCase().indexOf(this.searchValue) !== -1
    );
  }
  applyTitleByEnter(): void {
    if (!this.searchValue.trim()) {
      this.showMessage('Te rugam sa introduci cel putin o litera');
    } else {
      this.applyFilters();
    }
  }
  catchEditStatus(ev: any): void {
    this.isEditing = ev;
  }
  clearSearchValueAndFilters(): void {
    this.searchValue = '';
    this.deleteAllFilters();
  }
  changePublish(ev: Event): void {
    this.filterCheckbox.published = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.published) {
      this.filterCheckbox.unpublished = false;
    }
    this.applyFilters();
  }
  changeUnPublish(ev: Event): void {
    this.filterCheckbox.unpublished = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.unpublished) {
      this.filterCheckbox.published = false;
    }
    this.applyFilters();
  }
  changeWithImages(ev: Event): void {
    this.filterCheckbox.withImages = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.withImages) {
      this.filterCheckbox.withoutImages = false;
    }
    this.applyFilters();
  }
  changeWithoutImages(ev: Event): void {
    this.filterCheckbox.withoutImages = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.withoutImages) {
      this.filterCheckbox.withImages = false;
    }
    this.applyFilters();
  }
  changeWithComments(ev: Event): void {
    this.filterCheckbox.withComments = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.withComments) {
      this.filterCheckbox.withoutComments = false;
    }
    this.applyFilters();
  }
  changeWithoutComments(ev: Event): void {
    this.filterCheckbox.withoutComments = (
      ev.target as HTMLInputElement
    ).checked;
    if (this.filterCheckbox.withoutComments) {
      this.filterCheckbox.withComments = false;
    }
    this.applyFilters();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categoryOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  deleteAllFilters(): void {
    for (let key in this.filterCheckbox) {
      this.filterCheckbox[key] = false;
    }
    this.searchValue = '';
    this.resetCategories();
    this.filteredProducts = [...this.products];
    this.length = this.filteredProducts.length;
    this.selectPageAndFillWithData();
  }
  deleteProduct(product: IProductComplete): void {
    this.isLoading = true;
    this.productServices
      .deleteProduct(this.API_KEY, product.id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.getData();
          this.successMessage = `Produsul ${product.title} a fost sters cu succes.`;
          this.hideMessage();
        },
        (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideMessage();
        }
      );
  }
  editProduct(product: IProductComplete): void {
    this.selectedForEditProduct = product;
    this.isEditing = true;
  }
  getData(): void {
    this.isLoading = true;
    this.productServices
      .getAllProducts()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.deleteAllFilters();
          this.products = data;
          this.filteredProducts = data;
          this.length = this.filteredProducts.length;
          this.selectPageAndFillWithData();
          this.getCategories();
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  getCategories(): void {
    this.productServices
      .getAllCategories()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.categoryOptions = [];
          for (let category of res.count) {
            this.categoryOptions.push(category.category);
          }
          this.categoryOptions.sort();
          this.resetCategories();
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    // this.isLoading = false;
  }
  goToProduct(product: IProductComplete): void {
    this.router.navigate([
      'produs',
      product.category,
      product.title,
      product.id,
    ]);
  }
  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.selectPageAndFillWithData();
    this.scrollService.scrollTo('view-products-table');
  }
  hideMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 2000);
  }
  resetCategories(): void {
    this.categoryControl = new FormControl('');
    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  selectPageAndFillWithData(): void {
    if (this.pageIndex === 0) {
      this.selectedProducts = [];
      if (this.length < this.pageSize) {
        for (let i = 0; i < this.length; i++) {
          this.selectedProducts.push(this.filteredProducts[i]);
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedProducts.push(this.filteredProducts[i]);
        }
      }
    } else {
      this.selectedProducts = [];
      if (this.length - this.pageIndex * this.pageSize < this.pageSize) {
        for (let i = 0; i < this.length - this.pageIndex * this.pageSize; i++) {
          this.selectedProducts.push(
            this.filteredProducts[this.pageIndex * this.pageSize + i]
          );
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedProducts.push(
            this.filteredProducts[this.pageIndex * this.pageSize + i]
          );
        }
      }
    }
  }
  showMessage(message: string): void {
    this.snackBar.open(message, '', {
      duration: 1500,
    });
  }
  publishProduct(product: IProductComplete): void {
    this.toggleIsPublished(
      product,
      true,
      `Produsul ${product.title} a fost publicat cu succes`
    );
  }
  publishNotProduct(product: IProductComplete): void {
    this.toggleIsPublished(
      product,
      false,
      `Produsul ${product.title} a fost dezactivat cu succes`
    );
  }
  toggleIsPublished(
    product: IProductComplete,
    status: boolean,
    message: string
  ): void {
    this.isLoading = true;
    const modifiedProduct: IProductComplete = {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      isPublished: status,
    };
    this.productServices
      .editProduct(this.API_KEY, modifiedProduct)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.getData();
          this.successMessage = message;
          this.hideMessage();
        },
        (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideMessage();
        }
      );
  }
}
