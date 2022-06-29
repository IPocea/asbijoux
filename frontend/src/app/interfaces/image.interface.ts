import { IProduct } from './product.interface';

export interface IImageSimple {
  id?: number;
  type: string;
  name: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  productId: number | null;
  product?: IProduct | null;
  isMainImage?: boolean | null;
}

export interface IDeleteAllImages {
  id: number;
  name: string;
}
export interface IObjImagesForDelete {
  images: IDeleteAllImages[];
}
