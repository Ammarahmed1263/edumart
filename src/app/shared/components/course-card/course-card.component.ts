import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../../core/models/course.model';

@Component({
    selector: 'app-course-card',
    standalone: true,
    imports: [CurrencyPipe, RouterLink],
    templateUrl: './course-card.component.html',
    styleUrl: './course-card.component.css',
})
export class CourseCardComponent {
    @Input({ required: true }) course!: Course;
    @Input() isInCart = false;
    @Input() isEnrolled = false;

    @Output() addToCart = new EventEmitter<Course>();

    onAddToCart(): void {
        this.addToCart.emit(this.course);
    }

    getCourseImage(): string {
        return this.course.image || 'assets/download.webp';
    }
}