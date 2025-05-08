import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, AsyncPipe]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  productCount: number = 0;

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.displayedProducts = [...products];
        this.productCount = products.length;
      },
      error: (err) => {}
    });
  }

  toggleSort(): void {
    if (this.sortDirection === 'none' || this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
      this.displayedProducts = this.productService.sortProductsAlphabetically(this.displayedProducts, true);
    } else {
      this.sortDirection = 'desc';
      this.displayedProducts = this.productService.sortProductsAlphabetically(this.displayedProducts, false);
    }
  }

  searchProducts(): void {
    this.displayedProducts = this.productService.searchProducts(this.products, this.searchTerm);

    if (this.sortDirection === 'asc') {
      this.displayedProducts = this.productService.sortProductsAlphabetically(this.displayedProducts, true);
    } else if (this.sortDirection === 'desc') {
      this.displayedProducts = this.productService.sortProductsAlphabetically(this.displayedProducts, false);
    }
  }

  getStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const result = Array(5).fill(0);

    for (let i = 0; i < fullStars; i++) {
      result[i] = 2; // Full star
    }

    if (rating % 1 >= 0.5) {
      result[fullStars] = 1; // Half star
    }

    return result;
  }
}
