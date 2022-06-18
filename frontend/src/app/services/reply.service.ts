import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReplyComment } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(private http: HttpClient) {}
  getReplyCommentByCommentId(id: number): Observable<IReplyComment[]> {
    return this.http.get<IReplyComment[]>(
      `http://localhost:8080/api/reply-comment?commentId=${id}`
    );
  }
}
