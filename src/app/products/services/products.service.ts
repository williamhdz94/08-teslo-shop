import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProductsResponse, Product } from '@products/interfaces/IProducts';
import { IOptions } from '@shared/interfaces/IOptionsParams';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);

  baseUrl: string = environment.baseUrl;

  getProducts(options: IOptions): Observable<IProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    return this.http.get<IProductsResponse>(`${this.baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
    .pipe(tap((resp) => console.log(resp)));
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${ slug }`)
  }

}
