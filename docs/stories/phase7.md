# Story — Phase 7 — Nghiệm thu & demo E2E

> Phase 7 từ `docs/status.md` · nguồn sự thật: `docs/status.md`. Nếu `docs/status.md` được cập nhật, file này phải được đồng bộ lại (xóa rồi tạo lại hoặc chỉnh từng mục) — không chỉnh sửa nhằm che giấu sự khác biệt.

**Mục tiêu:** chạy trọn SM-01 trên môi trường sạch, mọi gates xanh, deploy staging đầu tiên theo `docs/deploy.md`.

**Liên quan:** SM-01, SM-02, SM-03, SM-04, SM-06; FR-30.

## Checklist

- [ ] **7.1** Kịch bản demo chuẩn SM-01: tạo → phê duyệt nhiều cấp (Maker-Checker) → thực thi qua Mock Bank Gateway → đối soát — chạy sạch không can thiệp DB tay
- [ ] **7.2** Gate coverage SM-04: 100% FR-01→FR-30 có ≥1 test; domain+Execution ≥85% (conventions T8)
- [ ] **7.3** Bộ test SM-02 (cô lập tenant đầy đủ) + SM-03 (timeout/gửi trùng/Unknown hội tụ đúng) xanh100%
- [ ] **7.4** Dựng máy sạch theo `docs/deploy.md` mục2: `docker compose up` + demo SM-01 ≤ [ĐỀ XUẤT: 30 phút — SM-06 chờ OQ-15]
- [ ] **7.5** Backup/restore DB test theo deploy.md mục5 (migration reversible chứng minh)
- [ ] **7.6** Deploy **staging** đầu tiên lên VPS theo deploy.md mục6 (chờ tên VPS/miền — mục6) + smoke test15 bước
- [ ] **7.7** Rà lại Deferred Work (mục4): item nào còn treo trước release phải xử lý hoặc chấp nhận ghi rõ

### Phân tách task nhỏ (tham chiếu nội bộ)

- **7.1** — Chạy kịch bản demo SM-01 trọn vòng.
- **7.2** — Đảm bảo coverage SM-04 và ngưỡng domain/execution test.
- **7.3** — Chạy bộ test SM-02 + SM-03, đảm bảo xanh.
- **7.4** — Dựng máy sạch theo `docs/deploy.md` mục2.
- **7.5** — Backup/restore DB test; chứng minh migration reversible.
- **7.6** — Deploy staging đầu tiên theo `docs/deploy.md` mục6; smoke test.
- **7.7** — Rà lại Deferred Work trước release.

### Blocker / note

- **7.6** chờ **tên VPS/miền + config staging** — xem `docs/status.md` mục6.
- **7.4** có đề xuất SM-06 chờ **OQ-15** — xem `docs/status.md` mục6.
- Deploy staging không tự chạy khi chưa có xác nhận rõ từ người dùng trong phiên.

> Kết nối lại với `docs/status.md` mục6 để biết blocker chờ người dùng quyết định trong phase này.
