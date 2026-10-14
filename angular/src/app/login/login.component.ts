import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbpOAuthService } from '@abp/ng.oauth';
import { AuthService } from '@abp/ng.core';

type LoginState = 'loading' | 'error' | 'success';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div class="login-page">
      <div class="login-card">
        @if (state === 'loading') {
          <div class="login-state loading-state">
            <div class="spinner" aria-hidden="true"></div>
            <p class="state-text">Đang đăng nhập...</p>
          </div>
        }
        @if (state === 'error') {
          <div class="login-state error-state">
            <i class="fas fa-exclamation-circle error-icon" aria-hidden="true"></i>
            <p class="state-text">Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.</p>
            <button class="retry-btn" (click)="retry()">Thử lại</button>
          </div>
        }
        @if (state === 'success') {
          <div class="login-state success-state">
            <div class="success-icon-wrap" aria-hidden="true"></div>
            <p class="state-text">Đăng nhập thành công. Vui lòng chờ...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--pf-bg);
      padding: 24px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 48px;
      background-color: var(--pf-surface);
      border: 1px solid var(--pf-border);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      text-align: center;
    }

    .login-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--pf-border);
      border-top-color: var(--pf-primary);
      border-radius: 50%;
      animation: login-spin 1s linear infinite;
    }

    @keyframes login-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error-icon {
      font-size: 48px;
      color: var(--pf-error);
    }

    .success-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--pf-success);
      position: relative;
    }

    .success-icon-wrap::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 24px;
      height: 12px;
      border: solid #ffffff;
      border-width: 0 4px 4px 0;
    }

    .state-text {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
    }

    .error-state .state-text {
      color: var(--pf-error);
    }

    .success-state .state-text {
      color: var(--pf-success);
    }

    .loading-state .state-text {
      color: var(--pf-text);
    }

    .retry-btn {
      padding: 12px 24px;
      font-size: 14px;
      line-height: 22px;
      font-weight: 600;
      color: #ffffff;
      background-color: var(--pf-primary);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .retry-btn:hover {
      background-color: var(--pf-primary-hover);
    }

    .retry-btn:focus-visible {
      outline: 2px solid var(--pf-primary);
      outline-offset: 2px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly oauth = inject(AbpOAuthService);
  private readonly auth = inject(AuthService);

  state: LoginState = 'loading';

  constructor() {
    this.handleAuth();
  }

  private handleAuth(): void {
    if (this.auth.isAuthenticated) {
      this.state = 'success';
      setTimeout(() => this.redirectHome(), 500);
      return;
    }

    this.state = 'loading';
    setTimeout(() => this.triggerLogin(), 500);
  }

  private triggerLogin(): void {
    try {
      this.oauth.navigateToLogin({});
    } catch {
      this.state = 'error';
    }
  }

  retry(): void {
    this.state = 'loading';
    setTimeout(() => this.triggerLogin(), 300);
  }

  private redirectHome(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
