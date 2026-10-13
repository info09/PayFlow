import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-payment-request-list',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="page-header">
      <h2>Đề nghị thanh toán</h2>
      <button class="btn btn-primary">Tạo Đề nghị thanh toán</button>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Số tiền</th>
            <th>Tên</th>
            <th>Tài khoản trả</th>
            <th>Tài khoản thụ hưởng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10.000.000 ₫</td>
            <td>Đề nghị 1</td>
            <td>TK-001</td>
            <td>Phòng Kế toán</td>
            <td><app-badge status="draft">Nháp</app-badge></td>
            <td><button class="btn btn-primary btn-sm">Gửi phê duyệt</button></td>
          </tr>
          <tr>
            <td>5.000.000 ₫</td>
            <td>Đề nghị 2</td>
            <td>TK-002</td>
            <td>Nhân viên B</td>
            <td><app-badge status="pending_approval">Chờ phê duyệt</app-badge></td>
            <td><button class="btn btn-primary btn-sm">Chi tiết</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty-state" *ngIf="false">
      <i class="fas fa-file-invoice"></i>
      <p>Chưa có Đề nghị thanh toán nào.</p>
      <button class="btn btn-primary">Tạo Đề nghị thanh toán</button>
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
      .btn-primary:hover {
        background-color: var(--pf-primary-hover);
      }
      .btn-sm {
        padding: 4px 8px;
        font-size: 12px;
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
      .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
    `,
  ],
})
export class PaymentRequestListComponent {}
