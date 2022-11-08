import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AddProductComponent } from '@components/add-product/add-product.component';
import { EditProductComponent } from '@components/edit-product/edit-product.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { ViewProductsComponent } from '@components/view-products/view-products.component';
import { CommentsAdminComponent } from '@components/comments-admin/comments-admin.component';
import { CarouselAdminComponent } from '@components/carousel-admin/carousel-admin.component';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatPaginatorIntlCro } from '../../helpers/customClass';
import { QuillModule } from 'ngx-quill';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '@components/modules/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    EditProductComponent,
    ProfileComponent,
    ViewProductsComponent,
    CommentsAdminComponent,
    CarouselAdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    QuillModule.forRoot(),
    MatSelectModule,
    TextFieldModule,
    SharedModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
})
export class AdminModule {}
