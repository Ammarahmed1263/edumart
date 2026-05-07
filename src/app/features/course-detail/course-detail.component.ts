import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CourseService } from '../../core/services/course.service';
import { ToastService } from '../../core/services/toast.service';
import { Course, Lesson, Review } from '../../core/models/course.model';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent {
    private route = inject(ActivatedRoute);
    private courseService = inject(CourseService);
    private cartService = inject(CartService);
    private toast = inject(ToastService);

    course = signal<Course | null>(null);
    reviews = signal<Review[]>([]);
    lessons = signal<Lesson[]>([]);

    isLoading = signal<boolean>(false);
    isSubmittingReview = signal<boolean>(false);
    enrolledCourseIds = signal<Set<string>>(new Set());
    hoverRating = signal<number>(0);
    
    newReview = {
        rating: 5,
        comment: ''
    };




    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    lessonsMessage = signal<string | null>(null);

    ngOnInit(): void {
        const courseId = this.route.snapshot.paramMap.get('id');

        if (!courseId) {
            this.errorMessage.set('Course id is missing.');
            return;
        }

        this.loadCourseDetails(courseId);
        this.loadCourseReviews(courseId);
        this.loadCourseLessons(courseId);
        this.loadEnrollments();
    }

    loadEnrollments(): void {
        this.courseService.getMyCourses().subscribe({
            next: (response) => {
                const ids = new Set(response.data.courses.map((c: any) => c._id));
                this.enrolledCourseIds.set(ids);
            },
        });
    }

    loadCourseDetails(courseId: string, silent: boolean = false): void {
        if (!silent) {
            this.isLoading.set(true);
        }
        this.errorMessage.set(null);

        this.courseService.getCourseById(courseId).subscribe({
            next: (response) => {
                this.course.set(response.data.course);
                this.isLoading.set(false);
            },
            error: () => {
                this.errorMessage.set('Failed to load course details.');
                this.isLoading.set(false);
            },
        });
    }

    loadCourseReviews(courseId: string): void {
        this.courseService.getCourseReviews(courseId).subscribe({
            next: (response) => {
                this.reviews.set(response.data.reviews);
            },
            error: () => {
                this.reviews.set([]);
            },
        });
    }

    loadCourseLessons(courseId: string): void {
        this.courseService.getCourseLessons(courseId).subscribe({
            next: (response) => {
                this.lessons.set(response.data.lessons);
            },
            error: () => {
                this.lessons.set([]);
            },
        });
    }

    addToCart(): void {
        const selectedCourse = this.course();

        if (!selectedCourse) {
            return;
        }

        if (this.enrolledCourseIds().has(selectedCourse._id)) {
            this.successMessage.set('You are already enrolled in this course.');
            return;
        }

        const wasAdded = this.cartService.addToCart(selectedCourse);

        if (wasAdded) {
            this.successMessage.set('Course added to cart successfully.');
        } else {
            this.successMessage.set('This course is already in your cart.');
        }

        setTimeout(() => {
            this.successMessage.set(null);
        }, 2000);
    }

    isCourseInCart(): boolean {
        const selectedCourse = this.course();

        if (!selectedCourse) {
            return false;
        }

        return this.cartService.isInCart(selectedCourse._id);
    }

    getCourseImage(course: Course): string {
        return course.image || 'assets/download.webp';
    }

    submitReview(): void {
        const selectedCourse = this.course();
        if (!selectedCourse) return;

        this.isSubmittingReview.set(true);

        this.courseService
            .addReview(selectedCourse._id, this.newReview.rating, this.newReview.comment)
            .subscribe({
                next: () => {
                    this.toast.success('Review submitted successfully!');
                    this.newReview = { rating: 5, comment: '' };
                    this.isSubmittingReview.set(false);
                    this.loadCourseReviews(selectedCourse._id);
                    this.loadCourseDetails(selectedCourse._id, true);
                },
                error: (err) => {
                    this.isSubmittingReview.set(false);
                },
            });
    }
}

