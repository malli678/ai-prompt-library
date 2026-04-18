import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, PromptDetail } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: PromptDetail | null = null;
  loading = true;
  error = '';
  copied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/prompts']);
      return;
    }
    this.promptService.getPrompt(id).subscribe({
      next: (data) => {
        this.prompt = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.status === 404
          ? 'Prompt not found.'
          : 'Failed to load prompt. Is the backend running?';
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

  goBack(): void {
    this.router.navigate(['/prompts']);
  }

  copyContent(): void {
    if (this.prompt) {
      navigator.clipboard.writeText(this.prompt.content).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }
}
