import { inject, Pipe, PipeTransform } from '@angular/core';
import { PriceFormatterService } from '../services/price-formatter.service';

@Pipe({
  name: 'priceTruncate',
})
export class PriceTruncatePipe implements PipeTransform {
  private priceFormatterService = inject(PriceFormatterService);

  transform(value: number): string {
    return this.priceFormatterService.format(value);
  }
}