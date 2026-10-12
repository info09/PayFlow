# Story — Phase 1 — Doanh nghiệp, Thành viên, Vai trò, Phân quyền & cấu hình nền

> Phase 1 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** multi-tenancy hoạt động, phân quyền server-side đủ nền cho mọi phase sau; cô lập tenant được chứng minh bằng test (SM-02, NFR-02).

**Liên quan:** FR-01, FR-02, FR-03, FR-04, FR-05; NFR-02 (cô lập tenant, phân quyền).

## Checklist

- [ ] **1.1** Entity `Tenant` + `PlatformAdmin` thao tác tạo/kích hoạt/vô hiệu hóa Doanh nghiệp (FR-01)
- [ ] **1.2** API quản lý Doanh nghiệp, mọi bản ghi nghiệp vụ gắn `TenantId` (FR-01)
- [ ] **1.3** Entity `Department` + API CRUD trong phạm vi Doanh nghiệp (FR-04)
- [ ] **1.4** Entity `PaymentAccount` + API CRUD trong phạm vi Doanh nghiệp (FR-05)
- [ ] **1.5** Cấu hình `Role`/`Permission` nền (chờ **OQ-06** chốt tên vai trò — blocker, xem mục6) (FR-02, FR-03)
- [ ] **1.6** EF Core global query filter theo `TenantId` + test chứng minh không đọc/ghi chéo Doanh nghiệp (NFR-02, SM-02)
- [ ] **1.7** Function authorization server-side cho mọi app service (FR-03, NFR-02)
- [ ] **1.8** UI màn hình **Doanh nghiệp** (P6) theo ux.md mục3.9 — loading/empty/error/success đủ
- [ ] **1.9** UI màn hình **Thành viên và Vai trò** (P5) theo ux.md mục3.8
- [ ] **1.10** UI màn hình **Phòng ban** (P5), **Tài khoản thanh toán** (P5) theo ux.md mục3.8
- [ ] **1.11** API security test tự động: gọi API bằng vai trò sai → 403; gọi theo ID Doanh nghiệp khác → 403/404 (FR-30, NFR-02)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **1.1** — Entity `Tenant` + thao tác tạo/kích hoạt/vô hiệu hóa Doanh nghiệp + API quản lý gắn `TenantId`.
- **1.2** — API quản lý Doanh nghiệp: mọi bản ghi nghiệp vụ gắn `TenantId`; chống truy cập chéo tenant.
- **1.3** — Entity `Department` + API CRUD trong phạm vi Doanh nghiệp.
- **1.4** — Entity `PaymentAccount` + API CRUD trong phạm vi Doanh nghiệp.
- **1.5** — Cấu hình `Role`/`Permission` nền; chờ OQ-06 chốt tên vai trò trước khi code chi tiết.
- **1.6** — EF Core global query filter theo `TenantId`, có test chứng minh không đọc/ghi chéo Doanh nghiệp.
- **1.7** — Function authorization server-side cho mọi app service.
- **1.8** — UI màn hình **Doanh nghiệp** (P6) theo `docs/ux.md` mục 3.9.
- **1.9** — UI màn hình **Thành viên và Vai trò** (P5) theo `docs/ux.md` mục 3.8.
- **1.10** — UI màn hình **Phòng ban** và **Tài khoản thanh toán** (P5) theo `docs/ux.md` mục 3.8.
- **1.11** — API security test tự động: vai trò sai → 403, ID Doanh nghiệp khác → 403/404.

### Blocker / note

- **1.5** bị chặn bởi **OQ-06** (chốt tên vai trò + ma trận quyền) — xem `docs/status.md` mục6.
- UI các màn hình **1.8/1.9/1.10** phải khớp với `docs/ux.md` mục 3.8/3.9; nếu thiếu pattern, bổ sung `docs/ux.md` trước.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
