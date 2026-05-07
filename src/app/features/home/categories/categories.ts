import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private courseService = inject(CourseService);

  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  accentColors = ['#6366f1', '#14b8a6', '#f97316', '#8b5cf6', '#10b981', '#f43f5e', '#0ea5e9', '#d946ef'];

  getCategoryIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('web') || n.includes('coding') || n.includes('development')) return 'fa-code';
    if (n.includes('design') || n.includes('art') || n.includes('creative')) return 'fa-palette';
    if (n.includes('business') || n.includes('finance') || n.includes('management')) return 'fa-briefcase';
    if (n.includes('marketing') || n.includes('social')) return 'fa-bullhorn';
    if (n.includes('data') || n.includes('science') || n.includes('ai')) return 'fa-microchip';
    if (n.includes('photo') || n.includes('video')) return 'fa-camera';
    if (n.includes('music') || n.includes('audio')) return 'fa-music';
    if (n.includes('health') || n.includes('fitness')) return 'fa-heart-pulse';
    return 'fa-layer-group';
  }

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
