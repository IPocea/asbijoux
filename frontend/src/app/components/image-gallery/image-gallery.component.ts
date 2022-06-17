import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IProductComplete } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  @Input() product: IProductComplete;
  @ViewChild('mainImage') mainImage: ElementRef;
  constructor() {}

  ngOnInit(): void {}
  selectImage(ev: any): void {
    this.resetImageClass();
    ev.target.className = 'img-slide active-product-image';
    this.mainImage.nativeElement.src = ev.target.src;
  }
  resetImageClass(): void {
    const images = document.getElementsByClassName('img-slide');
    for (let i = 0; i < this.product.images.length; i++) {
      (images[i] as HTMLElement).className = 'img-slide';
    }
  }
}
