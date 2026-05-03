import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  total = input.required<number>();
  status = input<'idle' | 'creating' | 'success' | 'error'>('idle');

  checkout = output<void>();
  back = output<void>();

  onCheckout() { this.checkout.emit(); }
  onBack() { this.back.emit(); }
}
