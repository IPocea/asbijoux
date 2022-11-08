import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ImageGalleryComponent } from '@components/image-gallery/image-gallery.component';
import { CommentsComponent } from '@components/comments/comments.component';
import { SharedModule } from '@components/modules/shared.module';

@NgModule({
  declarations: [ProductComponent, ImageGalleryComponent, CommentsComponent],
  imports: [CommonModule, ProductRoutingModule, SharedModule],
})
export class ProductModule {}
