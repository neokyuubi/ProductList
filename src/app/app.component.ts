import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list.component';
import { inject } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProductList';

  constructor() {
    inject();
  }
}
