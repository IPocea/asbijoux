import { Component, OnInit } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  constructor(private scroll: ScrollService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.scroll.scrollTo('article-component-container');
    }, 500);
  }
}
