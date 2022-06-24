import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IComment, IProductComplete, IReplyComment } from 'src/app/interfaces';
import { CommentService } from 'src/app/services/comment.service';
import { ReplyService } from 'src/app/services/reply.service';

@Component({
  selector: 'app-comments-admin',
  templateUrl: './comments-admin.component.html',
  styleUrls: ['./comments-admin.component.scss'],
})
export class CommentsAdminComponent implements OnInit {
  @Input() API_KEY: string;
  @Input() API_KEY_COMMENTS: string;
  comments: IComment[] = [];
  isLoading: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  replyEditCommentId: number = 0;
  replyCommentId: number = 0;
  isReplyActive: boolean = false;
  replyCommentText: string = '';
  replyEditText: string = '';
  administratorName: string = 'Administrator';
  constructor(
    private commentService: CommentService,
    private replyService: ReplyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  openReplyContainer(comment: IComment) {
    this.replyCommentId = comment.id;
    this.isReplyActive = true;
    this.replyEditCommentId = 0;
  }
  cancelAddReply(): void {
    this.replyCommentId = 0;
    this.replyCommentText = '';
    this.isReplyActive = false;
  }
  addReplyComment(comment: IComment, index: number): void {
    this.isDisabled = true;
    if (!this.replyCommentText.trim()) {
      this.displayMessage(false, 'Comentariul nu poate fi un text gol.');
      this.isDisabled = false;
      return;
    }
    const replyComment: IReplyComment = {
      name: this.administratorName,
      text: this.replyCommentText,
      isActivated: true,
      commentId: comment.id,
    };

    this.replyService
      .addReplyComment(this.API_KEY_COMMENTS, replyComment)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.replyCommentText = '';
          this.replyCommentId = 0;
          this.isReplyActive = false;
          replyComment.id = data.id;
          if (this.comments[index].reply_comments) {
            this.comments[index].reply_comments.push(replyComment);
          }
          this.displayMessage(true, 'Comentariul a fost adaugat cu succes.');
          this.isDisabled = false;
        },
        (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa incercati din nou.'
          );
          this.isDisabled = false;
        }
      );
  }
  openEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = reply.id;
    this.replyCommentId = 0;
    this.isReplyActive = false;
    this.replyEditText = reply.text;
  }
  cancelEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = 0;
    this.replyEditText = reply.text;
  }
  deleteAdminComment(reply: IReplyComment, replyIndex: number) {
    const result = confirm(
      `Esti singur ca doresti sa stergi acest comentariu?`
    );
    if (result) {
      this.isDisabled = true;
      this.replyService
        .deleteReplyComment(this.API_KEY_COMMENTS, reply.id)
        .pipe(take(1))
        .subscribe(
          (data) => {
            let commentIndex = 0;
            for (let i = 0; i < this.comments.length; i++) {
              if (this.comments[i].id === reply.commentId) {
                commentIndex = i;
                break;
              }
            }
            this.comments[commentIndex].reply_comments.splice(replyIndex, 1);
            this.displayMessage(true, 'Comentariul a fost sters cu succes.');
            this.isDisabled = false;
          },
          (err) => {
            this.displayMessage(
              false,
              'A intervenit o eroare. Va rugam sa incercati din nou.'
            );
            this.isDisabled = false;
          }
        );
    }
  }
  deleteComment(comment: IComment, index: number): void {
    const result = confirm(
      `Esti singur ca doresti sa stergi acest comentariu?`
    );
    if (result) {
      this.isDisabled = true;
      this.commentService
        .deleteComment(this.API_KEY, comment.id)
        .pipe(take(1))
        .subscribe(
          (res) => {
            this.comments.splice(index, 1);
            this.displayMessage(true, 'Comentariul a fost sters cu succes.');
            this.isDisabled = false;
          },
          (err) => {
            this.displayMessage(
              false,
              'A intervenit o eroare. Va rugam sa incercati din nou.'
            );
            this.isDisabled = false;
          }
        );
    }
  }
  private getData(): void {
    this.isLoading = true;
    this.commentService
      .getComments()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.comments = data;
          this.isLoading = false;
        },
        (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideMessage();
        }
      );
  }
  goToProduct(product: IProductComplete) {
    this.router.navigate([
      '/produs',
      product.category,
      product.title,
      product.id,
    ]);
  }
  private displayMessage(type: boolean, message: string): void {
    if (type) {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    this.hideMessage();
  }
  hideMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 2000);
  }
  modifyAdminComment(reply: IReplyComment, replyIndex: number): void {
    this.isDisabled = true;
    if (!this.replyEditText.trim()) {
      this.displayMessage(false, 'Comentariul nu poate fi un text gol.');
      this.isDisabled = false;
      return;
    }
    const replyComment: IReplyComment = {
      name: this.administratorName,
      text: this.replyEditText,
      isActivated: true,
      commentId: reply.commentId,
    };
    this.replyEditCommentId = 0;
    this.replyService
      .modifyReplyComment(this.API_KEY_COMMENTS, reply.id, replyComment)
      .pipe(take(1))
      .subscribe(
        (res) => {
          let commentIndex = 0;
          replyComment.id = reply.id;
          for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id === reply.commentId) {
              commentIndex = i;
              break;
            }
          }
          this.comments[commentIndex].reply_comments.splice(
            replyIndex,
            1,
            replyComment
          );
          this.displayMessage(true, 'Comentariul a fost sters cu succes.');
          this.isDisabled = false;
        },
        (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa incercati din nou.'
          );
          this.isDisabled = false;
        }
      );
  }
  toggleComment(comment: IComment, status: boolean, index: number): void {
    this.isDisabled = true;
    const commentToToggle: IComment = { ...comment, isActivated: status };
    this.commentService
      .activateComment(this.API_KEY, commentToToggle)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (status) {
            this.successMessage = 'Comentariul a fost activat cu succes.';
          } else {
            this.successMessage = 'Comentariul a fost dezactivat cu succes.';
          }
          this.comments.splice(index, 1, commentToToggle);
          this.isDisabled = false;
          this.hideMessage();
        },
        (err) => {
          this.errorMessage = err.message;
          this.isDisabled = false;
          this.hideMessage();
        }
      );
  }
}
