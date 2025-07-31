import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarrouselComponent } from "@products/components/product-carrousel/product-carrousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrouselComponent],
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
