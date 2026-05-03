import { Component, input } from '@angular/core';

@Component({
  selector: 'app-receipt-item',
  standalone: true,
  templateUrl: './receipt-item.html',
  styleUrl: './receipt-item.css',
})
export class ReceiptItem {
  name = input.required<string>();
}
