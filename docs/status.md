# Status — PayFlow Enterprise

> **Nguồn sự thật duy nhất về tiến độ dự án.** Tổng hợp từ `docs/prd.md` (FR/NFR/SM), `docs/domain-glossary.md` (tên), `docs/architecture.md` (module), `docs/ux.md` (màn hình/pattern), `docs/deploy.md` (hạ tầng/CI-CD/quy trình), `docs/conventions.md` (chuẩn test/review), `docs/decisions.md` (đã chốt DEC-001→005 + infra/UX chờ backfill).
>
> **Cập nhật sau MỖI prompt implement** — không phải cuối ngày hay cuối phase. Xem mục5.

---

## 1. Tổng quan phase

Thứ tự ưu tiên nền tảng trước: môi trường/CI-CD → tenancy/phân quyền (nền cho mọi FR còn lại) → Đề nghị thanh toán → Phê duyệt → Thực thi → Tra soát/Đối soát → Truy vết → Nghiệm thu. UI luôn là hạng mục riêng trong phase có tính năng user-facing (theo `docs/ux.md`), không gộp chung vào dòng backend.

**Chữ ký checkbox:** `- [ ]` = chưa xong. Tick `- [x]` **chỉ khi** hạng mục đã có unit + integration + e2e (API-level) test đều pass theo `docs/conventions.md` mục5 (T8). Code "chạy được" không đủ điều kiện tick.

---

## 2. Chi tiết từng phase

### Phase 0 — Môi trường phát triển & CI/CD ban đầu

**Mục tiêu:** dựng nền tảng dựng được trên máy sạch (SM-06) và có test gate tự động (FR-30) TRƯỚC khi code nghiệp vụ. Theo `docs/deploy.md` mục4.

**Liên quan:** NFR-06, FR-30, SM-06 (một phần).

- [x] (2026-10-13) Docker Compose local đầy đủ: `api` (stub HealthCheck) + `db` (PostgreSQL) + `migrator` — `docker compose up` chạy được
- [ ] `PayFlow.DbMigrator` kết nối DB thành công, chạy migration khống ban đầu
- [ ] Biến môi trường: `.env.example` commit, `.env` git-ignored, không secret trong repo (deploy.md mục3)
- [x] (2026-10-13) Health check endpoint `/health-status` kiểm tra API + DB (deploy.md mục8) — API trả 200 OK, DB healthy; endpoint `/health-status` được dùng thay vì `/health` theo cấu hình hiện có
- [ ] GitHub Actions: job build `dotnet build` + `ng build` — fail = dừng pipeline
- [ ] GitHub Actions: test gate thứ tự unit → integration (PostgreSQL service container) → fail = STOP (deploy.md mục4, conventions T6)
- [ ] Hạ tầng test tích hợp: test base chạy với PostgreSQL thật (không InMemory — conventions T5/T6)
- [ ] Angular skeleton theo `docs/ux.md`: design tokens [ĐỀ XUẤT - CẦN DUYỆT — cần duyệt trước hạng mục này], layout sidebar, shared badge 8 trạng thái
- [ ] Màn hình Đăng nhập OIDC hoàn chỉnh theo ux.md mục3.1 (loading/error/success đủ)
- [ ] GitHub Actions: docker build + push image theo tag git (deploy.md mục4)

---

### Phase 1 — Doanh nghiệp, Thành viên, Vai trò, Phân quyền & cấu hình nền

**Mục tiêu:** multi-tenancy hoạt động, phân quyền server-side đủ nền cho mọi phase sau; cô lập tenant được chứng minh bằng test (SM-02, NFR-02).

**Liên quan:** FR-01, FR-02, FR-03, FR-04, FR-05; NFR-02 (cô lập tenant, phân quyền).

