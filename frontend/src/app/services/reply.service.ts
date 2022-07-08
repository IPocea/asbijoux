import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IReplyComment,
  IEditDeleteResponse,
  IObjReplyCommentsForDelete,
} from '../interfaces';

const BASE_API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(private http: HttpClient) {}
  addReplyComment(
    API_KEY_COMMENTS: string,
    replyComment: IReplyComment
  ): Observable<IReplyComment> {
    return this.http.post<IReplyComment>(
      BASE_API + `/reply-comments/${API_KEY_COMMENTS}/`,
      replyComment
    );
  }
  modifyReplyComment(
    API_KEY_COMMENTS: string,
    id: number,
    reply: IReplyComment
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      BASE_API + `/reply-comments/${API_KEY_COMMENTS}/${id}`,
      reply
    );
  }
  deleteReplyComment(
    API_KEY_COMMENTS: string,
    id: number
  ): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      BASE_API + `/reply-comments/${API_KEY_COMMENTS}/${id}`
    );
  }
  deleteAllReplyComments(
    API_KEY_COMMENTS: string,
    ids: IObjReplyCommentsForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      BASE_API + `/reply-comments/${API_KEY_COMMENTS}/delete-all`,
      ids
    );
  }
}
