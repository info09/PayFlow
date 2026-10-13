import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'unknown'
  | 'cancelled';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + statusClass">
      {{ displayName }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: white;
    }
    .badge-draft {
      background-color: var(--pf-badge-draft);
    }
    .badge-pending-approval {
      background-color: var(--pf-badge-pending-approval);
    }
    .badge-approved {
      background-color: var(--pf-badge-approved);
    }
    .badge-processing {
      background-color: var(--pf-badge-processing);
    }
    .badge-completed {
      background-color: var(--pf-badge-completed);
    }
    .badge-failed {
      background-color: var(--pf-badge-failed);
    }
    .badge-unknown {
      background-color: var(--pf-badge-unknown);
    }
    .badge-cancelled {
      background-color: var(--pf-badge-cancelled);
      text-decoration: line-through;
    }
  `]
})
export class BadgeComponent {
  @Input() status: BadgeStatus = 'draft';
  @Input() name: string = '';

  get statusClass(): string {
    return this.status.replace(/_/g, '-');
  }

  get displayName(): string {
    if (this.name) return this.name;
    const names: Record<BadgeStatus, string> = {
      draft: 'Nháp',
      pending_approval: 'Chờ phê duyệt',
      approved: 'Đã phê duyệt',
      processing: 'Đang thực thi',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      unknown: 'Chưa xác định',
      cancelled: 'Đã hủy'
    };
    return names[this.status] || this.status;
  }
}
