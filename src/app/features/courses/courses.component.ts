import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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
  private authService = inject(AuthService);

  courses = signal<Course[]>([]);
  categories = signal<Category[]>([]);

  selectedCategoryId = signal<string>('');
  enrolledCourseIds = signal<Set<string>>(new Set());
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  searchTerm = signal<string>('');
  
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = 10;

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

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });


  ngOnInit(): void {
    this.loadCategories();
    if (this.authService.isLoggedIn()) {
      this.loadEnrollments();
    }
    this.route.queryParamMap.subscribe((params) => {
      const categoryId = params.get('category') ?? '';
      const page = +(params.get('page') ?? '1');
      
      this.selectedCategoryId.set(categoryId);
      this.currentPage.set(page);
      
      this.loadCourses(categoryId || undefined, page);
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

  loadCourses(categoryId?: string, page: number = 1): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.courseService.getCourses(categoryId, page, this.pageSize).subscribe({
      next: (response) => {
        this.courses.set(response.data.courses);
        this.totalPages.set(response.data.totalPages);
        this.currentPage.set(response.data.page);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load courses. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
    
    // Scroll to the courses grid instead of the absolute top for better UX
    const element = document.querySelector('.courses-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      queryParams: { category: categoryId, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  showAllCourses(): void {
    this.router.navigate([], {
      queryParams: { category: null, page: 1 },
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

  clearSearch(): void {
    this.searchTerm.set('');
  }

  isCourseInCart(courseId: string): boolean {
    return this.cartService.isInCart(courseId);
  }

  getCourseImage(course: Course): string {
    return course.image || 'assets/download.webp';
  }
}
