# Story — Phase 0 — Môi trường phát triển & CI/CD ban đầu

> Phase 0 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** dựng nền tảng dựng được trên máy sạch (SM-06) và có test gate tự động (FR-30) TRƯỚC khi code nghiệp vụ. Theo `docs/deploy.md` mục4.

**Liên quan:** NFR-06, FR-30, SM-06 (một phần).

## Checklist

- [ ] **0.1** Docker Compose local đầy đủ: `api` (stub HealthCheck) + `db` (PostgreSQL) + `migrator` — `docker compose up` chạy được
- [ ] **0.2** `PayFlow.DbMigrator` kết nối DB thành công, chạy migration khống ban đầu
- [ ] **0.3** Biến môi trường: `.env.example` commit, `.env` git-ignored, không secret trong repo (deploy.md mục3)
- [ ] **0.4** Health check endpoint `/health` kiểm tra API + DB (deploy.md mục8)
- [ ] **0.5** GitHub Actions: job build `dotnet build` + `ng build` — fail = dừng pipeline
- [ ] **0.6** GitHub Actions: test gate thứ tự unit → integration (PostgreSQL service container) → fail = STOP (deploy.md mục4, conventions T6)
- [ ] **0.7** Hạ tầng test tích hợp: test base chạy với PostgreSQL thật (không InMemory — conventions T5/T6)
- [ ] **0.8** Angular skeleton theo `docs/ux.md`: design tokens [ĐỀ XUẤT - CẦN DUYỆT — cần duyệt trước hạng mục này], layout sidebar, shared badge 8 trạng thái
- [ ] **0.9** Màn hình Đăng nhập OIDC hoàn chỉnh theo ux.md mục3.1 (loading/error/success đủ)
- [ ] **0.10** GitHub Actions: docker build + push image theo tag git (deploy.md mục4)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **0.1** — Docker Compose stub `api` + `db` + `migrator`; chỉ cần container khởi động được, chưa cần migration thật.
- **0.2** — DbMigrator kết nối DB và chạy migration ban đầu; phụ thuộc 0.1.
- **0.3** — `.env.example` commit, `.env` git-ignored, không secret trong repo; gắn với deploy.md mục3.
- **0.4** — HealthCheck stub endpoint `/health` kiểm tra API + DB; public, dùng cho CI/orchestration.
- **0.5** — GitHub Actions job build `dotnet build` + `ng build`; fail = dừng pipeline.
- **0.6** — GitHub Actions test gate: unit → integration (PostgreSQL service container), fail = STOP; 의무 tích hợp PostgreSQL thật.
- **0.7** — Test base chạy với PostgreSQL thật, không InMemory; chuẩn bị sẵn cho integration test sau này.
- **0.8** — Angular skeleton: layout sidebar + shared badge 8 trạng thái theo `docs/ux.md`; design token phải được duyệt trước.
- **0.9** — Màn hình Đăng nhập OIDC theo `docs/ux.md` mục3.1: loading / error / success.
- **0.10** — GitHub Actions: docker build + push image theo tag git.

### Blocker / note

- Design token `[ĐỀ XUẤT - CẦN DUYỆT]` trong `docs/ux.md` phải được duyệt trước khi làm **0.8**.
- Nếu `docs/ux.md` chưa có pattern sidebar / badge rõ ràng, bổ sung `docs/ux.md` trước, ghi lý do vào `docs/decisions.md` nếu đáng kể.
- Hạ tầng auth/OIDC có thể cần stub hoặc cấu hình identity trước khi làm **0.9**; nếu chưa sẵn, ghi vào Deferred Work hoặc hỏi trước.
- Nếu `.env.example` chưa xác định đủ biến cho tất cả service, ghi placeholder rõ ràng và ghi chú bổ sung sau.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
