import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PromptSummary {
  id: number;
  title: string;
  complexity: number;
  created_at: string;
}

export interface PromptDetail {
  id: number;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  view_count: number;
}

export interface CreatePromptPayload {
  title: string;
  content: string;
  complexity: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = 'http://localhost:8000/prompts';

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<PromptSummary[]> {
    return this.http.get<PromptSummary[]>(`${this.apiUrl}/`);
  }

  getPrompt(id: number): Observable<PromptDetail> {
    return this.http.get<PromptDetail>(`${this.apiUrl}/${id}/`);
  }

  createPrompt(data: CreatePromptPayload): Observable<PromptDetail> {
    return this.http.post<PromptDetail>(`${this.apiUrl}/`, data);
  }
}
