import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProductsResponse, Product } from '@products/interfaces/IProducts';
import { IOptions } from '@shared/interfaces/IOptionsParams';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);

  baseUrl: string = environment.baseUrl;

  private productsCache = new Map<string, IProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: IOptions): Observable<IProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${ limit }-${ offset }-${ gender }`;

    if( this.productsCache.has(key) ) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<IProductsResponse>(`${this.baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
    .pipe(
      tap((resp) => console.log(resp)),
      tap((resp) => this.productsCache.set(key, resp)),
    );
  }

  getProductBySlug(slug: string): Observable<Product> {
    const key = slug;

    if( this.productCache.has(key) ) {
      return of(this.productCache.get(key)!)
    }

    return this.http.get<Product>(`${this.baseUrl}/products/${ slug }`).pipe(
      tap((res) => this.productCache.set(key, res))
    )
  }

  getProductById(id: string): Observable<Product> {
    const key = id;

    if( this.productCache.has(key) ) {
      return of(this.productCache.get(key)!)
    }

    return this.http.get<Product>(`${this.baseUrl}/products/${ id }`).pipe(
      tap((res) => this.productCache.set(key, res))
    )
  }

}
