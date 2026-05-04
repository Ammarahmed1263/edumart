import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CourseService } from '../../core/services/course.service';
import { Category, Course } from '../../core/models/course.model';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CourseCardComponent, LoadingComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  private courseService = inject(CourseService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courses = signal<Course[]>([]);
  categories = signal<Category[]>([]);

  selectedCategoryId = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParamMap.subscribe((params) => {
      const categoryId = params.get('category') ?? '';
      this.selectedCategoryId.set(categoryId);
      this.loadCourses(categoryId || undefined);
    });
  }

  loadCourses(categoryId?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.courseService.getCourses(categoryId).subscribe({
      next: (response) => {
        this.courses.set(response.data.courses);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load courses. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data.categories);
      },
      error: () => {
        this.errorMessage.set('Failed to load categories.');
      },
    });
  }

  filterByCategory(categoryId: string): void {
    this.router.navigate([], {
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge',
    });
  }

  showAllCourses(): void {
    this.router.navigate([], {
      queryParams: { category: null },
      queryParamsHandling: 'merge',
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

  getCourseImage(course: Course): string {
    return course.image || 'assets/download.webp';
  }
}
