import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../components/cart-item/cart-item';
import { OrderSummary } from '../components/order-summary/order-summary';
import { OrderItem } from '../models/checkout.types';
import { PaymentService } from '../services/payment.service';
import { AuthService } from '../../../core/services/auth.service';

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
  private authService = inject(AuthService);

  readonly cartItems = this.cartService.cartItems;

  status = signal<'idle' | 'creating' | 'success' | 'error'>('idle');
  checkedIds = signal<Set<string>>(new Set<string>());

  order = computed(() => {
    const items = this.cartService.cartItems() || [];
    const checkedIds = this.checkedIds();

    const checkedItems = items.filter((i) => checkedIds.has(i.courseId));

    if (!items.length) return null;

    const total = checkedItems.reduce((sum, i) => sum + i.price, 0);

    return {
      items: checkedItems.map((i) => ({
        id: i.courseId,
        title: i.title,
        price: i.price,
        image: i.imageUrl,
        instructorName: i.instructorName
      })),
      total,
      count: checkedItems.length
    };
  });

  isAllSelected = computed(() => {
    const cartCount = this.cartService.cartItems().length;
    const checkedCount = this.checkedIds().size;

    return cartCount > 0 && cartCount === checkedCount;
  });

  constructor() {
    const items = this.cartService.cartItems();
    if (items.length) {
      this.checkedIds.set(new Set<string>(items.map((i) => i.courseId)));
    }
  }

  initiateCheckout() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    const o = this.order();
    if (!o || o.count === 0) return;

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

  toggleCheck(index: number) {
    const item = this.cartService.cartItems()[index];

    if (item) {
      this.checkedIds.update((currentIds) => {
        const newIds = new Set(currentIds);

        if (newIds.has(item.courseId)) {
          newIds.delete(item.courseId);
        } else {
          newIds.add(item.courseId);
        }

        return newIds;
      });
    }
  }

  toggleAll() {
    const currentlyAllSelected = this.isAllSelected();

    this.checkedIds.update(() => {
      if (currentlyAllSelected) {
        return new Set<string>();
      } else {
        const items = this.cartService.cartItems();
        return new Set<string>(items.map((i) => i.courseId));
      }
    });
  }
}
