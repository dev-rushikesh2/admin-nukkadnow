import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'piiMask',
  standalone: true,
})
export class PiiMaskPipe implements PipeTransform {
  transform(value: string | null | undefined, type: 'phone' | 'email' | 'pan' | 'aadhaar' = 'phone'): string {
    if (!value) return '—';
    const val = value.trim();

    switch (type) {
      case 'phone':
        return val.length > 4 ? `+91 ******${val.slice(-4)}` : '******';
      case 'email': {
        const parts = val.split('@');
        if (parts.length < 2) return '*****@***';
        return `${parts[0].slice(0, 2)}***@${parts[1]}`;
      }
      case 'pan':
        return val.length === 10 ? `${val.slice(0, 2)}*****${val.slice(-2)}` : '**********';
      case 'aadhaar':
        return val.length > 4 ? `XXXX-XXXX-${val.slice(-4)}` : 'XXXXXXXXXXXX';
      default:
        return '********';
    }
  }
}
