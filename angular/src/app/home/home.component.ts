import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../shared/components/badge/badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Trang chủ</h2>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Đề nghị thanh toán mới</div>
        <div class="stat-value">12</div>
        <app-badge status="draft">Nháp</app-badge>
      </div>
      <div class="stat-card">
        <div class="stat-label">Chờ phê duyệt</div>
        <div class="stat-value">5</div>
        <app-badge status="pending_approval">Chờ phê duyệt</app-badge>
      </div>
      <div class="stat-card">
        <div class="stat-label">Đã phê duyệt</div>
        <div class="stat-value">23</div>
        <app-badge status="approved">Đã phê duyệt</app-badge>
      </div>
      <div class="stat-card">
        <div class="stat-label">Đang thực thi</div>
        <div class="stat-value">3</div>
        <app-badge status="processing">Đang thực thi</app-badge>
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        margin-bottom: 24px;
      }
      .page-header h2 {
        margin: 0;
        font-size: 24px;
        color: var(--pf-text);
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .stat-card {
        background-color: var(--pf-surface);
        border: 1px solid var(--pf-border);
        border-radius: 8px;
        padding: 16px;
        position: relative;
      }
      .stat-label {
        font-size: 12px;
        color: var(--pf-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--pf-text);
        margin: 8px 0;
      }
    `,
  ],
})
export class HomeComponent {}
