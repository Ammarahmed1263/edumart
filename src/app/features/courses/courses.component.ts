import { Component, inject, signal, computed } from '@angular/core';
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
  enrolledCourseIds = signal<Set<string>>(new Set());
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal<string>('');

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allCourses = this.courses();
    if (!term) return allCourses;
    
    return allCourses.filter(course => 
      course.title.toLowerCase().includes(term) || 
      course.description.toLowerCase().includes(term) ||
      course.instructor.userName.toLowerCase().includes(term)
    );
  });


  ngOnInit(): void {
    this.loadCategories();
    this.loadEnrollments();
    this.route.queryParamMap.subscribe((params) => {
      const categoryId = params.get('category') ?? '';
      this.selectedCategoryId.set(categoryId);
      this.loadCourses(categoryId || undefined);
    });
  }

  loadEnrollments(): void {
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        const ids = new Set(response.data.courses.map((c: any) => c._id));
        this.enrolledCourseIds.set(ids);
      },
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
    if (this.enrolledCourseIds().has(course._id)) {
      this.successMessage.set('You are already enrolled in this course.');
      return;
    }

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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  isCourseInCart(courseId: string): boolean {
    return this.cartService.isInCart(courseId);
  }

  getCourseImage(course: Course): string {
    return course.image || 'assets/download.webp';
  }
}
