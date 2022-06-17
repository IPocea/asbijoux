import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import {
  IComment,
  ICommentPreview,
  IProductComplete,
} from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { FormControl, Validators } from '@angular/forms';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product: IProductComplete;
  isLoading: boolean = false;
  selectedImageClass: string = 'img-slide';
  isCommentLoading: boolean = false;
  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.email]);
  commentFormControl = new FormControl('', [Validators.required]);
  textBtn: string = 'Adaugati comentariul';
  commentPreview: ICommentPreview = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService,
    private commentService: CommentService,
    private scroll: ScrollService
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.commentPreview = null;
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
          this.product = data;
          this.imageService.sortImages(this.product);
          this.product.comments = data.comments.filter(
            (ele) => ele.isActivated
          );
          this.commentService.sortComments(this.product);
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.router.navigate(['/pagina-principala']);
        }
      );
  }
  addComment(ev: Event) {
    ev.preventDefault();
    if (
      !this.nameFormControl.value.trim() ||
      !this.commentFormControl.value.trim()
    ) {
      this.nameFormControl.markAsTouched();
      this.commentFormControl.markAsTouched();
      return;
    } else {
      this.nameFormControl.markAsUntouched();
      this.commentFormControl.markAllAsTouched();
      const comment = {
        name: this.nameFormControl.value,
        email: this.emailFormControl.value
          ? this.emailFormControl.value
          : 'N/A',
        text: this.commentFormControl.value,
        productId: this.product.id,
      };
      this.isCommentLoading = true;
      this.textBtn = 'Se adauga comentariul...';
      this.commentService
        .addComment(comment)
        .pipe(take(1))
        .subscribe(
          (data) => {
            this.clearForm();
            this.commentPreview = {
              name: data.name,
              text: data.text,
            };
            this.textBtn = 'Adaugat cu succes';
            this.scroll.scrollTo('product-comment-preview');
            setTimeout(() => {
              this.isCommentLoading = false;
              this.textBtn = 'Adaugati comentariul';
            }, 1000);
          },
          (err) => {
            this.textBtn = err.message.message;

            setTimeout(() => {
              this.textBtn = 'Adaugati comentariul';
              this.isCommentLoading = false;
            }, 1000);
          }
        );
    }
  }
  clearForm(): void {
    this.nameFormControl = new FormControl('', [Validators.required]);
    this.emailFormControl = new FormControl('', [Validators.email]);
    this.commentFormControl = new FormControl('', [Validators.required]);
  }
}
