import { Component, OnInit } from '@angular/core';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessageClass: string = 'error-message-on';
  errorMessage: string = '';
  username: string = '';
  password: string = '';
  faLock = faLock;
  faUser = faUser;
  isLoading: boolean = false;
  private isUserIconFlagged: boolean = false;
  private isPasswordIconFlagged: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUser().username) {
      this.router.navigate(['n@dmin']);
    }
  }
  changeIconUserColor(): void {
    if (!this.isUserIconFlagged) {
      document.getElementById('user-icon').style.color = 'black';
    } else {
      document.getElementById('user-icon').style.color = '#b9b7b7';
    }
    this.isUserIconFlagged = !this.isUserIconFlagged;
  }
  changeIconPasswordColor(): void {
    if (!this.isPasswordIconFlagged) {
      document.getElementById('password-icon').style.color = 'black';
    } else {
      document.getElementById('password-icon').style.color = '#b9b7b7';
    }
    this.isPasswordIconFlagged = !this.isPasswordIconFlagged;
  }
  logIn(e: Event): void {
    e.preventDefault();
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Te rugam sa introduci un username si o parola';
      return;
    }
    this.isLoading = true;
    this.authService
      .login(this.username.trim(), this.password)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.storageService.saveUser(data);
          this.isLoading = false;
          this.router.navigate(['/n@dmin']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      );
  }
}
