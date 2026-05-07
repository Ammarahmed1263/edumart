import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/course.model';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage {
  private courseService = inject(CourseService);

  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  searchTerm = signal<string>('');

  accentColors = ['#0d5ef4', '#14b8a6', '#f97316', '#8b5cf6', '#22c55e', '#ec4899'];

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.categories();
    if (!term) return all;

    return all.filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.description && c.description.toLowerCase().includes(term))
    );
  });

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

  onSearch(event: any): void {
    this.searchTerm.set(event.target.value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  getCategoryIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('web') || n.includes('coding') || n.includes('development') || n.includes('programming')) return 'fa-code';
    if (n.includes('design') || n.includes('art') || n.includes('creative') || n.includes('ui') || n.includes('ux')) return 'fa-palette';
    if (n.includes('business') || n.includes('finance') || n.includes('management') || n.includes('startup')) return 'fa-briefcase';
    if (n.includes('marketing') || n.includes('social') || n.includes('ads')) return 'fa-bullhorn';
    if (n.includes('data') || n.includes('science') || n.includes('ai') || n.includes('intelligence')) return 'fa-microchip';
    if (n.includes('photo') || n.includes('video') || n.includes('camera')) return 'fa-camera';
    if (n.includes('music') || n.includes('audio')) return 'fa-music';
    if (n.includes('health') || n.includes('fitness') || n.includes('sport')) return 'fa-heart-pulse';
    if (n.includes('it') || n.includes('software') || n.includes('network') || n.includes('security')) return 'fa-shield-halved';
    if (n.includes('language') || n.includes('english') || n.includes('speak')) return 'fa-language';
    if (n.includes('personal') || n.includes('life') || n.includes('self')) return 'fa-lightbulb';
    return 'fa-layer-group';
  }
}
