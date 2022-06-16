import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IProductComplete } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  products: IProductComplete[];
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getParams();
  }
  getParams(): void {
    this.route.params.subscribe((params) => {
      this.getData(params['name']);
    });
  }
  getData(params: string): void {
    this.isLoading = true;
    this.productService
      .getAllBySelectedCategory(params)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isLoading = false;
          if (!data.length) {
            this.router.navigate(['/pagina-principala']);
          } else {
            this.products = data.filter((ele) => ele.isPublished);
            for (let product of this.products) {
              product.images.sort((a, b) =>
                a.isMainImage > b.isMainImage
                  ? -1
                  : b.isMainImage > a.isMainImage
                  ? 1
                  : 0
              );
            }
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  goToProduct(product: IProductComplete): void {
    this.router.navigate([
      '/produs',
      product.category,
      product.title,
      product.id,
    ]);
  }
}
