import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  baseUrl = environment.baseUrl;

  transform(value: string | string[]): string {
    const noImage = './assets/images/no-image.jpg';

    if ( value.length > 1 ) {
      return `${ this.baseUrl }/files/product/${value[0]}`
    } else {
      return noImage;
    }

  }

}
