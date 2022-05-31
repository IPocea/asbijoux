import { Component, OnInit } from '@angular/core';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessageClass: string = 'error-message-off';
  errorMessage: string = '';
  username: string = '';
  password: string = '';
  faLock = faLock;
  faUser = faUser;
  isUserIconFlagged: boolean = false;
  isPasswordIconFlagged: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['n@dmin']);
    }
  }
  changeIconUserColor(): void {
    if (!this.isUserIconFlagged) {
    } else {
    }
    this.isUserIconFlagged = !this.isUserIconFlagged;
  }
  changeIconPasswordColor(): void {
    if (!this.isPasswordIconFlagged) {
    } else {
    }
    this.isPasswordIconFlagged = !this.isPasswordIconFlagged;
  }
  logIn(): void {
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Te rugam sa introduci un username si o parola';
      this.errorMessageClass = 'error-message-on';
    }
    this.authService
      .login(this.username.trim(), this.password)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.router.navigate(['/n@dmin']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.errorMessageClass = 'error-message-on';
        }
      );
  }
}
