import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyzeResponse {
  success: boolean;
  report: {
    documentTitle: string;
    pageUrl: string;
    issues: Array<{
      type: string;
      code: string;
      message: string;
      context: string;
      selector: string;
    }>;
  };
  fixes: Array<{
    code: string;
    message: string;
    context: string;
    explanation: string;
    proposedFix: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  private apiUrl = 'http://localhost:3000/api/analyze';

  constructor(private http: HttpClient) {}

  analyzeUrl(url: string): Observable<AnalyzeResponse> {
    return this.http.post<AnalyzeResponse>(this.apiUrl, { url });
  }
}
