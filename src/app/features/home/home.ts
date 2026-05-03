import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  private router = inject(Router);

  products = {
    items: [
      {
        id: '69ef3fa34f7eb677a8eecb9f',
        title: 'Complete Kubernetes Step by Step - 2',
        description:
          'This is a comprehensive course on Complete Kubernetes Step by Step - 2. Learn from industry experts and enhance your career.',
        price: 36,
        category: { $oid: '69ef3fa34f7eb677a8eecb97' },
        instructor: { $oid: '69ef3f9b4f7eb677a8eecb7d' },
        __v: 0,
        createdAt: { $date: '2026-04-27T10:51:15.208Z' },
        updatedAt: { $date: '2026-04-27T10:51:15.208Z' },
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
      },
      {
        id: '69ef3fa34f7eb677a8eecbbf',
        title: 'Masterclass Leadership Course - 34',
        description:
          'This is a comprehensive course on Masterclass Leadership Course - 34. Learn from industry experts and enhance your career.',
        price: 94,
        category: { $oid: '69ef3fa34f7eb677a8eecb9b' },
        instructor: { $oid: '69ef3f9b4f7eb677a8eecb7b' },
        __v: 0,
        createdAt: { $date: '2026-04-27T10:51:15.208Z' },
        updatedAt: { $date: '2026-04-27T10:51:15.208Z' },
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
      },
      {
        id: '69ef3fa34f7eb677a8eecbd5',
        title: 'Complete Digital Marketing Bootcamp - 56',
        description:
          'This is a comprehensive course on Complete Digital Marketing Bootcamp - 56. Learn from industry experts and enhance your career.',
        price: 154,
        category: { $oid: '69ef3fa34f7eb677a8eecb99' },
        instructor: { $oid: '69ef3f9b4f7eb677a8eecb7e' },
        __v: 0,
        createdAt: { $date: '2026-04-27T10:51:15.209Z' },
        updatedAt: { $date: '2026-04-27T10:51:15.209Z' },
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
      },
    ],
    total: 2347,
  };

  goToCheckout() {
    // store static order for the checkout screen to read
    const order = this.products;
    console.log('data: ', JSON.stringify(order, null, 2));
    localStorage.setItem('cart', JSON.stringify(order.items));
    this.router.navigate(['/checkout']);
  }
}
