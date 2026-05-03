import { signal, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  cart = signal<Array<any>>([]);

  constructor() {
    // load cart from localStorage on service init
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          this.cart.set(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
        this.cart.set([]);
      }
    }
  }

  add(item: any) {
    this.cart.update((c) => [...c, item]);
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  remove(index: number) {
    this.cart.update((c) => c.filter((_, i) => i !== index));
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  clear() {
    this.cart.set([]);
    localStorage.removeItem('cart');
  }
}
