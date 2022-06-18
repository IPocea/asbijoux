import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import {
  ICommentPreview,
  IProductComplete,
  IReplyComment,
} from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';
import { ReplyService } from 'src/app/services/reply.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() product: IProductComplete;
  isCommentLoading: boolean = false;
  nameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.email]);
  commentFormControl = new FormControl('', [Validators.required]);
  textBtn: string = 'Adaugati comentariul';
  commentPreview: ICommentPreview = null;
  replyComment: IReplyComment = null;
  replyComments: IReplyComment[] = [];
  constructor(
    private commentService: CommentService,
    private scroll: ScrollService,
    private reply: ReplyService
  ) {}

  ngOnInit(): void {
    this.commentPreview = null;
    this.replyComments = [];
    for (let comment of this.product.comments) {
      this.reply
        .getReplyCommentByCommentId(comment.id)
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data.length) {
              this.replyComments.push(data[0]);
            }
          },
          (err) => {}
        );
    }
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
