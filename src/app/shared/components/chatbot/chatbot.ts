import { Component, signal, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  chatService = inject(ChatService);
  isOpen = signal(false);
  userInput = '';

  constructor() {
    // This effect runs whenever messages or isLoading signals change
    effect(() => {
      this.chatService.messages();
      this.chatService.isLoading();
      this.isOpen();

      // We still use setTimeout to wait for the DOM render cycle
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.chatService.sendMessage(this.userInput);
    this.userInput = '';
  }

  private scrollToBottom(): void {
    try {
      const element = this.myScrollContainer.nativeElement;
      const lastMessage = element.lastElementChild;

      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } catch (err) {}
  }
}