- [ ] Entity `Tenant` + `PlatformAdmin` thao tác tạo/kích hoạt/vô hiệu hóa Doanh nghiệp (FR-01)
- [ ] API quản lý Doanh nghiệp, mọi bản ghi nghiệp vụ gắn `TenantId` (FR-01)
- [ ] Entity `Department` + API CRUD trong phạm vi Doanh nghiệp (FR-04)
- [ ] Entity `PaymentAccount` + API CRUD trong phạm vi Doanh nghiệp (FR-05)
- [ ] Cấu hình `Role`/`Permission` nền (chờ **OQ-06** chốt tên vai trò — blocker, xem mục6) (FR-02, FR-03)
- [ ] EF Core global query filter theo `TenantId` + test chứng minh không đọc/ghi chéo Doanh nghiệp (NFR-02, SM-02)
- [ ] Function authorization server-side cho mọi app service (FR-03, NFR-02)
- [ ] UI màn hình **Doanh nghiệp** (P6) theo ux.md mục3.9 — loading/empty/error/success đủ
- [ ] UI màn hình **Thành viên và Vai trò** (P5) theo ux.md mục3.8
- [ ] UI màn hình **Phòng ban** (P5), **Tài khoản thanh toán** (P5) theo ux.md mục3.8
- [ ] API security test tự động: gọi API bằng vai trò sai → 403; gọi theo ID Doanh nghiệp khác → 403/404 (FR-30, NFR-02)

---

### Phase 2 — Đề nghị thanh toán: CRUD & Trạng thái

**Mục tiêu:** vòng đời Đề nghị thanh toán đúng Ma trận chuyển trạng thái, audit ghi mọi thao tác; P1 dùng được end-to-end ở trạng thái Nháp→Chờ phê duyệt.

**Liên quan:** FR-07, FR-09, FR-10, FR-11, FR-12; FR-25 (phần ghi log thao tác); NFR-04 (Unit of Work, optimistic concurrency).

- [ ] Entity `PaymentRequest` + enum `PaymentRequestStatus` (8 trạng thái đúng tên code glossary) + `ConcurrencyStamp` (NFR-04)
- [ ] `StateTransitionMatrix` core + domain service chuyển trạng thái — vi phạm bị từ chối (FR-12) — **thiếu cạnh cụ thể chờ OQ-01** (blocker, mục6)
- [ ] API tạo `PaymentRequest` (trạng thái `Draft`) + ghi `AuditLog` (FR-07, FR-25)
- [ ] API gửi phê duyệt: `Draft` → `Pending Approval` (FR-08 phần trạng thái; phần xác định `ApprovalWorkflow` ở Phase 3)
- [ ] API cập nhật/hủy theo trạng thái hợp lệ; gọi sai trạng thái trả `PaymentRequests:InvalidStateTransition`/`PaymentRequests:CancelNotAllowed` (FR-09, FR-10, conventions mục4)
- [ ] API danh sách/chi tiết theo phạm vi vai trò + `Department` (FR-11)
- [ ] `SupportingDocument` upload + lưu blob (FR-07) — giới hạn dung lượng/định dạng chờ **OQ-08**
- [ ] UI **Đề nghị thanh toán — Tạo mới** (ux.md mục3.2): form Số tiền/Tài khoản trả/Tài khoản thụ hưởng/Chứng từ, đủ4 trạng thái
- [ ] UI **Đề nghị thanh toán — Danh sách** + **Chi tiết** (FR-11; ux.md mục2.1) — badge Trạng thái theo tokens centralized
- [ ] UI Chỉnh sửa + Hủy (dialog xác nhận, ux.md mục3.4) theo FR-09/FR-10
- [ ] Unit + integration + API test cho toàn bộ transition hợp lệ/bất hợp lệ (conventions T7, coverage ≥85% domain)

---

### Phase 3 — Quy trình phê duyệt nhiều cấp & Maker-Checker

**Mục tiêu:** phê duyệt nhiều cấp lần lượt, Maker-Checker enforced server-side, Lịch sử phê duyệt bất biến; nghiệm thu được FR-15 (điều kiện nghiệm thu chính).

**Liên quan:** FR-06, FR-08 (phần workflow), FR-13, FR-14, FR-15, FR-16, FR-17; NFR-02 (Maker-Checker).

