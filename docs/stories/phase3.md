# Story — Phase 3 — Quy trình phê duyệt nhiều cấp & Maker-Checker

> Phase 3 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** phê duyệt nhiều cấp lần lượt, Maker-Checker enforced server-side, Lịch sử phê duyệt bất biến; nghiệm thu được FR-15 (điều kiện nghiệm thu chính).

**Liên quan:** FR-06, FR-08 (phần workflow), FR-13, FR-14, FR-15, FR-16, FR-17; NFR-02 (Maker-Checker).

## Checklist

- [ ] **3.1** Entities `ApprovalWorkflow`, `ApprovalLevel`, `TransactionLimit`, `BusinessCondition` — cấu trúc chờ **OQ-06/OQ-07** (blocker, mục6) (FR-06)
- [ ] **3.2** Logic xác định `ApprovalWorkflow` khi gửi Đề nghị theo `TransactionLimit`/`BusinessCondition` (FR-08)
- [ ] **3.3** API Phê duyệt/Từ chối theo `ApprovalLevel` — cấp kế chỉ mở khi cấp trước `Approve` (FR-13) — lỗi `Approvals:LevelNotReady`
- [ ] **3.4** Entity `ApprovalDecision` bất biến + `ApprovalHistory` (FR-14, FR-17)
- [ ] **3.5** **Maker-Checker** chặn Người tạo tự Phê duyệt ở domain service + test gọi API trực tiếp (FR-15, NFR-02, conventions T7)
- [ ] **3.6** Từ chối → trạng thái theo **OQ-01** (blocker) — giữ nguyên lịch sử cấp trước (FR-16)
- [ ] **3.7** API Lịch sử phê duyệt trên chi tiết Đề nghị (FR-17)
- [ ] **3.8** UI **Phê duyệt — Hàng chờ của tôi** (P2/P3, ux.md mục3.3): ngữ cảnh Số tiền vs Hạn mức giao dịch, Chứng từ inline, Maker-Checker tooltip
- [ ] **3.9** UI **Cấu hình — Quy trình phê duyệt nhiều cấp**, **Hạn mức giao dịch**, **Điều kiện nghiệp vụ** (P5, ux.md mục3.8)
- [ ] **3.10** Test: approve tuần tự nhiều cấp, gọi nhảy cấp bị chặn, Maker-Checker API-level (SM-02)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **3.1** — Khai báo entities `ApprovalWorkflow`, `ApprovalLevel`, `TransactionLimit`, `BusinessCondition`; chờ OQ-06/OQ-07.
- **3.2** — Xác định workflow phê duyệt khi gửi Đề nghị theo hạn mức/điều kiện.
- **3.3** — API phê duyệt/từ chối theo cấp; chặn nhảy cấp; lỗi `Approvals:LevelNotReady`.
- **3.4** — Lưu `ApprovalDecision` + `ApprovalHistory` bất biến.
- **3.5** — Maker-Checker chặn người tạo tự phê duyệt; test API-level.
- **3.6** — Xử lý từ chối theo OQ-01; giữ nguyên lịch sử cấp trước.
- **3.7** — API lịch sử phê duyệt trên chi tiết Đề nghị.
- **3.8** — UI hàng chờ phê duyệt (P2/P3) theo `docs/ux.md` mục 3.3.
- **3.9** — UI cấu hình quy trình phê duyệt / hạn mức / điều kiện nghiệp vụ theo `docs/ux.md` mục 3.8.
- **3.10** — Test approve nhiều cấp, nhảy cấp, Maker-Checker.

### Blocker / note

- **3.1** chờ **OQ-06/OQ-07** (tên vai trò + ma trận quyền; hạn mức/cấp phê duyệt) — xem `docs/status.md` mục6.
- **3.6** chờ **OQ-01** (trạng thái sau từ chối) — xem `docs/status.md` mục6.
- UI phần **3.8/3.9** phải khớp với `docs/ux.md` mục 3.3 / 3.8.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
