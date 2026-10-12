# Decision Log — PayFlow Enterprise

## 1. Mục đích file

File này là **nhật ký quyết định (decision log)** của dự án: nơi ghi lại *tại sao lúc đó lại chọn hướng X*, để người (kể cả người ra quyết định) quay lại sau vài tháng vẫn tra được lý do.

- **KHÔNG** dùng để mô tả trạng thái hiện tại của dự án (đó là việc của `docs/status.md`).
- **KHÔNG** dùng để mô tả kiến trúc hoạt động thế nào (đó là việc của `docs/architecture.md`) — ở đây chỉ ghi *lý do chọn* kiến trúc đó.
- **KHÔNG** dùng để định nghĩa thuật ngữ (đó là việc của `docs/domain-glossary.md`) — nhưng quyết định chọn tên cho thuật ngữ mới (theo quy tắc mục 4 của glossary) ghi tại đây.

## 2. Quy tắc khi thêm 1 quyết định mới

Mỗi quyết định là **1 heading con riêng** trong mục Log (bên dưới), đánh mã tăng dần ổn định dạng `DEC-xxx` (001, 002, …) — mã này là mã tham chiếu vĩnh viễn để các file khác link tới, **không được đổi hoặc tái sử dụng**. Ngày ghi theo `YYYY-MM-DD`.

Format bắt buộc cho mỗi entry:

```markdown
## DEC-xxx — Tiêu đề ngắn gọn của quyết định

- **Ngày:** YYYY-MM-DD
- **Trạng thái:** Active

### Bối cảnh (Context)
Vấn đề gì cần quyết định, tại sao phải quyết định ngay, ràng buộc gì đang ép buộc.

### Các lựa chọn đã xem xét (Options considered)
- **Lựa chọn A (chọn):** mô tả ngắn.
- **Lựa chọn B:** mô tả ngắn — vì sao bị loại.
- **Lựa chọn C:** … — vì sao bị loại.

### Quyết định (Decision)
Chọn cái gì — 1 câu rõ ràng, không hedge.

### Lý do (Rationale)
Vì sao chọn hướng này; gắn với NFR/FR/ràng buộc cụ thể trong `docs/prd.md` (dùng mã FR-xx/NFR-xx) hoặc `docs/architecture.md` nếu có.

### Đánh đổi / hệ quả (Trade-off)
Cái gì bị mất, rủi ro gì được chấp nhận, việc gì sẽ phải làm lại nếu quyết định sai.
```

Quy tắc kèm theo:

1. **Ghi ngay lúc quyết định** — không ghi lại từ trí nhớ vài tháng sau; nếu muộn, ghi thêm ghi chú "ghi muộn" trong Context.
2. Khi một quyết định cũ bị thay thế: **KHÔNG xóa entry cũ** — đổi `Trạng thái` thành `Superseded by [DEC-yyy](#dec-yyy)` và tạo entry mới.
3. Entry mới phải tra được quan hệ với tài liệu khác: trích mã FR/NFR khi rationale bám PRD; trích mã DEC khi quyết định phụ thuộc quyết định trước.
4. Quyết định chọn tên cho thuật ngữ nghiệp vụ mới (theo `docs/domain-glossary.md` mục 4) cũng ghi vào đây theo format trên, với Quyết định nêu rõ tên được chọn và các tên bị loại.

## 3. Ngưỡng khi nào PHẢI ghi vào đây

**PHẢI ghi** (ảnh hưởng người khác hoặc khó đảo ngược):

- Chọn công nghệ / thư viện chính (ORM, message broker, job scheduler, package ngoài…).
- Đổi kiến trúc hoặc ranh giới module (thêm/bỏ module, đổi cách tổ chức tầng, đổi chiến lược multi-tenancy…).
- Đổi convention đã thống nhất (`conventions.md`, tên thuật ngữ trong `domain-glossary.md`).
- Chọn giải pháp cho một vấn đề có nhiều cách làm hợp lý (ví dụ: cách xử lý Unknown state, cơ chế retry/outbox, chiến lược lưu chứng từ).
- Bỏ qua một best practice vì lý do thực tế (ví dụ: không viết test cho đoạn nào đó, chấp nhận debt có chủ đích) — kèm lý do và điều kiện quay lại.
- Trả lời các Open Question (OQ-xx) của `docs/prd.md` khi câu trả lời đó định hình design.

**KHÔNG cần ghi** (quyết định cấp độ file/lớp, không ảnh hưởng người khác):

- Tên biến, tên hàm, tên file, format code, sắp xếp using.
- Cách triển khai chi tiết trong một hàm/lớp khi không đổi giao diện với phần còn lại.
- Chọn giữa các hướng đã được `conventions.md` hoặc entry DEC đã có quy định sẵn — chỉ cần làm theo.

## 4. Log

