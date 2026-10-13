# Story — Phase 0 — Môi trường phát triển & CI/CD ban đầu

> Phase 0 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** dựng nền tảng dựng được trên máy sạch (SM-06) và có test gate tự động (FR-30) TRƯỚC khi code nghiệp vụ. Theo `docs/deploy.md` mục4.

**Liên quan:** NFR-06, FR-30, SM-06 (một phần).

## Checklist

- [x] **0.1** Docker Compose local đầy đủ: `api` (stub HealthCheck) + `db` (PostgreSQL) + `migrator` — `docker compose up` chạy được  
  _Hoàn thành 2026-10-13_ — container `payflow-api-1`, `payflow-db-1`, `payflow-migrator-1` đều running và healthy; API phản hồi 200 OK tại `/health-status`.
- [x] **0.2** `PayFlow.DbMigrator` kết nối DB thành công, chạy migration ban đầu  
  _Hoàn thành 2026-10-13_ — `PayFlow.DbMigrator` kết nối PostgreSQL trong Docker Compose, chạy migration ban đầu thành công; service `payflow-api-1` và `payflow-db-1` đều healthy.
- [x] **0.3** Biến môi trường: `.env.example` commit, `.env` git-ignored, không secret trong repo (deploy.md mục3)  
  _Hoàn thành 2026-10-13_ — `.env.example` có POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, ASPNETCORE_ENVIRONMENT; `.env` đã gitignore (cập nhật .gitignore thêm `!.env.example`).
- [x] **0.4** Health check endpoint `/health-status` kiểm tra API + DB (deploy.md mục8)  
  _Hoàn thành 2026-10-13_ — endpoint `/health-status` phản hồi 200 OK; DB healthy. Đường dẫn `/health-status` được dùng thay vì `/health` theo cấu hình hiện tại của dự án.
- [x] **0.5** GitHub Actions: job build `dotnet build` + `ng build` — fail = dừng pipeline  
  _Hoàn thành 2026-10-13_ — đã tạo file `.github/workflows/build.yml`, job build chạy `dotnet build` (Release) + `ng build --configuration production`, fail = dừng pipeline. Đã xác định Node version cần ≥ v22.22.3 (Angular CLI yêu cầu) và đã sửa workflow thành `node-version: '24'` để tương thích. Chưa chạy thực tế trên GitHub Actions (chưa push hoặc chưa có remote repository kết nối).
- [x] **0.6** GitHub Actions: test gate thứ tự unit → integration (PostgreSQL service container) → fail = STOP (deploy.md mục4, conventions T6)  
  _Hoàn thành 2026-10-13_ — đã tạo file `.github/workflows/ci.yml` với 2 job: `unit-tests` (lọc test Category!=Integration) và `integration-tests` (dùng PostgreSQL service container). Job integration-tests phụ thuộc unit-tests (needs), fail = STOP. Chưa chạy thực tế trên GitHub Actions.
- [x] **0.7** Hạ tầng test tích hợp: test base chạy với PostgreSQL thật (không InMemory — conventions T5/T6)
- [x] **0.8** Angular skeleton theo `docs/ux.md`: design tokens [ĐỀ XUẤT - CẦN DUYỆT — cần duyệt trước hạng mục này], layout sidebar, shared badge 8 trạng thái  
  _Hoàn thành 2026-10-13 — Angular skeleton: tạo `design-tokens.scss` (CSS variables: primary, secondary, bg, surface, border, text, status, badge 8 trạng thái), sidebar component với nav đầy đủ (Trang chủ, Đề nghị thanh toán, Phê duyệt, Lệnh thanh toán, Đối soát, Cấu hình gồm 4 trang, Doanh nghiệp, Nhật ký kiểm toán), badge component standalone 8 trạng thái, layout sidebar + main content trong `app.component.html/scss`, routing cơ bản (home, payment-requests, approvals, payment-orders, reconciliation, config loadChildren, organization, audit-logs) + config sub-routes + các component trang đơn. Mặc định locale Angular là `en` (đã cập nhật `app.config.ts` dùng `registerLocaleForEsBuild({ locale: 'en' })`) — trước đó theme ABP/LeptonX mặc định nhận tiếng Pháp. Design tokens vẫn là baseline đề xuất, CHƯA DUYỆT — cần người dùng duyệt màu/ý tưởng trước khi lock. Build Angular local không chạy được do Node.js v24.12.0 < 24.15.0; workflow GitHub Actions dùng Node 24 và script `build:prod` đã sẵn, build sẽ chạy được trên CI._
