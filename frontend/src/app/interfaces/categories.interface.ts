import { IProductSimple } from './product-simple-interface';

export interface ICategories {
  count: ICategory[];
  rows: IProductSimple[];
}

export interface ICategory {
  category: string;
  count: number;
}
