# Story — Phase 6 — Truy vết, Nhật ký kiểm toán & Hiệu năng

> Phase 6 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** FR-25/FR-26 đầy đủ, đạt ngưỡng NFR-01; chứng minh độ trễ theo load tham chiếu.

**Liên quan:** FR-25, FR-26; NFR-01, NFR-05.

## Checklist

- [ ] **6.1** API `BusinessHistory` timeline cho một đối tượng (Đề nghị/Lệnh) (FR-26)
- [ ] **6.2** UI tab **Lịch sử nghiệp vụ** + **Lịch sử phê duyệt** trên Chi tiết (ux.md mục2.1) — bất biến, không nút sửa/xóa
- [ ] **6.3** UI màn hình **Nhật ký kiểm toán** (P6, ux.md mục3.10) — filter người/thời gian/loại đối tượng
- [ ] **6.4** Test bất biến: không API nào sửa/xóa `AuditLog`/`ApprovalDecision` (FR-25, NFR-02)
- [ ] **6.5** Index DB đầy đủ theo architecture mục5 (composite `(TenantId, Status)`...) + migration
- [ ] **6.6** Đo hiệu năng load tham chiếu NFR-01 (50 người dùng đồng thời, ≥10.000 Đề nghị/Doanh nghiệp lớn nhất; P95 đọc ≤500ms, thao tác ≤1s — **số liệu chờ OQ-10 xác nhận**)
- [ ] **6.7** AsNoTracking + pagination audit toàn bộ list endpoint (conventions B5)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **6.1** — API timeline `BusinessHistory` cho Đề nghị/Lệnh.
- **6.2** — UI tab lịch sử nghiệp vụ + lịch sử phê duyệt trên chi tiết; bất biến.
- **6.3** — UI Nhật ký kiểm toán theo `docs/ux.md` mục 3.10.
- **6.4** — Test bất biến audit/approval log.
- **6.5** — Tạo index DB + migration theo architecture.md mục5.
- **6.6** — Đo hiệu năng theo NFR-01; số liệu chờ OQ-10.
- **6.7** — Áp dụng AsNoTracking + pagination cho list endpoint.

### Blocker / note

- **6.6** chờ **OQ-10** (số liệu hiệu năng) — xem `docs/status.md` mục6.
- UI **6.2/6.3** phải khớp với `docs/ux.md` mục 2.1 / 3.10.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
