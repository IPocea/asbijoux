import { IProductSimple } from './product.interface';

export interface IImageSimple {
  id?: number;
  type: string;
  name: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  productId: number | null;
  product?: IProductSimple | null;
  isMainImage?: boolean | null;
}

export interface IDeleteAllImages {
  id: number;
  name: string;
}
export interface IObjImagesForDelete {
  images: IDeleteAllImages[];
}
