import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  token: string | null = '';
  user: IUser | null = null;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  API_KEY: string = '';
  errorNoToken: string = '';
  errorMessageClass: string = '';
  imagePath: string = 'I:/curs/final-project/asbijoux/images/';
  classUser: string = '';
  classViewProducts: string = '';
  classAddProduct: string = '';
  classCategory: string = '';
  isProfileSelected: boolean = false;
  isAddProductSelected: boolean = false;
  isViewProductsSelected: boolean = false;
  isCategorySelected: boolean = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
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
          this.isLoading = false;
        },
        (err) => {
          this.errorNoToken = JSON.parse(err.error).message;
          this.errorMessageClass = 'error-message-on';
          this.isLoading = false;
          return;
        }
      );
    this.setClassActive(0);
    this.setComponentActive(0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToEle();
    }, 500);
  }
  relog(): void {
    this.storageService.signOut();
    this.isLoading = true;
    this.router.navigate(['logare']);
  }
  getProfile(): void {
    this.setClassActive(0);
    this.setComponentActive(0);
    this.scrollToEle();
  }
  addProduct(): void {
    this.setClassActive(1);
    this.setComponentActive(1);
    this.scrollToEle();
  }
  viewProduct(): void {
    this.setClassActive(2);
    this.setComponentActive(2);
    this.scrollToEle();
  }
  getCategories(): void {
    this.setClassActive(3);
    this.setComponentActive(3);
  }
  setClassActive(liIndex: number): void {
    this.classUser = '';
    this.classViewProducts = '';
    this.classAddProduct = '';
    this.classCategory = '';
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
        this.classCategory = 'is-active';
        break;
      default:
        break;
    }
  }
  setComponentActive(componentIndex: number): void {
    this.isProfileSelected = false;
    this.isAddProductSelected = false;
    this.isViewProductsSelected = false;
    this.isCategorySelected = false;
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
        this.isCategorySelected = true;
        break;
      default:
        break;
    }
  }
  scrollToEle() {
    document.getElementById('right-side-admin').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