- [ ] Entities `ApprovalWorkflow`, `ApprovalLevel`, `TransactionLimit`, `BusinessCondition` — cấu trúc chờ **OQ-06/OQ-07** (blocker, mục6) (FR-06)
- [ ] Logic xác định `ApprovalWorkflow` khi gửi Đề nghị theo `TransactionLimit`/`BusinessCondition` (FR-08)
- [ ] API Phê duyệt/Từ chối theo `ApprovalLevel` — cấp kế chỉ mở khi cấp trước `Approve` (FR-13) — lỗi `Approvals:LevelNotReady`
- [ ] Entity `ApprovalDecision` bất biến + `ApprovalHistory` (FR-14, FR-17)
- [ ] **Maker-Checker** chặn Người tạo tự Phê duyệt ở domain service + test gọi API trực tiếp (FR-15, NFR-02, conventions T7)
- [ ] Từ chối → trạng thái theo **OQ-01** (blocker) — giữ nguyên lịch sử cấp trước (FR-16)
- [ ] API Lịch sử phê duyệt trên chi tiết Đề nghị (FR-17)
- [ ] UI **Phê duyệt — Hàng chờ của tôi** (P2/P3, ux.md mục3.3): ngữ cảnh Số tiền vs Hạn mức giao dịch, Chứng từ inline, Maker-Checker tooltip
- [ ] UI **Cấu hình — Quy trình phê duyệt nhiều cấp**, **Hạn mức giao dịch**, **Điều kiện nghiệp vụ** (P5, ux.md mục3.8)
- [ ] Test: approve tuần tự nhiều cấp, gọi nhảy cấp bị chặn, Maker-Checker API-level (SM-02)

---

### Phase 4 — Thực thi thanh toán & Bank Gateway

**Mục tiêu:** Đề nghị `Approved` → Lệnh thanh toán chạy qua `Outbox` + `IdempotencyKey`, an toàn khi crash/retry (NFR-04: 0 mất,0 trùng).

**Liên quan:** FR-18, FR-19, FR-20, FR-21, FR-22, FR-24; NFR-04.

- [ ] `IBankGateway` abstraction + DI registration (FR-18, NFR-03)
- [ ] `MockBankGateway` nhận Lệnh, trả `GatewayResult` (FR-18, FR-20)
- [ ] Entity `PaymentOrder` + `IdempotencyKey` unique index (FR-19) — dùng chung enum `PaymentRequestStatus`, chờ **OQ-01** xác nhận (mục6)
- [ ] Bảng `Outbox` [KT] ghi cùng `IUnitOfWork` khi thực thi (FR-19, FR-22, NFR-04)
- [ ] `OutboxDispatchJob` (background): đọc Outbox, gửi qua `IBankGateway`, áp dụng `Retry` + backoff — **giá trị retry/timeout chờ OQ-03** (blocker, FR-22)
- [ ] Xử lý `GatewayResult`: `Processing` → `Completed` (kèm `TransactionId`) / `Failed` (kèm `ErrorCode`) (FR-20)
- [ ] `Timeout` → `Unknown`, **không** tự gửi lại; có cơ chế xác định lại trạng thái (FR-21) — `[CẦN LÀM RỎ OQ-03]`
- [ ] Điều khiển kịch bản lỗi Mock Bank Gateway cho demo (FR-24) — cơ chế chờ **OQ-09**
- [ ] UI **Lệnh thanh toán — Danh sách/Chi tiết** (P4, ux.md mục3.5): banner `Unknown`, chi tiết kỹ thuật `IdempotencyKey`/`Retry` chỉ P4 thấy
- [ ] Concurrency test: gửi trùng cùng `IdempotencyKey` không tạo Lệnh/Giao dịch mới; crash giữa chừng không mất Lệnh (FR-30, SM-03, conventions T7)

---

### Phase 5 — Tra soát & Đối soát

**Mục tiêu:** Treasury xử lý được Lệnh `Failed`/`Unknown`; đối chiếu file `SimulatedTransaction` với Lệnh, phát hiện `Matched`/`Discrepancy` (điều kiện nghiệm thu SM-01 phần cuối).

**Liên quan:** FR-23, FR-27, FR-28; NFR-05 (truy ngược kết quả).

- [ ] Thao tác `TransactionInvestigation` trên Lệnh `Failed`/`Unknown` — nội dung chờ **OQ-04** (blocker, FR-23)
- [ ] UI **Tra soát** (P4, ux.md mục3.6) đủ4 trạng thái
- [ ] Import file `SimulatedTransaction` (parse, validate) — định dạng chờ **OQ-08/OQ-05** (FR-27)
- [ ] Matching engine đối chiếu `SimulatedTransaction` ↔ `PaymentOrder` — tiêu chí chờ **OQ-05** (blocker, FR-27)
- [ ] Entity `ReconciliationResult` (`Matched`/`Discrepancy`) lưu kèm thời điểm + người thực hiện (FR-28)
- [ ] UI **Đối soát — Nhập file Giao dịch giả lập** + **Kết quả đối soát** (ux.md mục3.7): bộ lọc Khớp/Sai lệch, lý do sai lệch
- [ ] Traceability test: từ `ReconciliationResult` truy ngược Lệnh → Đề nghị → Người phê duyệt (NFR-05)

