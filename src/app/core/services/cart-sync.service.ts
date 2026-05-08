import { inject, Injectable, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root',
})
export class CartSyncService {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private courseService = inject(CourseService);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser().user;
      const token = this.authService.currentUser().token;

      if (user && token) {
        this.syncCartWithEnrollments();
      }
    });
  }

  private syncCartWithEnrollments() {
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        const enrolledIds = response.data.courses.map((c: any) => c._id);
        if (enrolledIds.length > 0) {
          this.cartService.syncWithEnrollments(enrolledIds);
        }
      },
      error: (err) => console.error('Cart Sync failed:', err)
    });
  }
}
