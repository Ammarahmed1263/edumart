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

    handleImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop';
    }
}