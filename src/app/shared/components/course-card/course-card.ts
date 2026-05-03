import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  level: string;
  categories: string[];
  rating: number;
  ratingCount: number;
  lessons: number;
  students: number;
  price: number;
  originalPrice?: number;
  isFree: boolean;
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css',
})
export class CourseCard {
  @Input() course!: Course;

  get stars() {
    return Array(5).fill(0).map((_, i) => i < Math.floor(this.course.rating));
  }
}
