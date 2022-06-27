import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { CategoryComponent } from './pages/category/category.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { ArticleComponent } from './pages/article/article.component';

const routes: Routes = [
  { path: 'pagina-principala', component: HomeComponent },
  { path: 'categorii/:name', component: CategoryComponent },
  { path: 'cautare/:name', component: SearchComponent },
  { path: 'logare', component: LoginComponent },
  { path: 'n@dmin', component: AdminComponent },
  { path: 'produs/:category/:title/:id', component: ProductComponent },
  { path: 'articol/verighete', component: ArticleComponent },
  { path: '', redirectTo: '/pagina-principala', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
