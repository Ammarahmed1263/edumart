import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCard, Course } from '../../../shared/components/course-card/course-card';

@Component({
  selector: 'app-latest-courses',
  standalone: true,
  imports: [CommonModule, CourseCard],
  templateUrl: './latest-courses.html',
  styleUrl: './latest-courses.css',
})
export class LatestCourses {
  popularCourses: Course[] = [
    {
      id: '1',
      title: 'Everything You Need to Know About Business',
      thumbnail: 'https://motivoweb.com/nori/wp-content/uploads/2025/08/nori-background-16-720x640.jpg',
      level: 'all',
      categories: ['Business', 'Technology'],
      rating: 4.5,
      ratingCount: 120,
      lessons: 15,
      students: 1200,
      price: 0,
      isFree: true,
    },
    {
      id: '2',
      title: 'Data Science: Complete Data Science',
      thumbnail: 'https://motivoweb.com/nori/wp-content/uploads/2025/08/nori-portfolio-07-720x720.jpg',
      level: 'beginner',
      categories: ['Business', 'Language', 'Marketing'],
      rating: 4.8,
      ratingCount: 225,
      lessons: 20,
      students: 2250,
      price: 29,
      originalPrice: 39,
      isFree: false,
    },
    {
      id: '3',
      title: 'Sales Administrator Certification Practice',
      thumbnail: 'https://motivoweb.com/nori/wp-content/uploads/2025/08/nori-post-4-720x720.jpg',
      level: 'intermediate',
      categories: ['Business', 'Marketing'],
      rating: 4.2,
      ratingCount: 85,
      lessons: 12,
      students: 850,
      price: 0,
      isFree: true,
    },
    {
      id: '4',
      title: 'Maximizing Your Sales Potential Tips',
      thumbnail: 'https://motivoweb.com/nori/wp-content/uploads/2025/08/nori-post-3-720x720.jpg',
      level: 'intermediate',
      categories: ['Business', 'Science'],
      rating: 4.6,
      ratingCount: 150,
      lessons: 10,
      students: 1500,
      price: 0,
      isFree: true,
    },
    {
      id: '5',
      title: 'Web Development Fully Complete Guideline',
      thumbnail: 'https://motivoweb.com/nori/wp-content/uploads/2025/08/nori-post-06-720x720.jpg',
      level: 'beginner',
      categories: ['Science', 'Technology'],
      rating: 4.9,
      ratingCount: 450,
      lessons: 45,
      students: 5600,
      price: 0,
      isFree: true,
    }
  ];
}
