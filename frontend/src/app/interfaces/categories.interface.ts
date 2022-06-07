import { IProductSimple } from './product.interface';

export interface ICategories {
  count: ICategory[];
  rows: IProductSimple[];
}

export interface ICategory {
  category: string;
  count: number;
}
