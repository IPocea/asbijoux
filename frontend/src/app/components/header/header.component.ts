import { Component, HostListener, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchValue: string = '';
  isCategoryEnabled: boolean = false;
  isContactEnabled: boolean = false;
  isArticleEnabled: boolean = true;
  isFullArticleDisplayed: boolean = false;
  isSideNavLeft: boolean = false;
  isSideNavRight: boolean = false;
  articleDisplayMessage: string = 'Arata mai mult';
  articleContent: string =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ad ipsa repellendus repudiandae dolorum eveniet perferendis quod non, ab voluptatum doloribus iusto optio quasi laudantium placeat mollitia aperiam dignissimos odit.';
  categories: string[] = [];
  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSideNavRight = false;
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event: Event) {
    this.isCategoryEnabled = false;
    this.isContactEnabled = false;
    this.isSideNavLeft = false;
    this.isSideNavRight = false;
  }
  searchProduct(): void {
    if (!this.searchValue) {
      this.showMessage();
    } else {
      this.router.navigate(['/cautare', this.searchValue]);
    }
  }
  searchProductMobile(): void {
    this.searchProduct();
    if (this.searchValue) {
      this.isArticleEnabled = true;
    }
  }
  showCategories(): void {
    this.isContactEnabled = false;
    event.stopPropagation();
    this.getCategories();
    this.isCategoryEnabled = !this.isCategoryEnabled;
  }
  showContact(): void {
    this.isCategoryEnabled = false;
    event.stopPropagation();
    this.isContactEnabled = !this.isContactEnabled;
  }
  showMenu(): void {
    this.isSideNavLeft = !this.isSideNavLeft;
    event.stopPropagation();
    this.getCategories();
  }
  showContactSidenav(): void {
    this.isSideNavRight = !this.isSideNavRight;
    event.stopPropagation();
  }
  showMessage(): void {
    this.snackBar.open('Va rugam sa introduceti cel putin un caracter', '', {
      duration: 3000,
    });
  }
  showFullArticle(): void {
    this.isFullArticleDisplayed = !this.isFullArticleDisplayed;
    if (this.isFullArticleDisplayed) {
      this.articleDisplayMessage = 'Arata mai putin';
    } else {
      this.articleDisplayMessage = 'Arata mai mult';
    }
  }
  goToCategory(page: string): void {
    this.router.navigate(['/categorii', page]);
  }
  getCategories(): void {
    this.productService
      .getAlllPublishedCategories()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.categories = [];
          for (let category of data.count) {
            this.categories.push(category.category);
          }
          this.categories.sort();
        },
        (err) => {}
      );
  }

  test(): void {
    this.isArticleEnabled = !this.isArticleEnabled;
  }
}
