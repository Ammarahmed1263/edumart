import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CheckoutPayload, CheckoutResponse, SessionData } from '../models/checkout.types';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiBase = environment.apiUrl.replace(/\/$/, '');

  createCheckoutSession(courseIds: string[]): Observable<CheckoutResponse> {
    const payload: CheckoutPayload = { courseIds };
    return this.http.post<CheckoutResponse>(
      `${this.apiBase}/payments/create-checkout-session`,
      payload,
    );
  }

  getCheckoutSession(sessionId: string): Observable<{ data: SessionData }> {
    return this.http.get<{ data: SessionData }>(
      `${this.apiBase}/payments/checkout-session/${encodeURIComponent(sessionId)}`,
    );
  }
}
