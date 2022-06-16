import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { IProductComplete } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: IProductComplete;
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getParams();
  }
  getParams(): void {
    this.route.params.subscribe((params) => {
      this.getData(params['id']);
    });
  }
  getData(id: string): void {
    this.isLoading = true;
    this.productService
      .getProduct(id)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.product = data;
        },
        (err) => {
          this.isLoading = false;
          this.router.navigate(['/pagina-principala']);
        }
      );
  }
}
