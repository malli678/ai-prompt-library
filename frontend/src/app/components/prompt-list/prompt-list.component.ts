import { Component, OnInit } from '@angular/core';
import { PromptService, PromptSummary } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  prompts: PromptSummary[] = [];
  loading = true;
  error = '';

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        this.prompts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load prompts. Is the backend running?';
        this.loading = false;
      }
    });
  }

  getBadgeClass(complexity: number): string {
    if (complexity <= 3) return 'badge badge-low';
    if (complexity <= 6) return 'badge badge-medium';
    return 'badge badge-high';
  }

  getBadgeLabel(complexity: number): string {
    if (complexity <= 3) return `Easy (${complexity})`;
    if (complexity <= 6) return `Medium (${complexity})`;
    return `Hard (${complexity})`;
  }
}
