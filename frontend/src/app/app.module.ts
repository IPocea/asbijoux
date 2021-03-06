import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CategoryComponent } from './pages/category/category.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CommentsAdminComponent } from './components/comments-admin/comments-admin.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommentsComponent } from './components/comments/comments.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { CarouselComponent } from './components/careousel/carousel.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ArticleComponent } from './pages/article/article.component';
import { CarouselAdminComponent } from './components/carousel-admin/carousel-admin.component';
import { MatPaginatorIntlCro } from './helpers/customClass';
import { GdprPolicyComponent } from './pages/gdpr-policy/gdpr-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    CategoryComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    ProductComponent,
    SearchComponent,
    FooterComponent,
    HeaderComponent,
    ProfileComponent,
    ViewProductsComponent,
    AddProductComponent,
    CommentsAdminComponent,
    ImageGalleryComponent,
    CommentsComponent,
    CustomDatePipe,
    SnackbarComponent,
    CarouselComponent,
    EditProductComponent,
    ArticleComponent,
    CarouselAdminComponent,
    GdprPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    QuillModule.forRoot(),
    MatSelectModule,
    MatSnackBarModule,
    MatSidenavModule,
    TextFieldModule,
    MatPaginatorModule,
  ],
  providers: [
    httpInterceptorProviders,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
