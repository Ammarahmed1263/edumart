import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  standalone: true,
})
export class ButtonComponent {

  @Input() defaultText: string = 'Submit';
  @Input() loadingText: string = 'Submitting...';
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isValid: boolean | null = false;
  @Input() className: string = '';
}
