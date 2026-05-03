import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart-service';
import { CartItem } from '../components/cart-item/cart-item';
import { OrderSummary } from '../components/order-summary/order-summary';
import { OrderItem } from '../models/checkout.types';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CartItem, OrderSummary],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout {
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private platformId = inject(PLATFORM_ID);
  private cartService = inject(CartService);

  order = computed(() => {
    const items = this.cartService.cart() || [];
    if (!items.length) return null;
    const total = items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    return {
      items: items.map((i: any) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        image: i.image,
      })),
      total,
    };
  });

  status = signal<'idle' | 'creating' | 'success' | 'error'>('idle');

  initiateCheckout() {
    const o = this.order();
    if (!o) return;
    this.status.set('creating');
    const courseIds = o.items?.map((i: OrderItem) => i.id) || [];
    this.paymentService.createCheckoutSession(courseIds).subscribe({
      next: (response) => {
        if (isPlatformBrowser(this.platformId) && response?.data?.sessionUrl) {
          this.status.set('success');
          window.location.href = response.data.sessionUrl;
        } else {
          this.status.set('error');
        }
      },
      error: (err) => {
        console.error('Checkout initiation failed', err);
        this.status.set('error');
      },
    });
  }

  back() {
    this.router.navigate(['/courses']);
  }

  removeItem(index: number) {
    this.cartService.remove(index);
  }
}
