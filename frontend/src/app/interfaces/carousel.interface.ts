import { IProductSimple } from './product.interface';

export interface ICarousel {
  id?: number;
  type: string;
  name: string;
  url: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  productId: number;
  product?: IProductSimple;
}
