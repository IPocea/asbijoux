import { IComment } from './comments.interface';
import { IImageSimple } from './image.interface';

export interface IProduct {
  id?: number;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  images?: IImageSimple[];
  comments?: IComment[];
}
