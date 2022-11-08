import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CustomDatePipe } from '@pipes/custom-date.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '@components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '@components/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { SnackbarComponent } from '@components/snackbar/snackbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
  ],
  declarations: [
    CustomDatePipe,
    HeaderComponent,
    FooterComponent,
    SnackbarComponent,
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CustomDatePipe,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SnackbarComponent,
  ],
})
export class SharedModule {}
