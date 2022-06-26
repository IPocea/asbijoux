import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IComment,
  IObjCommentsForDelete,
  IProductComplete,
} from '../interfaces';
import { IEditDeleteResponse } from '../interfaces/edit-delete.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}
  sortComments(product: IProductComplete): void {
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
      'http://localhost:8080/api/comments/',
      comment
    );
  }
  activateComment(
    API_KEY: string,
    comment: IComment
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      `http://localhost:8080/api/comments/${API_KEY}/${comment.id}`,
      comment
    );
  }
  getComments(): Observable<IComment[]> {
    return this.http.get<IComment[]>('http://localhost:8080/api/comments/');
  }
  deleteComment(API_KEY: string, id: number): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      `http://localhost:8080/api/comments/${API_KEY}/${id}`
    );
  }
  deleteAllComments(
    API_KEY: string,
    ids: IObjCommentsForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      `http://localhost:8080/api/comments/${API_KEY}/delete-all`,
      ids
    );
  }
}
