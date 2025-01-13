import { Pipe, PipeTransform } from '@angular/core';
import { PriceHelper } from '../helpers/price-helper';

@Pipe({
  name: 'priceTruncate',
})
export class PriceTruncatePipe implements PipeTransform {
  transform(value: number): string {
    return PriceHelper.format(value);
  }
}