### DEC-001 — Thuật ngữ chuẩn cho thực thể chính: “Đề nghị thanh toán” / `PaymentRequest`

- **Ngày:** 2026-10-12
- **Trạng thái:** Active

#### Bối cảnh (Context)

Trong `docs/prd.md`, cùng một thực thể (payment request) bị gọi bằng 2 tên: “đề nghị thanh toán” (title, scope, hầu hết FR) và “yêu cầu” (Context “thất lạc yêu cầu”, persona P2 “phê duyệt yêu cầu”, Scope “tự phê duyệt yêu cầu của mình”). Cần 1 tên duy nhất trước khi viết bất kỳ code/UI nào.

#### Các lựa chọn đã xem xét (Options considered)

- **“Đề nghị thanh toán” (chọn):** tên chiếm ưu thế tuyệt đối trong PRD (title dự án, Scope, FR-07→FR-12); giữ nguyên toàn bộ FR không phải sửa.
- **“Yêu cầu thanh toán” (loại):** ngắn hơn khi hiển thị nhưng phải sửa cách gọi ở đa số FR; hai tên gần nghĩa từng dùng xen kẽ là nguồn gốc gây nhầm lẫn.

#### Quyết định (Decision)

Chốt tên chuẩn là **“Đề nghị thanh toán” / `PaymentRequest`**; từ “yêu cầu” **bị cấm** dùng để chỉ thực thể này (chỉ giữ nghĩa HTTP request / hành động chung).

#### Lý do (Rationale)

Ubiquitous language yêu cầu 1 khái niệm — 1 tên (`docs/domain-glossary.md` mục 1); đổi sang tên khác sẽ phải sửa gần như toàn bộ FR trong `docs/prd.md` (FR-07–FR-12, FR-15).

#### Đánh đổi / hệ quả (Trade-off)

Phải sửa 3 chỗ dùng “yêu cầu” còn sót trong PRD và cả trong file này khi trích dẫn; chấp nhận tên dài hơn một chút trong UI.

### DEC-002 — Persona P2: “Trưởng phòng” / `DepartmentManager`

- **Ngày:** 2026-10-12
- **Trạng thái:** Active

#### Bối cảnh (Context)

Persona P2 trong PRD có 2 tên xấp xỉ: “Trưởng phòng” và “Quản lý bộ phận” — cần 1 tên hiển thị chuẩn cho vai trò người phê duyệt cấp bộ phận.

#### Các lựa chọn đã xem xét (Options considered)

- **“Trưởng phòng” (chọn):** chức danh cụ thể, quen thuộc trong doanh nghiệp Việt Nam, liên kết trực tiếp với thực thể “Phòng ban”.
- **“Quản lý bộ phận” (loại):** chung hơn (phòng ban chưa nhất thiết là “phòng”) nhưng mơ hồ về vị trí trong chuỗi phê duyệt và đụng từ “bộ phận” vốn bị cấm làm đồng nghĩa của “Phòng ban”.

#### Quyết định (Decision)

Chốt tên chuẩn là **“Trưởng phòng” / `DepartmentManager`**; “Quản lý bộ phận” và “bộ phận” bị cấm dùng thay thế.

#### Lý do (Rationale)

Gắn được persona với FR-04 (Phòng ban) và FR-13 (Cấp phê duyệt) của `docs/prd.md`; 1 tên duy nhất cho persona (`docs/domain-glossary.md` mục 3.1).

#### Đánh đổi / hệ quả (Trade-off)

Tên hẹp hơn thực tế: doanh nghiệp có thể có “Trưởng bộ phận” không gọi là “phòng” — khi đó hiển thị vẫn dùng “Trưởng phòng” cho nhất quán.

### DEC-003 — Persona P3: “Giám đốc tài chính (CFO)” / `CFO`

- **Ngày:** 2026-10-12
- **Trạng thái:** Active

#### Bối cảnh (Context)

Persona P3 trong PRD được 2 cách gọi: “CFO” và “Người có thẩm quyền”. “Người có thẩm quyền” mô tả phạm vi (ai phê duyệt theo hạn mức) chứ không phải chức danh.

#### Các lựa chọn đã xem xét (Options considered)

- **“Giám đốc tài chính (CFO)” (chọn):** chức danh cụ thể, ánh xạ 1-1 với thực thể Hạn mức giao dịch / cấp thẩm quyền cao nhất trong quy trình.
- **“Người có thẩm quyền” (loại):** tên chung sẽ khiến 1 persona thành lớp phủ mọi approver — va chạm với “Người phê duyệt” (`Approver`) vốn là vai trò động theo từng đề nghị (FR-14).

#### Quyết định (Decision)

Chốt tên chuẩn là **“Giám đốc tài chính (CFO)” / `CFO`**; “Người có thẩm quyền” chỉ dùng như mô tả, không bao giờ thay tên persona.

#### Lý do (Rationale)

