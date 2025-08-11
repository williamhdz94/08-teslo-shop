import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrouselComponent } from '@products/components/product-carrousel/product-carrousel.component';
import { Product } from '@products/interfaces/IProducts';
import { FormUtils } from '@shared/utils/form-utils';
import { LabelFormErrorComponent } from "@shared/components/label-form-error/label-form-error.component";
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarrouselComponent,
    ReactiveFormsModule,
    LabelFormErrorComponent
],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  fb = inject(FormBuilder);
  productService = inject(ProductsService);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset( formLike as any );
    this.productForm.patchValue( { tags: formLike.tags?.join(',') } )
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if( currentSizes.includes(size) ) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes })
  }

  onSubmit() {
    const isValid = this.productForm.valid;

    this.productForm.markAllAsTouched();

    if( !isValid ) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map((tag) => tag.trim()) ?? []
    };

    this.productService.updateProduct(this.product().id, productLike).subscribe(
      product => {
        console.log('producto actualizado', product)
      }
    );
  }

}