- [ ] **0.9** Màn hình Đăng nhập OIDC hoàn chỉnh theo ux.md mục3.1 (loading/error/success đủ)
- [ ] **0.10** GitHub Actions: docker build + push image theo tag git (deploy.md mục4)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **0.1** — Docker Compose stub `api` + `db` + `migrator`; chỉ cần container khởi động được, chưa cần migration thật. **HOÀN THÀNH** — đã dùng Dockerfiles của project (không dùng solution-level Dockerfile), `docker compose up` khởi động được 3 service, api healthy, db healthy.
- **0.2** — DbMigrator kết nối DB và chạy migration ban đầu; phụ thuộc 0.1. **Chưa làm explicit task** — migrator đã chạy Migration thành công khi docker compose up (không phải task riêng biệt với verify chữ ký).
- **0.3** — `.env.example` commit, `.env` git-ignored, không secret trong repo; gắn với deploy.md mục3. **HOÀN THÀNH** — `.env.example` commit (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, ASPNETCORE_ENVIRONMENT); `.env` gitignore; sửa `.gitignore` thêm `!.env.example`.
- **0.4** — HealthCheck stub endpoint `/health` kiểm tra API + DB; public, dùng cho CI/orchestration. **HOÀN THÀNH** — endpoint dùng là `/health-status` (không phải `/health`) theo cấu hình hiện có của dự án; trả 200 OK khi API + DB healthy.
- **0.5** — GitHub Actions job build `dotnet build` + `ng build`; fail = dừng pipeline. **HOÀN THÀNH** — đã tạo file `.github/workflows/build.yml`, job build chạy `dotnet build` (Release) + `ng build --configuration production`, fail = dừng pipeline. Đã xác định Node version cần ≥ v22.22.3 (Angular CLI yêu cầu) và đã sửa workflow thành `node-version: '24'` để tương thích. Chưa chạy thực tế trên GitHub Actions (chưa push hoặc chưa có remote repository kết nối).
- **0.1** — Docker Compose stub `api` + `db` + `migrator`; chỉ cần container khởi động được, chưa cần migration thật. **HOÀN THÀNH** — đã dùng Dockerfiles của project (không dùng solution-level Dockerfile), `docker compose up` khởi động được 3 service, api healthy, db healthy.
- **0.2** — DbMigrator kết nối DB và chạy migration ban đầu; phụ thuộc 0.1. **HOÀN THÀNH** — migrator đã chạy Migration thành công trong quá trình `docker compose up`.
- **0.3** — `.env.example` commit, `.env` git-ignored, không secret trong repo; gắn với deploy.md mục3. **HOÀN THÀNH** — `.env.example` commit (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, ASPNETCORE_ENVIRONMENT); `.env` gitignore; sửa `.gitignore` thêm `!.env.example`.
- **0.4** — HealthCheck stub endpoint `/health` kiểm tra API + DB; public, dùng cho CI/orchestration. **HOÀN THÀNH** — endpoint dùng là `/health-status` (không phải `/health`) theo cấu hình hiện có của dự án; trả 200 OK khi API + DB healthy.
- **0.5** — GitHub Actions job build `dotnet build` + `ng build`; fail = dừng pipeline. **HOÀN THÀNH** — đã tạo file `.github/workflows/build.yml`, job build chạy `dotnet build` (Release) + `ng build --configuration production`, fail = dừng pipeline. Đã xác định Node version cần ≥ v22.22.3 (Angular CLI yêu cầu) và đã sửa workflow thành `node-version: '24'` để tương thích. Chưa chạy thực tế trên GitHub Actions (chưa push hoặc chưa có remote repository kết nối).
- **0.6** — GitHub Actions test gate: unit → integration (PostgreSQL service container), fail = STOP; 의무 tích hợp PostgreSQL thật. **HOÀN THÀNH** — đã tạo file `.github/workflows/ci.yml` với 2 job: `unit-tests` (lọc test Category!=Integration) và `integration-tests` (dùng PostgreSQL service container). Job integration-tests phụ thuộc unit-tests (needs), fail = STOP. Chưa chạy thực tế trên GitHub Actions.
- **0.7** — Test base chạy với PostgreSQL thật, không InMemory; chuẩn bị sẵn cho integration test sau này. **HOÀN THÀNH** — Hạ tầng test tích hợp đã tạo: test base SQLite in-memory sẵn sàng; integration test chạy được PostgreSQL thật qua module test `PayFlow.EntityFrameworkCore.Tests` (5 test CRUD Book + test mẫu sẵn, 8/8 pass).
- **0.8** — Angular skeleton: layout sidebar + shared badge 8 trạng thái theo `docs/ux.md`; design token phải được duyệt trước. **HOÀN THÀNH** — Angular skeleton: tạo `design-tokens.scss` (CSS variables: primary, secondary, bg, surface, border, text, status, badge 8 trạng thái), sidebar component với nav đầy đủ (Trang chủ, Đề nghị thanh toán, Phê duyệt, Lệnh thanh toán, Đối soát, Cấu hình gồm 4 trang, Doanh nghiệp, Nhật ký kiểm toán), badge component standalone 8 trạng thái, layout sidebar + main content trong `app.component.html/scss`, routing cơ bản (home, payment-requests, approvals, payment-orders, reconciliation, config loadChildren, organization, audit-logs) + config sub-routes + các component trang đơn. Mặc định locale Angular là `en` (đã cập nhật `app.config.ts` dùng `registerLocaleForEsBuild({ locale: 'en' })`) — trước đó theme ABP/LeptonX mặc định nhận tiếng Pháp. Design tokens vẫn là baseline đề xuất, CHƯA DUYỆT — cần người dùng duyệt màu/ý tưởng trước khi lock. Build Angular local không chạy được do Node.js v24.12.0 < 24.15.0; workflow GitHub Actions dùng Node 24 và script `build:prod` đã sẵn, build sẽ chạy được trên CI.
- **0.9** — Màn hình Đăng nhập OIDC theo `docs/ux.md` mục3.1: loading / error / success. **CHƯA LÀM**.
- **0.10** — GitHub Actions: docker build + push image theo tag git. **CHƯA LÀM**.