Tránh đồng nhất persona (ai) với vai trò động (Approver) — tách bạch theo `docs/domain-glossary.md` mục 3.1/3.3; gắn với FR-06 (hạn mức) và FR-13 (cấp cao nhất).

#### Đánh đổi / hệ quả (Trade-off)

Nếu sau này có vị trí khác (VD CEO) cũng phê duyệt theo hạn mức, chỉ cần thêm persona mới chứ không đổi tên P3.

### DEC-004 — Tách bạch “Giao dịch ngân hàng” khỏi “giao dịch” nói chung

- **Ngày:** 2026-10-12
- **Trạng thái:** Active

#### Bối cảnh (Context)

“Giao dịch” trong PRD là đồng âm khác nghĩa: (a) bản giao dịch ở phía ngân hàng (mã giao dịch từ gateway — FR-20, file dữ liệu giao dịch giả lập — FR-27); (b) trong cụm “hạn mức giao dịch” (FR-06) và “phê duyệt giao dịch” (persona P3) lại nghĩa là việc thanh toán/đề nghị. Nguy hiểm nhất: “giao dịch” từng bị dùng đồng nghĩa “lệnh thanh toán” (FR-19 nói “không tạo thêm giao dịch mới tại gateway”) — trong khi FR-27 lại đối chiếu “giao dịch” với chính “lệnh thanh toán”.

#### Các lựa chọn đã xem xét (Options considered)

- **Tách bạch 2 khái niệm (chọn):** “Giao dịch ngân hàng” (`BankTransaction`) chỉ bản giao dịch ở phía ngân hàng; cấm dùng “giao dịch” đứng một mình; “Hạn mức giao dịch” là thuật ngữ nguyên khối.
- **Gộp một nghĩa (loại):** dùng “giao dịch” cho mọi ngữ cảnh — ngắn hơn nhưng xóa mờ ranh giới hệ thống/ngân hàng, là nguồn gốc của lỗi mô hình hóa PaymentOrder vs BankTransaction (liên quan FR-19, FR-27).

#### Quyết định (Decision)

Chốt 3 lớp khái niệm riêng biệt: **Đề nghị thanh toán → Lệnh thanh toán (`PaymentOrder`) → Giao dịch ngân hàng (`BankTransaction`)**; “giao dịch” bị cấm đứng một mình; “Hạn mức giao dịch” (`TransactionLimit`) là nguyên khối không tách.

#### Lý do (Rationale)

Bắt buộc cho mô hình idempotency (FR-19, NFR-04: 0 lệnh trùng) và đối soát (FR-27/FR-28) — hai khái niệm phải tách biệt để đối chiếu “giao dịch giả lập” với “lệnh” có ý nghĩa; xác nhận tại `docs/domain-glossary.md` mục 3.9 dòng 1.

#### Đánh đổi / hệ quả (Trade-off)

Tên dài hơn trong code/UI; viết tắt “giao dịch” chỉ cho phép khi ngữ cảnh đã rõ ràng — cần kỷ luật khi review.

### DEC-005 — Tên hiển thị của Tenant: “Doanh nghiệp” / `Tenant`

- **Ngày:** 2026-10-12
- **Trạng thái:** Active

#### Bối cảnh (Context)

“Tenant” xuất hiện ~15 lần trong PRD nhưng PRD đôi chỗ gọi là “doanh nghiệp” (FR-05 “tài khoản thanh toán của doanh nghiệp”, persona P5 “Quản trị viên doanh nghiệp”). Cần chốt tên hiển thị cho UI.

#### Các lựa chọn đã xem xét (Options considered)

- **Hiển thị “Doanh nghiệp” / code `Tenant` (chọn):** trùng cách PRD đã dùng cho persona P5; persona P1–P3 (không kỹ thuật) thấy tên tiếng Việt.
- **“Tenant” cho cả hiển thị và code (loại):** giữ từ gốc nhưng 5/6 persona không phải kỹ thuật, UI phải ẩn thuật ngữ hạ tầng (ghi chú UX trong PRD phần Personas).

#### Quyết định (Decision)

Chốt: **hiển thị “Doanh nghiệp”, code/documented kỹ thuật là `Tenant`**; hai dạng là map duy nhất, không tự dịch khác đi (`docs/domain-glossary.md` mục 5).

#### Lý do (Rationale)

Đúng ghi chú UX của `docs/prd.md` (persona P1–P5 cần ngôn ngữ nghiệp vụ); nhất quán với persona P5 “Quản trị viên doanh nghiệp”.

#### Đánh đổi / hệ quả (Trade-off)

Tài liệu kỹ thuật và code vẫn dùng “tenant” — chấp nhận 2 dạng song song, đã được quy định bằng bảng map thay vì mỗi người tự dịch.

---

*(Các quyết định tiếp theo thêm 1 heading con theo format ở mục 2, đánh mã `DEC-xxx` tăng dần.)*
