import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import {
  ICheckboxComments,
  IComment,
  IProduct,
  IReplyComment,
} from '@interfaces';
import { CommentService, ReplyService } from '@services';

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
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50];
  pageIndex: number = 0;
  showFirstLastButtons: BooleanInput = true;
  selectedComments: IComment[] = [];
  filteredComments: IComment[] = [];
  searchValue: string = '';
  filterCheckbox: ICheckboxComments = {
    activated: false,
    inactivated: false,
  };
  private administratorName: string = 'Administrator';
  constructor(
    private commentService: CommentService,
    private replyService: ReplyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  applyNameByEnter(): void {
    if (!this.searchValue.trim()) {
      this.showMessage('Te rugam sa introduci cel putin o litera');
    } else {
      this.applyFilters();
    }
  }
  applyFilters(): void {
    this.applyCheckboxFilter();
    this.applyNameFilter();
    if (this.filteredComments.length) {
      this.pageIndex = 0;
      this.length = this.filteredComments.length;
      this.selectPageAndFillWithData();
    }
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
      .subscribe({
        next: (data) => {
          this.replyCommentText = '';
          this.replyCommentId = 0;
          this.isReplyActive = false;
          let commentIndex = this.findCommentIndexForReply(data);
          let filteredCommentIndex =
            this.findFilteredCommentIndexForReply(data);
          let selectedCommentIndex =
            this.findSelectedCommentsIndexForReply(data);
          if (!this.comments[commentIndex].reply_comments.length) {
            this.comments[commentIndex].reply_comments.push(data);
          }
          if (
            !this.filteredComments[filteredCommentIndex].reply_comments.length
          ) {
            this.filteredComments[filteredCommentIndex].reply_comments.push(
              data
            );
          }
          if (
            !this.selectedComments[selectedCommentIndex].reply_comments.length
          ) {
            this.selectedComments[selectedCommentIndex].reply_comments.push(
              data
            );
          }
          this.displayMessage(true, 'Comentariul a fost adaugat cu succes.');
          this.isDisabled = false;
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa incercati din nou.'
          );
          this.isDisabled = false;
        },
      });
  }
  cancelEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = 0;
    this.replyEditText = reply.text;
  }
  cancelAddReply(): void {
    this.replyCommentId = 0;
    this.replyCommentText = '';
    this.isReplyActive = false;
  }
  changeActivated(ev: Event): void {
    this.filterCheckbox.activated = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.activated) {
      this.filterCheckbox.inactivated = false;
    }
    this.applyFilters();
  }
  changeInactivated(ev: Event): void {
    this.filterCheckbox.inactivated = (ev.target as HTMLInputElement).checked;
    if (this.filterCheckbox.inactivated) {
      this.filterCheckbox.activated = false;
    }
    this.applyFilters();
  }
  clearSearchValueAndFilters(): void {
    this.searchValue = '';
    this.deleteAllFilters();
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
        .subscribe({
          next: (data) => {
            let commentIndex = this.findCommentIndexForReply(reply);
            let filteredCommentIndex =
              this.findFilteredCommentIndexForReply(reply);
            let selectedCommentIndex =
              this.findSelectedCommentsIndexForReply(reply);
            this.comments[commentIndex].reply_comments.splice(replyIndex, 1);
            this.filteredComments[filteredCommentIndex].reply_comments.splice(
              replyIndex,
              1
            );
            this.selectedComments[selectedCommentIndex].reply_comments.splice(
              replyIndex,
              1
            );
            this.displayMessage(true, 'Comentariul a fost sters cu succes.');
            this.isDisabled = false;
          },
          error: (err) => {
            this.displayMessage(
              false,
              'A intervenit o eroare. Va rugam sa incercati din nou.'
            );
            this.isDisabled = false;
          },
        });
    }
  }
  deleteFullComment(comment: IComment): void {
    const result = confirm(
      `Esti singur ca doresti sa stergi acest comentariu?`
    );
    if (result) {
      if (comment.reply_comments.length) {
        this.isDisabled = true;
        this.replyService
          .deleteReplyComment(
            this.API_KEY_COMMENTS,
            comment.reply_comments[0].id
          )
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.deleteComment(comment);
            },
            error: (err) => {
              this.displayMessage(
                false,
                'A intervenit o eroare. Va rugam sa incercati din nou.'
              );
              this.isDisabled = false;
            },
          });
      } else {
        this.deleteComment(comment);
      }
    }
  }
  deleteAllFilters(): void {
    for (let key in this.filterCheckbox) {
      this.filterCheckbox[key] = false;
    }
    this.searchValue = '';
    this.filteredComments = [...this.comments];
    this.pageIndex = 0;
    this.length = this.filteredComments.length;
    this.selectPageAndFillWithData();
  }
  goToProduct(product: IProduct) {
    this.router.navigate([
      '/produs',
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
  }
  modifyAdminComment(reply: IReplyComment): void {
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
      .subscribe({
        next: (res) => {
          this.getData();
          this.displayMessage(true, 'Comentariul a fost modificat cu succes.');
          this.isDisabled = false;
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa incercati din nou.'
          );
          this.isDisabled = false;
        },
      });
  }
  openEditAdminComment(reply: IReplyComment): void {
    this.replyEditCommentId = reply.id;
    this.replyCommentId = 0;
    this.isReplyActive = false;
    this.replyEditText = reply.text;
  }
  openReplyContainer(comment: IComment) {
    this.replyCommentId = comment.id;
    this.isReplyActive = true;
    this.replyEditCommentId = 0;
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
          let commentIndex = 0;
          let filteredCommentIndex = 0;
          for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id === comment.id) {
              commentIndex = i;
              break;
            }
          }
          for (let i = 0; i < this.filteredComments.length; i++) {
            if (this.filteredComments[i].id === comment.id) {
              filteredCommentIndex = i;
              break;
            }
          }
          this.comments[commentIndex].isActivated = commentToToggle.isActivated;
          this.filteredComments[filteredCommentIndex].isActivated =
            commentToToggle.isActivated;
          this.selectedComments[index].isActivated =
            commentToToggle.isActivated;
          this.selectPageAndFillWithData();
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
  private applyCheckboxFilter(): void {
    this.filteredComments = this.comments.filter((ele) => {
      if (this.filterCheckbox.activated && !ele.isActivated) {
        return false;
      }
      if (this.filterCheckbox.inactivated && ele.isActivated) {
        return false;
      }
      return true;
    });
  }
  private applyNameFilter(): void {
    this.filteredComments = this.filteredComments.filter(
      (ele) => ele.name.toLocaleLowerCase().indexOf(this.searchValue) !== -1
    );
  }
  private deleteComment(comment: IComment): void {
    this.isDisabled = true;
    this.commentService
      .deleteComment(this.API_KEY, comment.id)
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
          this.displayMessage(true, 'Comentariul a fost sters cu succes.');
          this.isDisabled = false;
        },
        error: (err) => {
          this.displayMessage(
            false,
            'A intervenit o eroare. Va rugam sa incercati din nou.'
          );
          this.isDisabled = false;
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
  private findCommentIndexForReply(reply: IReplyComment): number {
    let commentIndex = 0;
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].id === reply.commentId) {
        commentIndex = i;
        break;
      }
    }
    return commentIndex;
  }
  private findFilteredCommentIndexForReply(reply: IReplyComment): number {
    let filteredCommentIndex = 0;
    for (let i = 0; i < this.filteredComments.length; i++) {
      if (this.filteredComments[i].id === reply.commentId) {
        filteredCommentIndex = i;
        break;
      }
    }
    return filteredCommentIndex;
  }
  private findSelectedCommentsIndexForReply(reply: IReplyComment): number {
    let selectedCommentIndex = 0;
    for (let i = 0; i < this.selectedComments.length; i++) {
      if (this.selectedComments[i].id === reply.commentId) {
        selectedCommentIndex = i;
        break;
      }
    }
    return selectedCommentIndex;
  }
  private getData(): void {
    this.isLoading = true;
    this.commentService
      .getComments(this.API_KEY)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.deleteAllFilters();
          this.comments = data;
          this.commentService.sortCommentsByComments(data);
          this.filteredComments = [...this.comments];
          this.length = this.filteredComments.length;
          this.selectPageAndFillWithData();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message.message;
          this.isLoading = false;
          this.hideMessage();
        },
      });
  }
  private hideMessage(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 2000);
  }
  private selectPageAndFillWithData(): void {
    if (this.pageIndex === 0) {
      this.selectedComments = [];
      if (this.length < this.pageSize) {
        for (let i = 0; i < this.length; i++) {
          this.selectedComments.push(this.filteredComments[i]);
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedComments.push(this.filteredComments[i]);
        }
      }
    } else {
      this.selectedComments = [];
      if (this.length - this.pageIndex * this.pageSize < this.pageSize) {
        for (let i = 0; i < this.length - this.pageIndex * this.pageSize; i++) {
          this.selectedComments.push(
            this.filteredComments[this.pageIndex * this.pageSize + i]
          );
        }
      } else {
        for (let i = 0; i < this.pageSize; i++) {
          this.selectedComments.push(
            this.filteredComments[this.pageIndex * this.pageSize + i]
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
}
