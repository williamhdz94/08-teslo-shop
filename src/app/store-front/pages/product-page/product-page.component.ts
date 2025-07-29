import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productSlug = this.activatedRoute.snapshot.params['idSlug'];

  productBySlugResource = rxResource({
    request: () => ({ idSlug: this.productSlug }),
    loader: ({ request }) => {
      return this.productService.getProductBySlug(request.idSlug);
    }
  });


}