---

### Phase 6 — Truy vết, Nhật ký kiểm toán & Hiệu năng

**Mục tiêu:** FR-25/FR-26 đầy đủ, đạt ngưỡng NFR-01; chứng minh độ trễ theo load tham chiếu.

**Liên quan:** FR-25, FR-26; NFR-01, NFR-05.

- [ ] API `BusinessHistory` timeline cho một đối tượng (Đề nghị/Lệnh) (FR-26)
- [ ] UI tab **Lịch sử nghiệp vụ** + **Lịch sử phê duyệt** trên Chi tiết (ux.md mục2.1) — bất biến, không nút sửa/xóa
- [ ] UI màn hình **Nhật ký kiểm toán** (P6, ux.md mục3.10) — filter người/thời gian/loại đối tượng
- [ ] Test bất biến: không API nào sửa/xóa `AuditLog`/`ApprovalDecision` (FR-25, NFR-02)
- [ ] Index DB đầy đủ theo architecture mục5 (composite `(TenantId, Status)`...) + migration
- [ ] Đo hiệu năng load tham chiếu NFR-01 (50 người dùng đồng thời, ≥10.000 Đề nghị/Doanh nghiệp lớn nhất; P95 đọc ≤500ms, thao tác ≤1s — **số liệu chờ OQ-10 xác nhận**)
- [ ] AsNoTracking + pagination audit toàn bộ list endpoint (conventions B5)

---

### Phase 7 — Nghiệm thu & demo E2E

**Mục tiêu:** chạy trọn SM-01 trên môi trường sạch, mọi gates xanh, deploy staging đầu tiên theo `docs/deploy.md`.

**Liên quan:** SM-01, SM-02, SM-03, SM-04, SM-06; FR-30.

- [ ] Kịch bản demo chuẩn SM-01: tạo → phê duyệt nhiều cấp (Maker-Checker) → thực thi qua Mock Bank Gateway → đối soát — chạy sạch không can thiệp DB tay
- [ ] Gate coverage SM-04: 100% FR-01→FR-30 có ≥1 test; domain+Execution ≥85% (conventions T8)
- [ ] Bộ test SM-02 (cô lập tenant đầy đủ) + SM-03 (timeout/gửi trùng/Unknown hội tụ đúng) xanh100%
- [ ] Dựng máy sạch theo `docs/deploy.md` mục2: `docker compose up` + demo SM-01 ≤ [ĐỀ XUẤT: 30 phút — SM-06 chờ OQ-15]
- [ ] Backup/restore DB test theo deploy.md mục5 (migration reversible chứng minh)
- [ ] Deploy **staging** đầu tiên lên VPS theo deploy.md mục6 (chờ tên VPS/miền — mục6) + smoke test15 bước
- [ ] Rà lại Deferred Work (mục4): item nào còn treo trước release phải xử lý hoặc chấp nhận ghi rõ

---

## 3. Trạng thái hiện tại

| Hạng mục | Giá trị |
|---|---|
| **Phase đang làm** | Phase 0 — có hạng mục đầu tiên hoàn thành |
| **Hạng mục đã hoàn thành** | Docker Compose local (api + db + migrator), Health check endpoint `/health-status` |
| **Docs chain** | Đủ7/7 file (prd, domain-glossary, architecture, ux, deploy, conventions, status); glossary DEC-001→005 đã backfill |
| **Code nghiệp vụ** | Chưa có module nghiệp vụ nào; infrastructure Docker đã xong (dự án ABP template gốc ban đầu) |
| **Lần cập nhật cuối** | 2026-10-13 (Phase 0: Docker Compose + Health check checkbox tick) |

Agent mở conversation mới: **bắt đầu từ checkbox `- [ ]` đầu tiên của Phase 0**, đọc file liên quan (deploy.md cho hạ tầng, conventions.md trước khi code).

## 4. Deferred Work

