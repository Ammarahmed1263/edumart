import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../core/models/course.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-my-courses',
  imports: [RouterLink],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class MyCourses {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  courses = signal<Course[]>([]);
  results = signal(0);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  user = this.authService.currentUser;
  userName = computed(() => this.user().user?.userName ?? 'Student');
  userEmail = computed(() => this.user().user?.email ?? '');
  userInitials = computed(() => this.getUserInitials());

  ngOnInit() {
    this.loadMyCourses();
  }

  loadMyCourses() {
    this.isLoading.set(true);
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        this.courses.set(response.data.courses ?? []);
        this.results.set(response.data.results ?? 0);
        this.errorMessage.set(null);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your enrollments yet. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  getUserInitials(): string {
    const name = this.user().user?.userName?.trim();
    if (name) {
      const parts = name.split(' ').filter(Boolean);
      const first = parts[0]?.[0] ?? '';
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
      return `${first}${last}`.toUpperCase();
    }
    const email = this.user().user?.email?.trim();
    return email ? email[0].toUpperCase() : 'U';
  }
}
