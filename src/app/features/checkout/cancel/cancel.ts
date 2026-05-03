import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart-service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-checkout-cancel',
  templateUrl: './cancel.html',
  styleUrls: ['./cancel.css'],
})
export class Cancel {
  private router = inject(Router);
  private cartService = inject(CartService);
  private paymentService = inject(PaymentService);

  isRetrying = signal(false);

  backToCart() {
    this.router.navigate(['/checkout']);
  }

  tryAgain() {
    const cart = this.cartService.cart();
    if (!cart || cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      this.router.navigate(['/checkout']);
      return;
    }

    this.isRetrying.set(true);

    const courseIds = cart.map((item: any) => item.id);

    this.paymentService.createCheckoutSession(courseIds).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data?.sessionUrl) {
          window.location.href = response.data.sessionUrl;
        } else {
          alert('Failed to initiate payment. Please try again.');
          this.isRetrying.set(false);
        }
      },
      error: () => {
        alert('Error creating checkout session. Please try again.');
        this.isRetrying.set(false);
      },
    });
  }
}
