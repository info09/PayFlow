import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-payment-order-list',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Lệnh thanh toán</h2>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Lệnh</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Mã giao dịch</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ORD-001</td>
            <td>10.000.000 ₫</td>
            <td><app-badge status="processing">Đang thực thi</app-badge></td>
            <td>-</td>
            <td><button class="btn btn-secondary btn-sm">Chi tiết</button></td>
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
      }
      .btn-secondary {
        background-color: var(--pf-secondary);
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
export class PaymentOrderListComponent {}
