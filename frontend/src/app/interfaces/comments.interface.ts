import { IProduct } from './product.interface';

export interface IComment {
  id?: number;
  name: string;
  text: string;
  email: string;
  isActivated?: boolean;
  productId: number | null;
  product?: IProduct;
  createdAt?: string;
  updatedAt?: string;
  reply_comments?: IReplyComment[];
}
export interface ICommentPreview {
  name: string;
  text: string;
}
export interface IReplyComment {
  id?: number;
  name: string;
  text: string;
  isActivated: boolean;
  commentId: number | null;
  createdAt?: string;
  updatedAt?: string;
  comment?: IComment;
}
export interface IObjCommentsForDelete {
  ids: IDeleteAllComments[];
}
export interface IDeleteAllComments {
  id: number;
}
export interface IObjReplyCommentsForDelete {
  ids: IDeleteAllReplyComments[];
}
export interface IDeleteAllReplyComments {
  id: number;
}
