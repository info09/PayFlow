import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Đối soát</h2>
      <button class="btn btn-primary">Nhập file Giao dịch giả lập</button>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Lệnh</th>
            <th>Giao dịch giả lập</th>
            <th>Kết quả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ORD-001</td>
            <td>GT-001</td>
            <td><app-badge status="completed">Khớp</app-badge></td>
            <td><button class="btn btn-secondary btn-sm">Chi tiết</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty-state" *ngIf="false">
      <i class="fas fa-exchange-alt"></i>
      <p>Chưa có Kết quả đối soát nào. Hãy Nhập file Giao dịch giả lập để bắt đầu.</p>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .btn {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        cursor: pointer;
      }
      .btn-primary {
        background-color: var(--pf-primary);
        color: white;
      }
      .card {
        background-color: var(--pf-surface);
        border: 1px solid var(--pf-border);
        border-radius: 8px;
        overflow: hidden;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid var(--pf-border);
      }
      .table th {
        font-weight: 600;
        color: var(--pf-text-secondary);
        font-size: 12px;
        text-transform: uppercase;
      }
      .empty-state {
        text-align: center;
        padding: 48px;
        color: var(--pf-text-secondary);
      }
    `,
  ],
})
export class ReconciliationComponent {}
