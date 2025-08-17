import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  baseUrl = environment.baseUrl;

  transform(value: null | string | string[]): string {
    const noImage = './assets/images/no-image.jpg';

    if ( value === null ) {
      return noImage;
    }

    if( typeof value === 'string' && value.startsWith('blob:') ) {
      return value;
    }

    if ( typeof value === 'string' ) {
      return `${ this.baseUrl }/files/product/${ value }`;
    }

    const image = value.at(0);

    if ( !image ) {
     return noImage;
    }

    return `${ this.baseUrl }/files/product/${ image }}`

  }

}
