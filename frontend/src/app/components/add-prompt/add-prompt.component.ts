import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css']
})
export class AddPromptComponent {
  promptForm: FormGroup;
  submitting = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  get title() { return this.promptForm.get('title')!; }
  get content() { return this.promptForm.get('content')!; }
  get complexity() { return this.promptForm.get('complexity')!; }

  isInvalid(control: any): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  getComplexityLabel(): string {
    const v = Number(this.complexity.value);
    if (!v || v < 1) return '—';
    if (v <= 3) return 'Easy';
    if (v <= 6) return 'Medium';
    return 'Hard';
  }

  getComplexityBadge(): string {
    const v = Number(this.complexity.value);
    if (v <= 3) return 'badge badge-low';
    if (v <= 6) return 'badge badge-medium';
    return 'badge badge-high';
  }

  onSubmit(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitError = '';

    this.promptService.createPrompt(this.promptForm.value).subscribe({
      next: (created) => {
        this.router.navigate(['/prompts', created.id]);
      },
      error: (err) => {
        this.submitting = false;
        if (err.error?.errors) {
          const msgs = Object.values(err.error.errors).join(' ');
          this.submitError = msgs;
        } else {
          this.submitError = 'Failed to save prompt. Please try again.';
        }
      }
    });
  }
}