| Việc bị hoãn | Hoãn từ | Lý do | Mốc quay lại |
|---|---|---|---|
| Backfill DEC-006→009 (VPS, best-effort availability, HTTPS+Caddy, GitHub Actions) vào `docs/decisions.md` | Task viết `docs/deploy.md` | Chờ người dùng xác nhận format/nội dung | **Trước khi bắt đầu Phase 0** |
| Duyệt design tokens baseline (8 chỗ `[ĐỀ XUẤT - CẦN DUYỆT]` trong ux.md) + VNĐ | Task viết `docs/ux.md` | Chờ người dùng duyệt | **Trước hạng mục Angular skeleton — Phase 0** |
| Trả lời OQ-01, OQ-03→OQ-10, OQ-13→OQ-15 rồi cập nhật định nghĩa glossary + architecture | Các task docs | Chờ người dùng trả lời; đã đánh dấu trong từng phase | Từng phase phụ thuộc (mục6) |
| Browser e2e (Playwright) | Conventions T8 | MVP demo qua API-level test (SM-01);1 dev/8 tuần | **Trước khi release — cần review lại** |
| Rate limiting/MFA chi tiết (OQ-12) | NFR-02 | Chờ chốt mức tối thiểu | Trước Phase7 (nghiệm thu bảo mật) |
| Dedicated schema/DB per Doanh nghiệp (đường mở rộng NFR-03) | Architecture mục7.2 | MVP dùng shared schema đã chốt | Khi số Doanh nghiệp tăng — **chưa xác định, cần review lại trước khi scale** |
| Distributed cache (Redis) thay in-memory | Architecture mục7.2 | MVP1 instance | Khi multi-instance — chưa xác định |
| Alerting email health-check (deploy.md mục8 [ĐỀ XUẤT]) | Task viết `docs/deploy.md` | Chờ người dùng duyệt | Trước Phase7 |

## 5. Quy tắc cập nhật file này

> **Sau khi hoàn thành bất kỳ hạng mục nào, phải tick checkbox tương ứng trong file này TRƯỚC KHI báo hoàn thành task cho người dùng. Nếu hạng mục chưa đủ test 3 tầng (unit/integration/e2e) thì không được tick, dù code đã chạy đúng. Nếu trong lúc làm phát sinh việc cần hoãn lại, phải thêm ngay vào Deferred Work (mục4), không được bỏ qua âm thầm. Nếu trong lúc làm phát sinh quyết định đáng ghi, phải thêm vào `docs/decisions.md` trước, rồi mới tick checklist ở đây.**

Kèm quy tắc phụ:

1. Tick `- [x]` ghi thêm ngày: `- [x] (2026-mm-dd)`.
2. Hạng mục bị blocker OQ → ghi `[BLOCKED: OQ-xx]` vào dòng checkbox, không tick, và thêm dòng ở mục6.
3. Hạng mục phát sinh giữa chừng (không có trong checklist) → thêm checkbox vào phase phù hợp TRƯỚC khi làm.
4. Đổi thứ tự phase cần ghi `docs/decisions.md` (ảnh hưởng lộ trình).

## 6. Blocker / Risk log

Chỗ agent ghi vướng mắc cần **người dùng quyết định** — không tự quyết rồi im lặng. Ghi: ngày, blocker, phase/hạng mục ảnh hưởng, cần quyết định gì.

| Ngày | Blocker | Ảnh hưởng | Cần gì |
|---|---|---|---|
| 2026-10-12 | OQ-01 (ma trận chuyển trạng thái đầy đủ + trạng thái Lệnh) | Phase2 (StateTransitionMatrix), Phase3 (Từ chối), Phase4 (`PaymentOrder` enum) | Người dùng trả lời OQ-01 trong `docs/prd.md` |
| 2026-10-12 | OQ-06/OQ-07 (tên vai trò + ma trận quyền; định nghĩa Hạn mức/cấp phê duyệt) | Phase1 (cấu hình vai trò), Phase3 (engine workflow) | Trả lời OQ-06, OQ-07 |
| 2026-10-12 | OQ-08 (lưu Chứng từ) | Phase2 (upload) | Trả lời OQ-08 |
| 2026-10-12 | OQ-03 (timeout/retry/xác định lại Unknown) | Phase4 (dispatch job) | Trả lời OQ-03 |
| 2026-10-12 | OQ-09 (cách gây lỗi Mock Bank Gateway) | Phase4 (demo lỗi SM-01/SM-03) | Trả lời OQ-09 |
| 2026-10-12 | OQ-04/OQ-05 (Tra soát thao tác; tiêu chí khớp) | Phase5 | Trả lời OQ-04, OQ-05 |
| 2026-10-12 | OQ-10/OQ-15 (số liệu hiệu năng; ngưỡng setup) | Phase6, Phase7 | Xác nhận số liệu |
| 2026-10-12 | Tên VPS/miền/staging config | Phase7 (deploy staging) | Người dùng cung cấp khi tới phase |
