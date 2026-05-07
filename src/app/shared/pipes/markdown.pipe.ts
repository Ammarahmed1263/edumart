import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!value) return '';

    const rawHtml = marked.parse(value) as string;

    const cleanHtml = DOMPurify.sanitize(rawHtml);

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }
}
