import { Injectable, signal } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  sendMessage(content: string) {
    const userMessage: ChatMessage = { role: 'user', content };
    this.messages.update((prev) => [...prev, userMessage]);

    this.isLoading.set(true);

    const headers = {
      Authorization: `Bearer ${environment.openaiKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 150,
      messages: this.messages().map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    this.http.post<any>(environment.openaiUrl, body, { headers }).subscribe({
      next: (res) => {
        const assistantMessage = res.choices[0].message.content;
        this.messages.update((prev) => [...prev, { role: 'assistant', content: assistantMessage }]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messages.update((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
        ]);
        this.isLoading.set(false);
        console.error('OpenAI error:', err);
      },
    });
  }
}
