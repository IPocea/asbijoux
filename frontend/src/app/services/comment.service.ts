import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IComment, IObjCommentsForDelete, IProduct } from '../interfaces';
import { IEditDeleteResponse } from '../interfaces/edit-delete.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  sortComments(product: IProduct): void {
    product.comments.sort((a, b) =>
      a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0
    );
  }
  sortCommentsByComments(comments: IComment[]): void {
    comments.sort((a, b) =>
      b.createdAt > a.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
    );
  }
  addComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(
      'https://asbijoux.herokuapp.com/api/comments/',
      comment
    );
  }
  activateComment(
    API_KEY: string,
    comment: IComment
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/comments/${API_KEY}/${comment.id}`,
      comment
    );
  }
  getComments(): Observable<IComment[]> {
    return this.http.get<IComment[]>(
      'https://asbijoux.herokuapp.com/api/comments/'
    );
  }
  deleteComment(API_KEY: string, id: number): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/comments/${API_KEY}/${id}`
    );
  }
  deleteAllComments(
    API_KEY: string,
    ids: IObjCommentsForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/comments/${API_KEY}/delete-all`,
      ids
    );
  }
}