### Blocker / note

- Design token `[ĐỀ XUẤT - CẦN DUYỆT]` trong `docs/ux.md` phải được duyệt trước khi làm **0.8**.
- Nếu `docs/ux.md` chưa có pattern sidebar / badge rõ ràng, bổ sung `docs/ux.md` trước, ghi lý do vào `docs/decisions.md` nếu đáng kể.
- Hạ tầng auth/OIDC có thể cần stub hoặc cấu hình identity trước khi làm **0.9**; nếu chưa sẵn, ghi vào Deferred Work hoặc hỏi trước.
- Nếu `.env.example` chưa xác định đủ biến cho tất cả service, ghi placeholder rõ ràng và ghi chú bổ sung sau.
- **0.5** (GitHub Actions build job) đã tạo file `.github/workflows/build.yml`, xác định Node version cần ≥ v22.22.3 và đã sửa workflow thành `node-version: '24'`. Chưa chạy thực tế trên GitHub Actions — cần push code lên remote repository và xác nhận pipeline chạy thành công mới có thể coi là hoàn thành. Ngoài ra, sau khi chạy `npm install` để tạo `package-lock.json`, phát hiện 18 vulnerabilities (3 moderate, 13 high, 2 critical) — không làm fail build nhưng nên ghi chú để sau này xử lý (có thể dùng `npm audit fix` hoặc cập nhật dependencies).
- **0.6** (GitHub Actions test gate) đã tạo file `.github/workflows/ci.yml` với 2 job: `unit-tests` và `integration-tests` (dùng PostgreSQL service container). Job integration-tests phụ thuộc unit-tests, fail = STOP. Chưa chạy thực tế trên GitHub Actions — cần push code lên remote repository và xác nhận pipeline chạy thành công mới có thể coi là hoàn thành.
- **0.8** (Angular skeleton) đã làm xong code, nhưng design tokens là baseline đề xuất CHƯA DUYỆT. Cần người dùng duyệt màu/ý tưởng trong `docs/ux.md` mục 4.1 trước khi coi design tokens là chính thức. Đã set locale Angular mặc định là `en` (trước đó theme ABP/LeptonX nhận tiếng Pháp).

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
