import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-hero',
  imports: [],
  templateUrl: './auth-hero.html',
  styleUrl: './auth-hero.css',
})
export class AuthHero {
  @Input() titleStart: string = 'Learn Without';
  @Input() titleHighlight: string = 'Limits.';
  @Input() subtitle: string =
    'Join millions of learners unlocking world-class courses, mentors, and certifications — all in one place.';
}
