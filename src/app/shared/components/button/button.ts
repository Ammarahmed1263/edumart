import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input() defaultText: string = 'Submit';
  @Input() loadingText: string = 'Submitting...';
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isValid: boolean | null = false;
}
