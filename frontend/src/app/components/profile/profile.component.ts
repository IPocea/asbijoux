import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  isLoading: boolean = false;
  constructor(
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }
  signOut(): void {
    this.storageService.signOut();
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.isLoading = true;
          this.router.navigate(['pagina-principala']);
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
}
