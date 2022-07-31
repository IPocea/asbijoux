import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IProduct } from 'src/app/interfaces';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  isLoading: boolean = false;
  isNotFound: boolean = false;
  products: IProduct[] = [];
  selectedProducts: IProduct[] = [];
  categories: string[] = [];
  title: string = '';
  length: number;
  pageSize: number;
  pageSizeOptions: number[] = [5, 9, 10, 25];
  pageIndex: number = 0;
  showFirstLastButtons: BooleanInput = true;
  private screenWidth: number = window.screen.availWidth;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private imageService: ImageService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    if (this.screenWidth >= 821 && this.screenWidth < 1227) {
      this.pageSize = 9;
    } else {
      this.pageSize = 10;
    }
    this.getParams();
  }
  goToCategory(page: string): void {
    this.router.navigate(['/categorii', page]);
  }
  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.selectPageAndFillWithData();
    this.scrollService.scrollTo('search-component-card-container');
  }
  private getParams(): void {
    this.route.params.subscribe((params) => {
      this.title = params['name'];
      this.getData(this.title);
    });
  }
  private getData(params: string): void {
    this.isLoading = true;
    this.products = [];
    this.selectedProducts = [];
    this.productService
      .getProductsByTitle(params)
      .pipe(take(1))
      .subscribe(
        (data) => {
          if (!data.length) {
            this.isNotFound = true;
            this.productService
              .getAlllPublishedCategories()
              .pipe(take(1))
              .subscribe(
                (data) => {
                  this.categories = [];
                  for (let category of data.count) {
                    this.categories.push(category.category);
                  }
                  this.categories.sort();
                  this.isLoading = false;
                },
                (err) => {
                  this.isLoading = false;
                }
              );
          } else {
            this.isNotFound = false;
            this.products = data.filter((ele) => ele.isPublished);
            this.length = this.products.length;
            for (let product of this.products) {
              this.imageService.sortImages(product);
              if (this.selectedProducts.length < this.pageSize) {
                this.selectedProducts.push(product);
              }
            }
          }
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  goToProduct(product: IProduct): void {
    this.router.navigate([
      '/produs',
      product.category,
      product.title,
      product.id,
    ]);
  }
  private selectPageAndFillWithData(): void {
    if (this.pageIndex === 0) {
      this.selectedProducts = [];
      if (this.length < this.pageSize) {
        for (let i = 0; i < this.length; i++) {
          this.selectedProducts.push(this.products[i]);
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedProducts.push(this.products[i]);
        }
      }
    } else {
      this.selectedProducts = [];
      if (this.length - this.pageIndex * this.pageSize < this.pageSize) {
        for (let i = 0; i < this.length - this.pageIndex * this.pageSize; i++) {
          this.selectedProducts.push(
            this.products[this.pageIndex * this.pageSize + i]
          );
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedProducts.push(
            this.products[this.pageIndex * this.pageSize + i]
          );
        }
      }
    }
  }
}
