import { Component, inject, input, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrouselComponent } from '@products/components/product-carrousel/product-carrousel.component';
import { Product } from '@products/interfaces/IProducts';
import { FormUtils } from '@shared/utils/form-utils';
import { LabelFormErrorComponent } from "@shared/components/label-form-error/label-form-error.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
  router = inject(Router);

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
  wasSaved = signal(false);
  tempImage = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;
  imagesToCarrousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImage()];

    return currentProductImages;
  })

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

  async onSubmit() {
    const isValid = this.productForm.valid;

    this.productForm.markAllAsTouched();

    if( !isValid ) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map((tag) => tag.trim()) ?? []
    };

    if( this.product().id === 'new' ) {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );

      this.router.navigate(['/admin/products', product.id]);

    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike)
      );

    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);

  }

  onFilesChenaged( event: Event ) {
    const fileList = ( event.target as HTMLInputElement).files
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImage.set(imageUrls);

  }

}
