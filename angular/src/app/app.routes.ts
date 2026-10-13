import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'payment-requests', loadComponent: () => import('./book/payment-requests/payment-request-list.component').then(m => m.PaymentRequestListComponent) },
  { path: 'approvals', loadComponent: () => import('./book/approvals/approval-list.component').then(m => m.ApprovalListComponent) },
  { path: 'payment-orders', loadComponent: () => import('./book/payment-orders/payment-order-list.component').then(m => m.PaymentOrderListComponent) },
  { path: 'reconciliation', loadComponent: () => import('./book/reconciliation/reconciliation.component').then(m => m.ReconciliationComponent) },
  { path: 'config', loadChildren: () => import('./config/config.routes').then(m => m.CONFIG_ROUTES) },
  { path: 'organization', loadComponent: () => import('./config/organization.component').then(m => m.OrganizationComponent) },
  { path: 'audit-logs', loadComponent: () => import('./config/audit-logs.component').then(m => m.AuditLogsComponent) },
  { path: '**', redirectTo: 'home' }
];
