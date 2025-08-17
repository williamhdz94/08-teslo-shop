import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/IUser';
import { Gender, IProductsResponse, Product } from '@products/interfaces/IProducts';
import { IOptions } from '@shared/interfaces/IOptionsParams';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {

  private readonly http = inject(HttpClient);

  baseUrl: string = environment.baseUrl;

  private readonly productsCache = new Map<string, IProductsResponse>();
  private readonly productCache = new Map<string, Product>();

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
    if ( key === 'new' ) {
      return of(emptyProduct);
    }

    if( this.productCache.has(key) ) {
      return of(this.productCache.get(key)!)
    }

    return this.http.get<Product>(`${this.baseUrl}/products/${ id }`).pipe(
      tap((res) => this.productCache.set(key, res))
    )
  }

  updateProduct( id: string, productLike: Partial<Product> ): Observable<Product> {
    return this.http.patch<Product>(`${ this.baseUrl }/products/${ id }`, productLike).pipe(
      tap((product) => this.updateCacheProduct(product))
    )
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${ this.baseUrl }/products`, productLike).pipe(
      tap((product) => this.updateCacheProduct(product))
    )
  }

  updateCacheProduct(product: Product) {
    const id = product.id;

    this.productCache.set(id, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === id ? product : currentProduct;
        }
      )
    })
  }

}
