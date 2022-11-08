import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith, take } from 'rxjs/operators';
import {
  IDeleteAllComments,
  IDeleteAllImages,
  IDeleteAllReplyComments,
  IObjCommentsForDelete,
  IObjImagesForDelete,
  IObjReplyCommentsForDelete,
  ICheckbox,
  IProduct,
} from '@interfaces';
import {
  ProductService,
  ScrollService,
  ImageService,
  CommentService,
  ReplyService,
} from '@services';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss'],
})
export class ViewProductsComponent implements OnInit {
  @Input() API_KEY: string;
  @Input() API_KEY_COMMENTS: string;
  isLoading: boolean = false;
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedProductId: number;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  searchValue: string = '';
  categoryControl = new FormControl('');
  categoryOptions: string[] = [];
  categoryFilteredOptions: Observable<string[]>;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50];
  pageIndex: number = 0;
  showFirstLastButtons: BooleanInput = true;
  selectedProducts: IProduct[] = [];
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
    private imageService: ImageService,
    private commentService: CommentService,
    private replyService: ReplyService,
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
      this.pageIndex = 0;
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
  applyTitleByEnter(): void {
    if (!this.searchValue.trim()) {
      this.showMessage('Te rugam sa introduci cel putin o litera');
    } else {
      this.applyFilters();
    }
  }
  catchEditStatus(ev: any): void {
    this.isEditing = ev;
    this.pageIndex = 0;
    this.getData();
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
    this.pageIndex = 0;
    this.length = this.filteredProducts.length;
    this.selectPageAndFillWithData();
  }
  deleteFullProduct(product: IProduct): void {
    const result = confirm(
      `Esti singur ca doresti sa stergi produsul ${product.title}?`
    );
    if (result) {
      this.isLoading = true;
      let hasReplyComments: boolean = false;
      let hasImages: boolean = product.images.length ? true : false;
      let hasComments: boolean = product.comments.length ? true : false;
      if (hasComments) {
        for (let comment of product.comments) {
          if (comment.reply_comments.length) {
            hasReplyComments = true;
            break;
          }
        }
      }
      if (hasImages) {
        this.deleteImages(product, hasComments, hasReplyComments);
      } else if (hasComments && hasReplyComments) {
        this.deleteReplyComments(product);
      } else if (hasComments) {
        this.deleteComments(product);
      } else {
        this.deleteSingleProduct(product);
      }
    }
  }
  editProduct(product: IProduct): void {
    this.selectedProductId = product.id;
    this.isEditing = true;
  }
  goToProduct(product: IProduct): void {
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
  publishProduct(product: IProduct): void {
    this.toggleIsPublished(
      product,
      true,
      `Produsul ${product.title} a fost publicat cu succes`
    );
  }
  publishNotProduct(product: IProduct): void {
    this.toggleIsPublished(
      product,
      false,
      `Produsul ${product.title} a fost dezactivat cu succes`
    );
  }
  private applyCategoryFilter(): void {
    if (this.categoryOptions.indexOf(this.categoryControl.value) !== -1) {
      this.filteredProducts = this.filteredProducts.filter(
        (ele) => ele.category === this.categoryControl.value
      );
    }
  }
  private applyCheckboxFilter(): void {
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
  private applyTitleFilter(): void {
    this.filteredProducts = this.filteredProducts.filter(
      (ele) => ele.title.toLocaleLowerCase().indexOf(this.searchValue) !== -1
    );
  }
  private deleteImages(
    product: IProduct,
    hasComments: boolean,
    hasReplyComments: boolean
  ) {
    const imagesArray: IDeleteAllImages[] = [];
    for (let image of product.images) {
      imagesArray.push({ id: image.id, name: image.name });
    }
    const images: IObjImagesForDelete = { images: imagesArray };
    this.imageService
      .deleteAllImages(this.API_KEY, images)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (hasComments && hasReplyComments) {
            this.deleteReplyComments(product);
          } else if (hasComments) {
            this.deleteComments(product);
          } else {
            this.deleteSingleProduct(product);
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.isLoading = false;
          this.hideMessage();
        },
      });
  }
  private deleteReplyComments(product: IProduct): void {
    const replyCommentsArray: IDeleteAllReplyComments[] = [];
    for (let comment of product.comments) {
      for (let reply of comment.reply_comments) {
        replyCommentsArray.push({ id: reply.id });
      }
    }
    const ids: IObjReplyCommentsForDelete = { ids: replyCommentsArray };
    this.replyService
      .deleteAllReplyComments(this.API_KEY_COMMENTS, ids)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.deleteComments(product);
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa faceti refresh la pagina'
          );
        },
      });
  }
  private deleteComments(product: IProduct): void {
    const commentsArray: IDeleteAllComments[] = [];
    for (let comment of product.comments) {
      commentsArray.push({ id: comment.id });
    }
    const ids: IObjCommentsForDelete = { ids: commentsArray };
    this.commentService
      .deleteAllComments(this.API_KEY, ids)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.deleteSingleProduct(product);
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa faceti refresh la pagina'
          );
        },
      });
  }
  private deleteSingleProduct(product: IProduct): void {
    this.productServices
      .deleteProduct(this.API_KEY, product.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (
            this.pageIndex > 0 &&
            this.pageIndex * this.pageSize >= this.length - 1
          ) {
            this.pageIndex -= 1;
          }
          this.getData();
          this.displayMessage(true, 'Produsul a fost sters cu succes');
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa faceti refresh si sa incercati din nou'
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
  private getCategories(): void {
    this.productServices
      .getAllCategories(this.API_KEY)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.categoryOptions = [];
          for (let category of res.count) {
            this.categoryOptions.push(category.category);
          }
          this.categoryOptions.sort();
          this.resetCategories();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
  private getData(): void {
    this.isLoading = true;
    this.productServices
      .getAllProducts(this.API_KEY)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.deleteAllFilters();
          this.products = data;
          this.filteredProducts = data;
          this.length = this.filteredProducts.length;
          this.selectPageAndFillWithData();
          this.getCategories();
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }
  private hideMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 2000);
  }
  private resetCategories(): void {
    this.categoryControl = new FormControl('');
    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  private selectPageAndFillWithData(): void {
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
  private showMessage(message: string): void {
    this.snackBar.open(message, '', {
      duration: 1500,
    });
  }
  private toggleIsPublished(
    product: IProduct,
    status: boolean,
    message: string
  ): void {
    this.isLoading = true;
    const modifiedProduct: IProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      isPublished: status,
    };
    this.productServices
      .editProduct(this.API_KEY, modifiedProduct)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.getData();
          this.successMessage = message;
          this.hideMessage();
        },
        error: (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideMessage();
        },
      });
  }
}
