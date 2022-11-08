import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IReplyComment,
  IEditDeleteResponse,
  IObjReplyCommentsForDelete,
} from '@interfaces';
import { BaseApiService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(
    private http: HttpClient,
    private baseApiService: BaseApiService
  ) {}
  addReplyComment(
    API_KEY_COMMENTS: string,
    replyComment: IReplyComment
  ): Observable<IReplyComment> {
    return this.http.post<IReplyComment>(
      this.baseApiService.getBaseApi() + `/reply-comments/${API_KEY_COMMENTS}/`,
      replyComment
    );
  }
  modifyReplyComment(
    API_KEY_COMMENTS: string,
    id: number,
    reply: IReplyComment
  ): Observable<IEditDeleteResponse> {
    return this.http.put<IEditDeleteResponse>(
      this.baseApiService.getBaseApi() +
        `/reply-comments/${API_KEY_COMMENTS}/${id}`,
      reply
    );
  }
  deleteReplyComment(
    API_KEY_COMMENTS: string,
    id: number
  ): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      this.baseApiService.getBaseApi() +
        `/reply-comments/${API_KEY_COMMENTS}/${id}`
    );
  }
  deleteAllReplyComments(
    API_KEY_COMMENTS: string,
    ids: IObjReplyCommentsForDelete
  ): Observable<IEditDeleteResponse> {
    return this.http.post<IEditDeleteResponse>(
      this.baseApiService.getBaseApi() +
        `/reply-comments/${API_KEY_COMMENTS}/delete-all`,
      ids
    );
  }
}
