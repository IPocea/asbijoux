import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IProduct } from '@interfaces';
import {
  CommentService,
  ImageService,
  ProductService,
  UserService,
} from '@services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: IProduct;
  isLoading: boolean = false;
  API_KEY_COMMENTS: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService,
    private commentService: CommentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService
      .getAdminComments()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.API_KEY_COMMENTS = data;
          this.getParams();
        },
        error: (err) => {
          this.API_KEY_COMMENTS = '';
          this.getParams();
        },
      });
  }
  private getParams(): void {
    this.route.params.subscribe((params) => {
      this.getData(+params['id']);
    });
  }
  private getData(id: number): void {
    this.isLoading = true;
    this.productService
      .getProductActiveComments(id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.product = data;
          if (!this.product.isPublished && !this.API_KEY_COMMENTS) {
            this.router.navigate(['/pagina-principala']);
          }
          this.imageService.sortImages(this.product);
          this.commentService.sortComments(this.product);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.router.navigate(['/pagina-principala']);
        },
      });
  }
}
