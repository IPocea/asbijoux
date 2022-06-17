import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IComment, IProductComplete } from '../interfaces';

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
  addComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(
      'http://localhost:8080/api/comments/',
      comment
    );
  }
}
