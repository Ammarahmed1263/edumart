import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
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
    const items = this.cartService.cartItems() || [];
    if (!items.length) return null;
    const total = this.cartService.totalPrice();
    return {
      items: items.map((i) => ({
        id: i.courseId,
        title: i.title,
        price: i.price,
        image: i.imageUrl,
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
    const item = this.cartService.cartItems()[index];
    if (item) {
      this.cartService.removeFromCart(item.courseId);
    }
  }
}
