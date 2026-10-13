import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-approval-list',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Phê duyệt — Hàng chờ của tôi</h2>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Số tiền</th>
            <th>Đề nghị</th>
            <th>Phòng ban</th>
            <th>Cấp phê duyệt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10.000.000 ₫</td>
            <td>Đề nghị 2</td>
            <td>Phòng Kế toán</td>
            <td>Cấp 1</td>
            <td>
              <button class="btn btn-success btn-sm">Phê duyệt</button>
              <button class="btn btn-danger btn-sm">Từ chối</button>
            </td>
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
      .btn {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        margin-right: 8px;
      }
      .btn-success {
        background-color: var(--pf-success);
        color: white;
      }
      .btn-danger {
        background-color: var(--pf-error);
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
    `,
  ],
})
export class ApprovalListComponent {}
