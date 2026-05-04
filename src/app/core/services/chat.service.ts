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
    // We don't update local messages immediately because the backend returns the full history
    this.isLoading.set(true);

    const body = {
      message: content,
      history: this.messages()
        .filter((m) => m.content !== 'Hello! How can I help you today?') // Filter out initial greeting if needed, or keep it
        .map((m) => ({
          role: m.role,
          content: m.content,
        })),
    };

    this.http.post<any>(`${environment.apiUrl}/chatbot/chat`, body).subscribe({
      next: (res) => {
        // Based on the controller: res.status === 'success' and data is in res.data
        if (res.status === 'success' && res.data.history) {
          // The backend returns the full conversation history including the new user message and assistant reply
          // We can map the roles to match our interface if necessary
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
