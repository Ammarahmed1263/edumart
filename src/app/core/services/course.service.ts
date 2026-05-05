import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoriesResponse,
  CoursesResponse,
  LessonsResponse,
  MyCoursesResponse,
  ReviewsResponse,
  SingleCourseResponse,
} from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCourses(categoryId?: string): Observable<CoursesResponse> {
    let params = new HttpParams();

    if (categoryId) {
      params = params.set('category', categoryId);
    }

    return this.http.get<CoursesResponse>(`${this.apiUrl}/courses`, {
      params,
    });
  }

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`);
  }

  getCourseById(courseId: string): Observable<SingleCourseResponse> {
    return this.http.get<SingleCourseResponse>(`${this.apiUrl}/courses/${courseId}`);
  }

  getCourseReviews(courseId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/courses/${courseId}/reviews`);
  }

  getCourseLessons(courseId: string): Observable<LessonsResponse> {
    return this.http.get<LessonsResponse>(`${this.apiUrl}/courses/${courseId}/lessons`);
  }

  getMyCourses(): Observable<MyCoursesResponse> {
    return this.http.get<MyCoursesResponse>(`${this.apiUrl}/enrollments/my-courses`);
  }
}
