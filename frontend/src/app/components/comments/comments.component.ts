import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import {
  IComment,
  ICommentPreview,
  IProductComplete,
  IReplyComment,
} from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { ReplyService } from 'src/app/services/reply.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() product: IProductComplete;
  API_KEY: string = '';
  isCommentLoading: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  editActive: string = 'edit-comment-active';
  editInactive: string = 'edit-comment-inactive';
  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.email]);
  commentFormControl = new FormControl('', [Validators.required]);
  textBtn: string = 'Adaugati comentariul';
  commentPreview: ICommentPreview = null;
  replyCommentText: string = '';
  replyEditText: string = '';
  administratorName: string = 'Administrator';
  replyCommentId: number = 0;
  replyEditCommentId: number = 0;

  constructor(
    private commentService: CommentService,
    private replyService: ReplyService,
    private scroll: ScrollService,
    private userService: UserService,
    private productService: ProductService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.commentPreview = null;
    this.userService
      .getAdminComments()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.API_KEY = data;
        },
        (err) => {
          this.API_KEY = '';
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
  openReplyContainer(comment: IComment) {
    this.replyCommentId = comment.id;
    this.replyEditCommentId = 0;
  }
  cancelAddReply(): void {
    this.replyCommentId = 0;
    this.replyCommentText = '';
  }
  addReplyComment(comment: IComment, index: number): void {
    if (!this.replyCommentText.trim()) {
      this.errorMessage = 'Comentariul nu poate fi un text gol.';
      this.hideError();
      return;
    }
    const replyComment: IReplyComment = {
      name: this.administratorName,
      text: this.replyCommentText,
      isActivated: true,
      commentId: comment.id,
    };
    this.isLoading = true;
    this.replyService
      .addReplyComment(this.API_KEY, replyComment)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.product.comments[index].reply_comments.push(data);
          this.replyCommentId = 0;
          this.isLoading = false;
        },
        (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideError();
        }
      );
  }
  openEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = reply.id;
    this.replyCommentId = 0;
    this.replyEditText = reply.text;
  }
  cancelEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = 0;
    this.replyEditText = reply.text;
  }
  modifyAdminComment(reply: IReplyComment): void {
    if (!this.replyEditText.trim()) {
      this.errorMessage = 'Comentariul nu poate fi un text gol.';
      this.hideError();
      return;
    }
    const replyComment: IReplyComment = {
      name: this.administratorName,
      text: this.replyEditText,
      isActivated: true,
      commentId: reply.commentId,
    };
    this.replyEditCommentId = 0;
    this.isLoading = true;
    this.replyService
      .modifyReplyComment(this.API_KEY, reply.id, replyComment)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.productService
            .getProductActiveComments(this.product.id)
            .pipe(take(1))
            .subscribe(
              (data) => {
                this.product = data;
                this.imageService.sortImages(this.product);
                this.product.comments = data.comments.filter(
                  (ele) => ele.isActivated
                );
                this.isLoading = false;
                this.commentService.sortComments(this.product);
              },
              (err) => {
                this.isLoading = false;
              }
            );
        },
        (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideError();
        }
      );
  }
  deleteAdminComment(reply: IReplyComment, replyIndex: number) {
    const result = confirm(
      `Esti singur ca doresti sa stergi acest comentariu?`
    );
    if (result) {
      this.isLoading = true;
      this.replyService
        .deleteReplyComment(this.API_KEY, reply.id)
        .pipe(take(1))
        .subscribe(
          (data) => {
            let commentIndex = 0;
            for (let i = 0; i < this.product.comments.length; i++) {
              if (this.product.comments[i].id === reply.commentId) {
                commentIndex = i;
                break;
              }
            }
            this.product.comments[commentIndex].reply_comments.splice(
              replyIndex,
              1
            );
            this.isLoading = false;
          },
          (err) => {
            this.errorMessage = err.message.message;
            this.isLoading = false;
            this.hideError();
          }
        );
    }
  }
  clearForm(): void {
    this.nameFormControl = new FormControl('', [Validators.required]);
    this.emailFormControl = new FormControl('', [Validators.email]);
    this.commentFormControl = new FormControl('', [Validators.required]);
  }
  hideError(): void {
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000);
  }
}
