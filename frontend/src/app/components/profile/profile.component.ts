import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  isLoading: boolean = false;
  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }
  signOut(): void {
    this.storageService.signOut();
    this.isLoading = true;
    this.router.navigate(['pagina-principala']);
  }
}
