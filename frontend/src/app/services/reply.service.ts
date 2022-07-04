import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IReplyComment,
  IEditDeleteResponse,
  IObjReplyCommentsForDelete,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(private http: HttpClient) {}
  getReplyCommentByCommentId(id: number): Observable<IReplyComment[]> {
    return this.http.get<IReplyComment[]>(
      `https://asbijoux.herokuapp.com/api/reply-comments?commentId=${id}`
    );
  }
  addReplyComment(
    API_KEY_COMMENTS: string,
    replyComment: IReplyComment
  ): Observable<IReplyComment> {
    return this.http.post<IReplyComment>(
      `https://asbijoux.herokuapp.com/api/reply-comments/${API_KEY_COMMENTS}/`,
      replyComment
    );
  }
  modifyReplyComment(
    API_KEY_COMMENTS: string,
    id: number,
    reply: IReplyComment
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/reply-comments/${API_KEY_COMMENTS}/${id}`,
      reply
    );
  }
  deleteReplyComment(
    API_KEY_COMMENTS: string,
    id: number
  ): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/reply-comments/${API_KEY_COMMENTS}/${id}`
    );
  }
  deleteAllReplyComments(
    API_KEY_COMMENTS: string,
    ids: IObjReplyCommentsForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      `https://asbijoux.herokuapp.com/api/reply-comments/${API_KEY_COMMENTS}/delete-all`,
      ids
    );
  }
}
