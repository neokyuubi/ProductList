import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from API', fakeAsync(() => {
      const mockProducts = {
        products: [
          { id: 1, title: 'iPhone', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url' },
          { id: 2, title: 'Samsung', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url' }
        ]
      };

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(2);
        expect(products[0].title).toBe('iPhone');
        expect(products[1].title).toBe('Samsung');
      });

      tick(2000);

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    }));

    it('should set loading state while fetching data', fakeAsync(() => {
      let loadingState = false;
      service.loading$.subscribe(state => loadingState = state);

      expect(loadingState).toBe(false);

      service.getProducts().subscribe();
      expect(loadingState).toBe(true);

      tick(2000);
      const req = httpMock.expectOne(service['apiUrl']);
      req.flush({ products: [] });

      expect(loadingState).toBe(false);
    }));
  });

  describe('sortProductsAlphabetically', () => {
    it('should sort products in ascending order', () => {
      const products: Product[] = [
        { id: 1, title: 'iPhone', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 2, title: 'Samsung', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 3, title: 'Anker', price: 799, rating: 4.1, category: 'accessories', thumbnail: 'url', description: 'desc' }
      ];

      const result = service.sortProductsAlphabetically(products, true);

      expect(result[0].title).toBe('Anker');
      expect(result[1].title).toBe('iPhone');
      expect(result[2].title).toBe('Samsung');
    });

    it('should sort products in descending order', () => {
      const products: Product[] = [
        { id: 1, title: 'iPhone', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 2, title: 'Samsung', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 3, title: 'Anker', price: 799, rating: 4.1, category: 'accessories', thumbnail: 'url', description: 'desc' }
      ];

      const result = service.sortProductsAlphabetically(products, false);

      expect(result[0].title).toBe('Samsung');
      expect(result[1].title).toBe('iPhone');
      expect(result[2].title).toBe('Anker');
    });
  });

  describe('searchProducts', () => {
    it('should return all products when search term is empty', () => {
      const products: Product[] = [
        { id: 1, title: 'iPhone', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 2, title: 'Samsung', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url', description: 'desc' }
      ];

      const result = service.searchProducts(products, '');
      expect(result.length).toBe(2);
    });

    it('should filter products by search term', () => {
      const products: Product[] = [
        { id: 1, title: 'iPhone 13', price: 999, rating: 4.5, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 2, title: 'Samsung Galaxy', price: 899, rating: 4.3, category: 'smartphones', thumbnail: 'url', description: 'desc' },
        { id: 3, title: 'iPhone 14', price: 1099, rating: 4.7, category: 'smartphones', thumbnail: 'url', description: 'desc' }
      ];

      const result = service.searchProducts(products, 'iphone');
      expect(result.length).toBe(2);
      expect(result[0].title).toBe('iPhone 13');
      expect(result[1].title).toBe('iPhone 14');
    });
  });
});
