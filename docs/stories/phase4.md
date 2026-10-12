# Story — Phase 4 — Thực thi thanh toán & Bank Gateway

> Phase 4 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** Đề nghị `Approved` → Lệnh thanh toán chạy qua `Outbox` + `IdempotencyKey`, an toàn khi crash/retry (NFR-04: 0 mất,0 trùng).

**Liên quan:** FR-18, FR-19, FR-20, FR-21, FR-22, FR-24; NFR-04.

## Checklist

- [ ] **4.1** `IBankGateway` abstraction + DI registration (FR-18, NFR-03)
- [ ] **4.2** `MockBankGateway` nhận Lệnh, trả `GatewayResult` (FR-18, FR-20)
- [ ] **4.3** Entity `PaymentOrder` + `IdempotencyKey` unique index (FR-19) — dùng chung enum `PaymentRequestStatus`, chờ **OQ-01** xác nhận (mục6)
- [ ] **4.4** Bảng `Outbox` [KT] ghi cùng `IUnitOfWork` khi thực thi (FR-19, FR-22, NFR-04)
- [ ] **4.5** `OutboxDispatchJob` (background): đọc Outbox, gửi qua `IBankGateway`, áp dụng `Retry` + backoff — **giá trị retry/timeout chờ OQ-03** (blocker, FR-22)
- [ ] **4.6** Xử lý `GatewayResult`: `Processing` → `Completed` (kèm `TransactionId`) / `Failed` (kèm `ErrorCode`) (FR-20)
- [ ] **4.7** `Timeout` → `Unknown`, **không** tự gửi lại; có cơ chế xác định lại trạng thái (FR-21) — `[CẦN LÀM RỎ OQ-03]`
- [ ] **4.8** Điều khiển kịch bản lỗi Mock Bank Gateway cho demo (FR-24) — cơ chế chờ **OQ-09**
- [ ] **4.9** UI **Lệnh thanh toán — Danh sách/Chi tiết** (P4, ux.md mục3.5): banner `Unknown`, chi tiết kỹ thuật `IdempotencyKey`/`Retry` chỉ P4 thấy
- [ ] **4.10** Concurrency test: gửi trùng cùng `IdempotencyKey` không tạo Lệnh/Giao dịch mới; crash giữa chừng không mất Lệnh (FR-30, SM-03, conventions T7)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **4.1** — Khai báo `IBankGateway` + đăng ký DI.
- **4.2** — Mô phỏng `MockBankGateway` nhận lệnh và trả `GatewayResult`.
- **4.3** — Entity `PaymentOrder` + `IdempotencyKey` unique index; chờ OQ-01 xác nhận enum dùng chung.
- **4.4** — Bảng `Outbox`, ghi cùng `IUnitOfWork` khi thực thi.
- **4.5** — `OutboxDispatchJob` đọc outbox, gửi qua `IBankGateway`, retry + backoff; chờ OQ-03 về retry/timeout.
- **4.6** — Xử lý kết quả gateway: Processing → Completed/Failed.
- **4.7** — Timeout → Unknown, không tự gửi lại; chuẩn bị cơ chế xác định lại trạng thái.
- **4.8** — Cơ chế điều khiển lỗi Mock Bank Gateway cho demo; chờ OQ-09.
- **4.9** — UI danh sách/chi tiết Lệnh thanh toán theo `docs/ux.md` mục 3.5.
- **4.10** — Concurrency test: idempotency, crash-safe.

### Blocker / note

- **4.3** và **4.5** liên quan trực tiếp đến **OQ-01** và **OQ-03** — xem `docs/status.md` mục6.
- **4.8** chờ **OQ-09** (cách gây lỗi Mock Bank Gateway) — xem `docs/status.md` mục6.
- UI **4.9** phải khớp với `docs/ux.md` mục 3.5; chỉ P4 thấy chi tiết kỹ thuật.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
