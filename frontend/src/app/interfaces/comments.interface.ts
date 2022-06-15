import { IProductSimple } from './product.interface';

export interface IComments {
  id?: number;
  name: string;
  text: string;
  email: string;
  isActivated: boolean;
  productId: number | null;
  product?: IProductSimple;
}
