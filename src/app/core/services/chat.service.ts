import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  messages = signal<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    let shouldLoad = true;
    
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') {
      sessionStorage.removeItem('chat_history');
      shouldLoad = false;
    }

    if (shouldLoad) {
      const saved = sessionStorage.getItem('chat_history');
      if (saved) {
        try {
          this.messages.set(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse chat history', e);
        }
      }
    }

    effect(() => {
      sessionStorage.setItem('chat_history', JSON.stringify(this.messages()));
    });
  }

  sendMessage(content: string) {
    const userMessage: ChatMessage = { role: 'user', content };
    this.messages.update((prev) => [...prev, userMessage]);
    this.isLoading.set(true);

    const body = {
      message: content,
      history: this.messages()
        .filter((m) => m.content !== 'Hello! How can I help you today?')
        .slice(0, -1)
        .map((m) => ({
          role: m.role,
          content: m.content,
        })),
    };

    this.http.post<any>(`${environment.apiUrl}/chatbot/chat`, body).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data.history) {
          const newHistory: ChatMessage[] = res.data.history.map((m: any) => ({
            role: m.role,
            content: m.content,
          }));

          this.messages.set(newHistory);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messages.update((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
        ]);
        this.isLoading.set(false);
        console.error('Chatbot error:', err);
      },
    });
  }
}
