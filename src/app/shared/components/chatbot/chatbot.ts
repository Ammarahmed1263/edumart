import { Component, signal, ElementRef, ViewChild, inject, effect, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  private elRef = inject(ElementRef);
  chatService = inject(ChatService);
  isOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  userInput = '';

  constructor() {
    let shouldLoad = true;
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') {
      sessionStorage.removeItem('chat_is_open');
      shouldLoad = false;
    }

    if (shouldLoad) {
      const savedIsOpen = sessionStorage.getItem('chat_is_open');
      if (savedIsOpen === 'true') {
        this.isOpen.set(true);
      }
    }

    effect(() => {
      this.chatService.messages();
      this.chatService.isLoading();
      
      sessionStorage.setItem('chat_is_open', String(this.isOpen()));

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
