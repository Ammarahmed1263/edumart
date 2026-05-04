import { Component, inject, signal } from '@angular/core';
import { Course } from '../../../core/models/course.model';
import { CartService } from '../../../core/services/cart.service';
import { CourseService } from '../../../core/services/course.service';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading';

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

  courses = signal<Course[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLatestCourses();
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
