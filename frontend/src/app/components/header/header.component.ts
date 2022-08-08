import { Component, HostListener, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchValue: string = '';
  isAdminLoggedIn: boolean = false;
  isCategoryEnabled: boolean = false;
  isContactEnabled: boolean = false;
  isArticleEnabled: boolean = true;
  isFullArticleDisplayed: boolean = false;
  isSideNavLeft: boolean = false;
  isSideNavRight: boolean = false;
  articleDisplayMessage: string = 'Arata mai mult';
  articleContent: string =
    'Bijuteriile din aur realizate manual  sunt unice și creative. Orice femeie și-ar dori să poarte o astfel de bijuterie care să îi scoată în evidență personalitatea, feminitatea , frumusețea chipului și a mâinilor. Descoperă alături de noi bijuteria sufletului tău!';
  categories: string[] = [];
  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
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
  enableSearch(): void {
    this.isArticleEnabled = !this.isArticleEnabled;
  }
  goToCategory(page: string): void {
    this.router.navigate(['/categorii', page]);
  }
  goToHome(): void {
    this.userService
      .getAdminComments()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isAdminLoggedIn = true;
        },
        (err) => {
          this.isAdminLoggedIn = false;
        }
      );
    this.router.navigate(['/pagina-principala']);
  }
  goToAccount(): void {
    if (this.isAdminLoggedIn) {
      this.router.navigate(['/logare']);
    }
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
  searchOnMobile(ev: any): void {
    if (ev.keycode === 13 || ev.keyname === 'Enter' || ev.keypress === 13) {
      this.searchProduct();
      if (this.searchValue) {
        this.isArticleEnabled = true;
      }
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
    this.snackBar.openFromComponent(SnackbarComponent, { duration: 3000 });
  }
  showFullArticle(): void {
    this.isFullArticleDisplayed = !this.isFullArticleDisplayed;
    if (this.isFullArticleDisplayed) {
      this.articleDisplayMessage = 'Arata mai putin';
    } else {
      this.articleDisplayMessage = 'Arata mai mult';
    }
  }
  private getCategories(): void {
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
}
