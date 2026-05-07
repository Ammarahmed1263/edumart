import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { OrderItem } from '../../models/checkout.types';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartItem {
  item = input.required<OrderItem>();
  index = input.required<number>();
  isChecked = input<boolean>(true);

  remove = output<number>();
  toggleCheck = output<number>();

  onRemove() {
    this.remove.emit(this.index());
  }

  onToggleCheck() {
    this.toggleCheck.emit(this.index());
  }
}
