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
      `http://localhost:8080/api/reply-comments?commentId=${id}`
    );
  }
  addReplyComment(
    API_KEY: string,
    replyComment: IReplyComment
  ): Observable<IReplyComment> {
    return this.http.post<IReplyComment>(
      `http://localhost:8080/api/reply-comments/${API_KEY}/`,
      replyComment
    );
  }
  modifyReplyComment(
    API_KEY: string,
    id: number,
    reply: IReplyComment
  ): Observable<IReplyComment> {
    return this.http.put<IReplyComment>(
      `http://localhost:8080/api/reply-comments/${API_KEY}/${id}`,
      reply
    );
  }
  deleteReplyComment(API_KEY: string, id: number): Observable<IReplyComment> {
    return this.http.delete<IReplyComment>(
      `http://localhost:8080/api/reply-comments/${API_KEY}/${id}`
    );
  }
}
