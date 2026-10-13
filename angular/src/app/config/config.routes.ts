import { Routes } from '@angular/router';

export const CONFIG_ROUTES: Routes = [
  { path: 'approval-workflows', loadComponent: () => import('../config/approval-workflows.component').then(m => m.ApprovalWorkflowsComponent) },
  { path: 'departments', loadComponent: () => import('../config/departments.component').then(m => m.DepartmentsComponent) },
  { path: 'payment-accounts', loadComponent: () => import('../config/payment-accounts.component').then(m => m.PaymentAccountsComponent) },
  { path: 'members-roles', loadComponent: () => import('../config/members-roles.component').then(m => m.MembersRolesComponent) },
  { path: '', redirectTo: 'approval-workflows', pathMatch: 'full' }
];
