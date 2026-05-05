import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { ChatbotComponent } from '../chatbot/chatbot';
import { ToastComponent } from '../toast/toast';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Footer, ChatbotComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
