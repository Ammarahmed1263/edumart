import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private courseService = inject(CourseService);

  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  accentColors = ['#0d5ef4', '#14b8a6', '#f97316', '#8b5cf6', '#22c55e', '#ec4899'];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.courseService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data.categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load categories.');
        this.isLoading.set(false);
      },
    });
  }
}
