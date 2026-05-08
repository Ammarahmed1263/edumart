import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';


import { CartSyncService } from '../../../core/services/cart-sync.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Footer, ChatbotComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private cartSyncService = inject(CartSyncService);
}
