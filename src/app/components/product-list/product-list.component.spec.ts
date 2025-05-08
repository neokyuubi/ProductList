import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let mockProducts: Product[];

  beforeEach(async () => {
    mockProducts = [
      { id: 1, title: 'iPhone', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url', description: 'An Apple product' },
      { id: 2, title: 'Samsung Galaxy', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url', description: 'An Android product' },
      { id: 3, title: 'Sony Headphones', price: 299, rating: 4.7, category: 'audio', thumbnail: 'url', description: 'Noise cancelling headphones' }
    ];

    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'sortProductsAlphabetically',
      'searchProducts'
    ]);

    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productServiceSpy.sortProductsAlphabetically.and.callFake((products, ascending) => {
      return [...products].sort((a, b) => {
        if (ascending) {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    });
    productServiceSpy.searchProducts.and.callFake((products, term) => {
      if (!term.trim()) {
        return products;
      }
      term = term.toLowerCase();
      return products.filter(product => product.title.toLowerCase().includes(term));
    });

    // Mock loading$ observable
    Object.defineProperty(productServiceSpy, 'loading$', { value: of(false) });

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(3);
    expect(component.displayedProducts.length).toBe(3);
    expect(component.productCount).toBe(3);
  });

  it('should toggle sort direction and sort products', () => {
    // Initial state
    expect(component.sortDirection).toBe('none');

    // First click - ascending
    component.toggleSort();
    expect(component.sortDirection).toBe('asc');
    expect(productServiceSpy.sortProductsAlphabetically).toHaveBeenCalledWith(jasmine.any(Array), true);

    // Second click - descending
    component.toggleSort();
    expect(component.sortDirection).toBe('desc');
    expect(productServiceSpy.sortProductsAlphabetically).toHaveBeenCalledWith(jasmine.any(Array), false);

    // Third click - back to ascending
    component.toggleSort();
    expect(component.sortDirection).toBe('asc');
  });

  it('should search products by term', () => {
    component.searchTerm = 'iPhone';
    component.searchProducts();

    expect(productServiceSpy.searchProducts).toHaveBeenCalledWith(component.products, 'iPhone');
    // Should maintain sort direction during search
    expect(component.sortDirection).toBe('none');
  });

  it('should generate correct star ratings', () => {
    const result1 = component.getStarsArray(4.5);
    expect(result1).toEqual([2, 2, 2, 2, 1]); // 4 full stars, 1 half star

    const result2 = component.getStarsArray(3.0);
    expect(result2).toEqual([2, 2, 2, 0, 0]); // 3 full stars, 2 empty stars

    const result3 = component.getStarsArray(2.7);
    expect(result3).toEqual([2, 2, 1, 0, 0]); // 2 full stars, 1 half star, 2 empty stars
  });
});
