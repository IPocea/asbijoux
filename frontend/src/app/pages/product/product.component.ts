import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IProductComplete } from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: IProductComplete;
  isLoading: boolean = false;
  selectedImageClass: string = 'img-slide';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.getParams();
  }
  getParams(): void {
    this.route.params.subscribe((params) => {
      this.getData(+params['id']);
    });
  }
  getData(id: number): void {
    this.isLoading = true;
    this.productService
      .getProductActiveComments(id)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.product = data;
          this.imageService.sortImages(this.product);
          this.commentService.sortComments(this.product);
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.router.navigate(['/pagina-principala']);
        }
      );
  }
}
