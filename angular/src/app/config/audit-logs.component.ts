import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../shared/components/badge/badge.component';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Nhật ký kiểm toán</h2>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người thực hiện</th>
            <th>Thao tác</th>
            <th>Đối tượng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10/12/2026 14:30</td>
            <td>admin</td>
            <td>Tạo Đề nghị thanh toán</td>
            <td>PR-001</td>
          </tr>
        </tbody>
      </table>
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
    `,
  ],
})
export class AuditLogsComponent {}
