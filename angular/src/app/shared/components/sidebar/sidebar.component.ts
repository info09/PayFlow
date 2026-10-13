import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">PayFlow</h1>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li>
            <a routerLink="/home" routerLinkActive="active" class="nav-link">
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </a>
          </li>
          <li>
            <a routerLink="/payment-requests" routerLinkActive="active" class="nav-link">
              <i class="fas fa-file-invoice"></i>
              <span>Đề nghị thanh toán</span>
            </a>
          </li>
          <li>
            <a routerLink="/approvals" routerLinkActive="active" class="nav-link">
              <i class="fas fa-check-circle"></i>
              <span>Phê duyệt</span>
            </a>
          </li>
          <li>
            <a routerLink="/payment-orders" routerLinkActive="active" class="nav-link">
              <i class="fas fa-money-bill"></i>
              <span>Lệnh thanh toán</span>
            </a>
          </li>
          <li>
            <a routerLink="/reconciliation" routerLinkActive="active" class="nav-link">
              <i class="fas fa-exchange-alt"></i>
              <span>Đối soát</span>
            </a>
          </li>
          <li class="nav-section">
            <span class="nav-section-title">Cấu hình</span>
          </li>
          <li>
            <a routerLink="/config/approval-workflows" routerLinkActive="active" class="nav-link">
              <i class="fas fa-exchange"></i>
              <span>Quy trình phê duyệt</span>
            </a>
          </li>
          <li>
            <a routerLink="/config/departments" routerLinkActive="active" class="nav-link">
              <i class="fas fa-building"></i>
              <span>Phòng ban</span>
            </a>
          </li>
          <li>
            <a routerLink="/config/payment-accounts" routerLinkActive="active" class="nav-link">
              <i class="fas fa-university"></i>
              <span>Tài khoản thanh toán</span>
            </a>
          </li>
          <li>
            <a routerLink="/config/members-roles" routerLinkActive="active" class="nav-link">
              <i class="fas fa-users"></i>
              <span>Thành viên và Vai trò</span>
            </a>
          </li>
          <li>
            <a routerLink="/organization" routerLinkActive="active" class="nav-link">
              <i class="fas fa-store"></i>
              <span>Doanh nghiệp</span>
            </a>
          </li>
          <li>
            <a routerLink="/audit-logs" routerLinkActive="active" class="nav-link">
              <i class="fas fa-clipboard-list"></i>
              <span>Nhật ký kiểm toán</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        background-color: var(--pf-surface);
        border-right: 1px solid var(--pf-border);
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .sidebar-header {
        padding: 16px;
        border-bottom: 1px solid var(--pf-border);
      }

      .sidebar-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--pf-primary);
        margin: 0;
      }

      .sidebar-nav {
        flex: 1;
        padding: 8px 0;
        overflow-y: auto;
      }

      .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-list li {
        margin: 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        color: var(--pf-text-secondary);
        text-decoration: none;
        transition: all 0.2s;
        font-size: 14px;
      }

      .nav-link:hover {
        background-color: var(--pf-bg);
        color: var(--pf-text);
      }

      .nav-link.active {
        background-color: var(--pf-primary);
        color: white;
      }

      .nav-link i {
        width: 20px;
        text-align: center;
      }

      .nav-section {
        padding: 8px 16px;
        margin-top: 8px;
      }

      .nav-section-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--pf-text-secondary);
        opacity: 0.7;
      }
    `,
  ],
})
export class SidebarComponent {}
