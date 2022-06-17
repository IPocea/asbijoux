import { IComment } from './comments.interface';
import { IImageSimple } from './image.interface';

export interface IProductSimple {
  id?: number;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface IProductComplete {
  id?: number;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  images: IImageSimple[];
  comments: IComment[];
}
