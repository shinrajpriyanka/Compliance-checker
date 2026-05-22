import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyzeService, AnalyzeResponse } from './services/analyze.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  url: string = '';
  isAnalyzing: boolean = false;
  results: AnalyzeResponse | null = null;
  error: string | null = null;

  constructor(private analyzeService: AnalyzeService) {}

  analyze() {
    if (!this.url) {
      this.error = 'Please enter a valid URL';
      return;
    }

    this.isAnalyzing = true;
    this.error = null;
    this.results = null;

    // Optional: basic validation to ensure it starts with http/https
    if (!/^https?:\/\//i.test(this.url)) {
      this.url = 'https://' + this.url;
    }

    this.analyzeService.analyzeUrl(this.url).subscribe({
      next: (response) => {
        this.results = response;
        this.isAnalyzing = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to analyze URL. Please check if the backend is running.';
        this.isAnalyzing = false;
      }
    });
  }
}
