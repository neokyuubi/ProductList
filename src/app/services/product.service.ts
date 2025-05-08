import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products?limit=100';
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    this.loadingSubject.next(true);
    return new Observable<Product[]>(observer => {
      setTimeout(() => {
        this.http.get<{products: Product[]}>(this.apiUrl).pipe(
          map(response => response.products),
          catchError(this.handleError<Product[]>('getProducts', [])),
          finalize(() => this.loadingSubject.next(false))
        ).subscribe({
          next: products => observer.next(products),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      }, 2000);
    });
  }

  sortProductsAlphabetically(products: Product[], ascending: boolean): Product[] {
    return [...products].sort((a, b) => {
      if (ascending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }

  searchProducts(products: Product[], term: string): Product[] {
    if (!term.trim()) {
      return products;
    }
    term = term.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(term)
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
