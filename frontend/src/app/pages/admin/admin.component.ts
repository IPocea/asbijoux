import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  user: IUser | null = null;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  API_KEY: string = '';
  API_KEY_COMMENTS: string = '';
  errorNoToken: string = '';
  errorMessageClass: string = '';
  classUser: string = '';
  classViewProducts: string = '';
  classAddProduct: string = '';
  classComments: string = '';
  classCarousel: string = '';
  isProfileSelected: boolean = false;
  isAddProductSelected: boolean = false;
  isViewProductsSelected: boolean = false;
  isCommentAdminSelected: boolean = false;
  isCarouselSelected: boolean = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private scroll: ScrollService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (!this.user.username) {
      this.router.navigate(['logare']);
      return;
    }
    this.userService
      .getAdminBoard()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.errorMessageClass = 'error-message-off';
          this.API_KEY = data;
          this.isLoggedIn = true;
          this.userService
            .getAdminComments()
            .pipe(take(1))
            .subscribe(
              (res) => {
                this.API_KEY_COMMENTS = res;
                this.isLoading = false;
                this.scroll.scrollTo('right-side-admin');
              },
              (err) => {}
            );
        },
        (err) => {
          this.errorNoToken = JSON.parse(err.error).message;
          this.errorMessageClass = 'error-message-on';
          this.isLoggedIn = false;
          this.isLoading = false;
          return;
        }
      );
    this.setClassActive(0);
    this.setComponentActive(0);
  }
  getProfile(): void {
    this.setClassActive(0);
    this.setComponentActive(0);
    this.scroll.scrollTo('right-side-admin');
  }
  addProduct(): void {
    this.setClassActive(1);
    this.setComponentActive(1);
    this.scroll.scrollTo('right-side-admin');
  }
  getViewProduct(): void {
    this.setClassActive(2);
    this.setComponentActive(2);
    this.scroll.scrollTo('right-side-admin');
  }
  getCommentsAdmin(): void {
    this.setClassActive(3);
    this.setComponentActive(3);
    this.scroll.scrollTo('right-side-admin');
  }
  getCarousel(): void {
    this.setClassActive(4);
    this.setComponentActive(4);
    this.scroll.scrollTo('right-side-admin');
  }
  relog(): void {
    this.storageService.signOut();
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isLoggedIn = false;
          this.isLoading = true;
          this.router.navigate(['logare']);
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  private setClassActive(liIndex: number): void {
    this.classUser = '';
    this.classViewProducts = '';
    this.classAddProduct = '';
    this.classComments = '';
    this.classCarousel = '';
    switch (liIndex) {
      case 0:
        this.classUser = 'is-active';
        break;
      case 1:
        this.classAddProduct = 'is-active';
        break;
      case 2:
        this.classViewProducts = 'is-active';
        break;
      case 3:
        this.classComments = 'is-active';
        break;
      case 4:
        this.classCarousel = 'is-active';
        break;
      default:
        break;
    }
  }
  private setComponentActive(componentIndex: number): void {
    this.isProfileSelected = false;
    this.isAddProductSelected = false;
    this.isViewProductsSelected = false;
    this.isCommentAdminSelected = false;
    this.isCarouselSelected = false;
    switch (componentIndex) {
      case 0:
        this.isProfileSelected = true;
        break;
      case 1:
        this.isAddProductSelected = true;
        break;
      case 2:
        this.isViewProductsSelected = true;
        break;
      case 3:
        this.isCommentAdminSelected = true;
        break;
      case 4:
        this.isCarouselSelected = true;
        break;
      default:
        break;
    }
  }
}
