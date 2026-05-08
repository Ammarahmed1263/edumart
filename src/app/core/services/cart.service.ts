import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Course } from '../models/course.model';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly storageKey = 'edumart_cart';
    private platformId = inject(PLATFORM_ID);

    private cartItemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

    cartItems = this.cartItemsSignal.asReadonly();

    cartCount = computed(() => this.cartItemsSignal().length);

    totalPrice = computed(() =>
        this.cartItemsSignal().reduce((total, item) => total + item.price, 0),
    );

    addToCart(course: Course): boolean {
        const currentItems = this.cartItemsSignal();

        const courseAlreadyExists = currentItems.some(
            (item) => item.courseId === course._id,
        );

        if (courseAlreadyExists) {
            return false;
        }

        const cartItem: CartItem = {
            courseId: course._id,
            title: course.title,
            price: course.price,
            imageUrl: course.image,
            categoryName: course.category?.name,
            instructorName: course.instructor?.userName,
        };

        const updatedItems = [...currentItems, cartItem];

        this.updateCart(updatedItems);

        return true;
    }

    removeFromCart(courseId: string): void {
        const updatedItems = this.cartItemsSignal().filter(
            (item) => item.courseId !== courseId,
        );

        this.updateCart(updatedItems);
    }

    clearCart(): void {
        this.updateCart([]);
    }

    removeMultiple(courseIds: string[]): void {
        const updatedItems = this.cartItemsSignal().filter(
            (item) => !courseIds.includes(item.courseId),
        );

        this.updateCart(updatedItems);
    }

    syncWithEnrollments(enrolledIds: string[]): void {
        const currentItems = this.cartItemsSignal();
        const updatedItems = currentItems.filter(
            (item) => !enrolledIds.includes(item.courseId),
        );

        if (updatedItems.length !== currentItems.length) {
            this.updateCart(updatedItems);
        }
    }

    isInCart(courseId: string): boolean {
        return this.cartItemsSignal().some((item) => item.courseId === courseId);
    }

    private updateCart(items: CartItem[]): void {
        this.cartItemsSignal.set(items);
        this.saveCartToStorage(items);
    }

    private loadCartFromStorage(): CartItem[] {
        if (!isPlatformBrowser(this.platformId)) {
            return [];
        }
        const savedCart = localStorage.getItem(this.storageKey);

        if (!savedCart) {
            return [];
        }

        try {
            return JSON.parse(savedCart) as CartItem[];
        } catch {
            return [];
        }
    }

    private saveCartToStorage(items: CartItem[]): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        }
    }
}