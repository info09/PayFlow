# Story — Phase 2 — Đề nghị thanh toán: CRUD & Trạng thái

> Phase 2 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** vòng đời Đề nghị thanh toán đúng Ma trận chuyển trạng thái, audit ghi mọi thao tác; P1 dùng được end-to-end ở trạng thái Nháp→Chờ phê duyệt.

**Liên quan:** FR-07, FR-09, FR-10, FR-11, FR-12; FR-25 (phần ghi log thao tác); NFR-04 (Unit of Work, optimistic concurrency).

## Checklist

- [ ] **2.1** Entity `PaymentRequest` + enum `PaymentRequestStatus` (8 trạng thái đúng tên code glossary) + `ConcurrencyStamp` (NFR-04)
- [ ] **2.2** `StateTransitionMatrix` core + domain service chuyển trạng thái — vi phạm bị từ chối (FR-12) — **thiếu cạnh cụ thể chờ OQ-01** (blocker, mục6)
- [ ] **2.3** API tạo `PaymentRequest` (trạng thái `Draft`) + ghi `AuditLog` (FR-07, FR-25)
- [ ] **2.4** API gửi phê duyệt: `Draft` → `Pending Approval` (FR-08 phần trạng thái; phần xác định `ApprovalWorkflow` ở Phase 3)
- [ ] **2.5** API cập nhật/hủy theo trạng thái hợp lệ; gọi sai trạng thái trả `PaymentRequests:InvalidStateTransition`/`PaymentRequests:CancelNotAllowed` (FR-09, FR-10, conventions mục4)
- [ ] **2.6** API danh sách/chi tiết theo phạm vi vai trò + `Department` (FR-11)
- [ ] **2.7** `SupportingDocument` upload + lưu blob (FR-07) — giới hạn dung lượng/định dạng chờ **OQ-08**
- [ ] **2.8** UI **Đề nghị thanh toán — Tạo mới** (ux.md mục3.2): form Số tiền/Tài khoản trả/Tài khoản thụ hưởng/Chứng từ, đủ4 trạng thái
- [ ] **2.9** UI **Đề nghị thanh toán — Danh sách** + **Chi tiết** (FR-11; ux.md mục2.1) — badge Trạng thái theo tokens centralized
- [ ] **2.10** UI Chỉnh sửa + Hủy (dialog xác nhận, ux.md mục3.4) theo FR-09/FR-10
- [ ] **2.11** Unit + integration + API test cho toàn bộ transition hợp lệ/bất hợp lệ (conventions T7, coverage ≥85% domain)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **2.1** — Entity `PaymentRequest` + enum `PaymentRequestStatus` (8 trạng thái) + `ConcurrencyStamp`.
- **2.2** — `StateTransitionMatrix` + domain service chuyển trạng thái; chờ OQ-01 để có cạnh cụ thể.
- **2.3** — API tạo `PaymentRequest` (Draft) + ghi `AuditLog`.
- **2.4** — API gửi phê duyệt: Draft → Pending Approval; xác định workflow cụ thể ở Phase 3.
- **2.5** — API cập nhật/hủy theo trạng thái hợp lệ; lỗi khi gọi sai trạng thái.
- **2.6** — API danh sách/chi tiết theo phạm vi vai trò + `Department`.
- **2.7** — `SupportingDocument` upload + lưu blob; chờ OQ-08 về giới hạn/định dạng.
- **2.8** — UI tạo mới theo `docs/ux.md` mục 3.2: form tiền/ tài khoản trả/ thụ hưởng/ chứng từ.
- **2.9** — UI danh sách + chi tiết theo `docs/ux.md` mục 2.1, badge trạng thái centralized.
- **2.10** — UI chỉnh sửa + hủy với dialog xác nhận.
- **2.11** — Test transition hợp lệ/bất hợp lệ (unit/integration/API).

### Blocker / note

- **2.2** chờ **OQ-01** (ma trận chuyển trạng thái đầy đủ) — xem `docs/status.md` mục6.
- **2.7** chờ **OQ-08** (lưu Chứng từ) — xem `docs/status.md` mục6.
- UI phải tuân theo `docs/ux.md` mục 2.1 / 3.2 / 3.4; nếu thiếu pattern, bổ sung trước.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
