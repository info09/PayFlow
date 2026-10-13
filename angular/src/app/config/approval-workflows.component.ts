import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../shared/components/badge/badge.component';

@Component({
  selector: 'app-approval-workflows',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Quy trình phê duyệt nhiều cấp</h2>
      <button class="btn btn-primary">Thêm Cấp phê duyệt</button>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Tên quy trình</th>
            <th>Số cấp</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quy trình mặc định</td>
            <td>3</td>
            <td><app-badge status="completed">Hoạt động</app-badge></td>
            <td><button class="btn btn-secondary">Sửa</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty-state" *ngIf="false">
      <i class="fas fa-inbox"></i>
      <p>Chưa có quy trình phê duyệt nào.</p>
      <button class="btn btn-primary">Thêm Cấp phê duyệt</button>
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
      .page-header h2 {
        margin: 0;
        font-size: 24px;
        color: var(--pf-text);
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
      .btn-primary:hover {
        background-color: var(--pf-primary-hover);
      }
      .btn-secondary {
        background-color: var(--pf-secondary);
        color: white;
      }
      .card {
        background-color: var(--pf-surface);
        border: 1px solid var(--pf-border);
        border-radius: 8px;
        padding: 16px;
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
      .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
    `,
  ],
})
export class ApprovalWorkflowsComponent {}
