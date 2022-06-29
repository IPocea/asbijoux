import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear: number;
  constructor(private router: Router, private scroll: ScrollService) {}

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
  }
  goToHome(): void {
    this.scroll.scrollToIgnoreWidth('app-component-header');
    this.router.navigate(['/pagina-principala']);
  }
  goToPolicy(): void {
    this.scroll.scrollToIgnoreWidth('app-component-header');
    this.router.navigate(['/politica-de-confidentialitate']);
  }
}
