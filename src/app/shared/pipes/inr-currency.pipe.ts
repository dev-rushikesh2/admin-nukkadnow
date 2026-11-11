import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency',
  standalone: true,
})
export class InrCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, isPaise = true): string {
    if (value === null || value === undefined || value === '') return '₹ 0.00';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '₹ 0.00';

    const amountInRupees = isPaise ? num / 100 : num;

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amountInRupees);
  }
}
