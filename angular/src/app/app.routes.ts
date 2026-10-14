import { Routes } from '@angular/router';
import { eLayoutType, AuthGuard } from '@abp/ng.core';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'payment-requests', loadComponent: () => import('./book/payment-requests/payment-request-list.component').then(m => m.PaymentRequestListComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'approvals', loadComponent: () => import('./book/approvals/approval-list.component').then(m => m.ApprovalListComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'payment-orders', loadComponent: () => import('./book/payment-orders/payment-order-list.component').then(m => m.PaymentOrderListComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'reconciliation', loadComponent: () => import('./book/reconciliation/reconciliation.component').then(m => m.ReconciliationComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'config', loadChildren: () => import('./config/config.routes').then(m => m.CONFIG_ROUTES), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'organization', loadComponent: () => import('./config/organization.component').then(m => m.OrganizationComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'audit-logs', loadComponent: () => import('./config/audit-logs.component').then(m => m.AuditLogsComponent), data: { layout: eLayoutType.application }, canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent), data: { layout: eLayoutType.empty } },
  { path: '**', redirectTo: 'home' }
];
