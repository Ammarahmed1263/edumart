import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SessionData } from '../models/checkout.types';
import { PaymentService } from '../services/payment.service';
import { CartService } from '../../../core/services/cart.service';
import { ReceiptItem } from '../components/receipt-item/receipt-item';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [UpperCasePipe, RouterLink, ReceiptItem],
  templateUrl: './success.html',
  styleUrls: ['./success.css'],
})
export class Success implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private cartService = inject(CartService);

  sessionData = signal<SessionData | null>(null);

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) return;

    this.paymentService.getCheckoutSession(sessionId).subscribe({
      next: (res) => {
        this.sessionData.set(res.data);
        try {
          this.cartService.clearCart();
        } catch (e) {
          console.error('Failed to clear cart after success', e);
        }
      },
      error: (err) => console.error('Failed to load session data', err),
    });
  }
}
