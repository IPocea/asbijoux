import { IProductSimple } from './product.interface';

export interface IComment {
  id?: number;
  name: string;
  text: string;
  email: string;
  isActivated?: boolean;
  productId: number | null;
  product?: IProductSimple;
  createdAt?: string;
  updatedAt?: string;
}
export interface ICommentPreview {
  name: string;
  text: string;
}
