import { IProduct } from './product.interface';

export interface ICategories {
  count: ICategory[];
  rows: IProduct[];
}

export interface ICategory {
  category: string;
  count: number;
}
