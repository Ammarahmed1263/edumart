import { Component, inject, signal } from '@angular/core';
import { Course } from '../../../core/models/course.model';
import { CartService } from '../../../core/services/cart.service';
import { CourseService } from '../../../core/services/course.service';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-latest-courses',
  standalone: true,
  imports: [CourseCardComponent, LoadingComponent],
  templateUrl: './latest-courses.html',
  styleUrl: './latest-courses.css',
})
export class LatestCourses {
  private courseService = inject(CourseService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  enrolledCourseIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadLatestCourses();
    if (this.authService.currentUser().token) {
      this.loadEnrollments();
    }
  }

  loadEnrollments(): void {
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        const ids = new Set(response.data.courses.map((c: any) => c._id));
        this.enrolledCourseIds.set(ids);
      },
    });
  }

  loadLatestCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.courseService.getCourses().subscribe({
      next: (response) => {
        this.courses.set(response.data.courses.slice(0, 3));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load latest courses.');
        this.isLoading.set(false);
      },
    });
  }

  addToCart(course: Course): void {
    const wasAdded = this.cartService.addToCart(course);

    if (wasAdded) {
      this.successMessage.set('Course added to cart successfully.');
    } else {
      this.successMessage.set('This course is already in your cart.');
    }

    setTimeout(() => {
      this.successMessage.set(null);
    }, 2000);
  }

  isCourseInCart(courseId: string): boolean {
    return this.cartService.isInCart(courseId);
  }
}
