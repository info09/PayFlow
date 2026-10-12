# Story — Phase 5 — Tra soát & Đối soát

> Phase 5 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** Treasury xử lý được Lệnh `Failed`/`Unknown`; đối chiếu file `SimulatedTransaction` với Lệnh, phát hiện `Matched`/`Discrepancy` (điều kiện nghiệm thu SM-01 phần cuối).

**Liên quan:** FR-23, FR-27, FR-28; NFR-05 (truy ngược kết quả).

## Checklist

- [ ] **5.1** Thao tác `TransactionInvestigation` trên Lệnh `Failed`/`Unknown` — nội dung chờ **OQ-04** (blocker, FR-23)
- [ ] **5.2** UI **Tra soát** (P4, ux.md mục3.6) đủ4 trạng thái
- [ ] **5.3** Import file `SimulatedTransaction` (parse, validate) — định dạng chờ **OQ-08/OQ-05** (FR-27)
- [ ] **5.4** Matching engine đối chiếu `SimulatedTransaction` ↔ `PaymentOrder` — tiêu chí chờ **OQ-05** (blocker, FR-27)
- [ ] **5.5** Entity `ReconciliationResult` (`Matched`/`Discrepancy`) lưu kèm thời điểm + người thực hiện (FR-28)
- [ ] **5.6** UI **Đối soát — Nhập file Giao dịch giả lập** + **Kết quả đối soát** (ux.md mục3.7): bộ lọc Khớp/Sai lệch, lý do sai lệch
- [ ] **5.7** Traceability test: từ `ReconciliationResult` truy ngược Lệnh → Đề nghị → Người phê duyệt (NFR-05)

### Phân tách task nhỏ (tham chiếu nội bộ)

- **5.1** — Thao tác investigation trên Lệnh Failed/Unknown; nội dung chờ OQ-04.
- **5.2** — UI Tra soát theo `docs/ux.md` mục 3.6.
- **5.3** — Import + parse/validate file SimulatedTransaction; định dạng chờ OQ-08/OQ-05.
- **5.4** — Matching engine đối chiếu SimulatedTransaction ↔ PaymentOrder; tiêu chí chờ OQ-05.
- **5.5** — Entity `ReconciliationResult` lưu kết quả + thời điểm + người thực hiện.
- **5.6** — UI Đối soát theo `docs/ux.md` mục 3.7.
- **5.7** — Test truy ngược từ ReconciliationResult → Lệnh → Đề nghị → Người phê duyệt.

### Blocker / note

- **5.1** chờ **OQ-04** (Tra soát thao tác) — xem `docs/status.md` mục6.
- **5.3/5.4** chờ **OQ-05/OQ-08** (tiêu chí khớp + định dạng file) — xem `docs/status.md` mục6.
- UI **5.2/5.6** phải khớp với `docs/ux.md` mục 3.6 / 3.7.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
