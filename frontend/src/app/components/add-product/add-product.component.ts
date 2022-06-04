import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @Input() API_KEY: string | undefined;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  isLoading: boolean = false;
  title: string = '';
  productDescription: string = '';
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productService
      .getAllCategories()
      .pipe(take(1))
      .subscribe(
        (data) => {
          for (let category of data.count) {
            this.options.push(category.category);
          }
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  testBtn(): void {}
  // testValue(): void {
  //   console.log(this.myControl.value);
  // }
}
