# UX Guide — PayFlow Enterprise

> File này là **cơ sở duy nhất để sinh UI/UX nhất quán** khi implement (Angular SPA — xem `docs/architecture.md` mục 2). Không phải tài liệu mô tả cho người đọc rồi bỏ đó: mọi agent code màn hình **PHẢI** mở file này alongside `docs/domain-glossary.md`.
>
> **Quy tắc bất khả xâm phạm:** mọi **label, tên màn hình, tên trạng thái, thông báo** trong file này — và trong UI — dùng **đúng nguyên văn** thuật ngữ hiển thị (cột tiếng Việt) trong `docs/domain-glossary.md`. Không tự dịch, không viết tắt, không diễn đạt khác đi. Danh từ UI thuần phổ quát không phải thuật ngữ nghiệp vụ (Đăng nhập, Đăng xuất, Lưu, Đóng, Tìm kiếm, Phân trang, Tải lên) không cần có trong glossary — ranh giới này dừng ở danh từ **nghiệp vụ**.
>
> Chỗ nào chưa có brand guideline, baseline đề xuất được đánh dấu **[ĐỀ XUẤT - CẦN DUYỆT]**. Chỗ nào phụ thuộc Open Questions của PRD được đánh dấu **[CẦN LÀM RỎ: OQ-xx]**.

---

## 1. Nguyên tắc thiết kế

Gắn với persona thực tế trong `docs/prd.md` (5/6 persona không rành kỹ thuật):

1. **Nói ngôn ngữ nghiệp vụ, ẩn hạ tầng.** P1–P3 (Nhân viên kế toán, Trưởng phòng, Giám đốc tài chính (CFO)) không hiểu idempotency, outbox, retry. UI của họ **không bao giờ** hiển thị thuật ngữ hạ tầng (bảng 3.8 glossary: `Idempotency key`, `Outbox`, `Retry`, `Timeout`, `ConcurrencyStamp`, `Unit of Work`, `MultiTenancy`...) — mọi trạng thái nền được diễn đạt bằng 8 tên trạng thái nghiệp vụ (Nháp, Chờ phê duyệt, Đã phê duyệt, Đang thực thi, Hoàn thành, Thất bại, Chưa xác định, Đã hủy). **Ngoại lệ duy nhất:** màn hình của Nhân viên ngân quỹ (Treasury) và Quản trị viên nền tảng (Platform Admin) được phép hiển thị chi tiết kỹ thuật (PRD phần Personas).
2. **Mỗi màn hình trả lời được 3 câu: việc của tôi là gì, cái nào khẩn cấp, bấm vào đâu.** P2 cần "danh sách chờ phê duyệt ưu tiên" (PRD persona P2) → hàng chờ Phê duyệt mặc định sắp xếp mới nhất trước, có bộ lọc theo Cấp phê duyệt và Phòng ban.
3. **Không bao giờ để người dùng đoán bước tiếp theo.** Lỗi phải nói được "cái gì đã xảy ra + làm gì tiếp" (yêu cầu UX của P1 trong PRD). Empty state phải có nút hành động. Mọi thao tác quan trọng (Hủy Đề nghị, Từ chối) phải có bước xác nhận mô tả hậu quả bằng tên trạng thái đích.
4. **Ngăn lỗi từ đầu thay vì bắt lỗi sau.** Số tiền, tài khoản chọn từ combobox có dữ liệu; ngày dùng date picker; form Đề nghị thanh toán validate phía client trước khi gọi API và hiển thị lỗi inline ngay trên field.
5. **Nhất quán trên mọi màn hình.** Pattern lặp lại (bảng, form, modal, toast, empty state, skeleton) dùng đúng section 5 — không sáng tạo pattern mới cho từng màn hình. Danh từ nghiệp vụ trong copy khớp nguyên văn glossary ở mọi nơi.

## 2. Information Architecture

### 2.1 Sơ đồ cây điều hướng

Điều hướng cá nhân hóa theo persona (dùng tên persona của glossary 3.1; tên vai trò permission chính thức chờ **OQ-06** — ánh xạ persona↔vai trò sẽ chốt khi OQ-06 trả lời):

```
Đăng nhập (OIDC)
├── Đề nghị thanh toán            [P1, P2, P3, P5]
│   ├── Danh sách                 (FR-11)
│   ├── Tạo mới                   (FR-07)
│   ├── Chỉnh sửa                 (FR-09)
│   └── Chi tiết                  (FR-11, FR-17, FR-26)
│       ├── Tab: Thông tin + Chứng từ
│       ├── Tab: Lịch sử phê duyệt        (FR-17)
│       └── Tab: Lịch sử nghiệp vụ        (FR-26)
├── Phê duyệt                     [P2, P3]                    (FR-13, FR-14)
├── Lệnh thanh toán               [P4]                        (FR-20, FR-23)
│   ├── Danh sách
│   └── Chi tiết (kèm Tra soát)                                (FR-23)
├── Đối soát                      [P4]                        (FR-27, FR-28)
│   ├── Nhập file Giao dịch giả lập
│   └── Kết quả đối soát
├── Cấu hình                      [P5]
│   ├── Quy trình phê duyệt nhiều cấp                         (FR-08)
│   ├── Hạn mức giao dịch                                     (FR-06)
│   ├── Điều kiện nghiệp vụ                                   (FR-06, FR-08)
│   ├── Phòng ban                                             (FR-04)
│   ├── Tài khoản thanh toán                                  (FR-05)
│   └── Thành viên và Vai trò                                 (FR-02)
├── Doanh nghiệp                  [P6]                        (FR-01)
└── Nhật ký kiểm toán             [P6, (P4 theo phân quyền)]  (FR-25)
```

### 2.2 Bảng map màn hình ↔ FR

| Tên màn hình (đúng glossary) | Persona chính | FR |
|---|---|---|
| Đề nghị thanh toán — Danh sách | P1, P2, P3, P5 | FR-11 |
| Đề nghị thanh toán — Tạo mới | P1 | FR-07 |
| Đề nghị thanh toán — Chỉnh sửa | P1 | FR-09 |
| Đề nghị thanh toán — Chi tiết (Lịch sử phê duyệt, Lịch sử nghiệp vụ) | P1–P3 | FR-11, FR-17, FR-26 |
| Đề nghị thanh toán — Hủy (hành động + xác nhận) | P1, P5 | FR-10 |
| Phê duyệt — Hàng chờ của tôi | P2, P3 | FR-13, FR-14, FR-15 |
| Cấu hình — Quy trình phê duyệt nhiều cấp | P5 | FR-08 |
| Cấu hình — Hạn mức giao dịch | P5 | FR-06 |
| Cấu hình — Điều kiện nghiệp vụ | P5 | FR-06, FR-08 |
| Cấu hình — Phòng ban | P5 | FR-04 |
| Cấu hình — Tài khoản thanh toán | P5 | FR-05 |
| Cấu hình — Thành viên và Vai trò | P5 | FR-02 |
| Lệnh thanh toán — Danh sách / Chi tiết (Tra soát) | P4 | FR-20, FR-23 |
| Đối soát — Nhập file Giao dịch giả lập / Kết quả đối soát | P4 | FR-27, FR-28 |
| Doanh nghiệp (quản lý Doanh nghiệp) | P6 | FR-01 |
| Nhật ký kiểm toán | P6 | FR-25 |

## 3. Danh sách màn hình / luồng chính

Mỗi luồng **bắt buộc** có đủ 4 trạng thái giao diện: **đang tải (loading) · rỗng (empty) · lỗi (error) · thành công (success)**. Thiếu trạng thái nào khi implement = không đạt.

### 3.1 Đăng nhập

1. Redirect sang trang đăng nhập OIDC (ABP Identity).
2. **Loading:** màn hình chờ đăng nhập, spinner có nhãn "Đang đăng nhập...".
3. **Error:** "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại." — không lộ lý do kỹ thuật.
4. **Success:** về màn hình mặc định theo persona (Xem 2.1).

### 3.2 Tạo & gửi Đề nghị thanh toán (P1 — FR-07, FR-08)

1. Từ "Đề nghị thanh toán — Danh sách" bấm "Tạo Đề nghị thanh toán".
2. Form: **Số tiền** (VNĐ [ĐỀ XUẤT - CẦN DUYỆT]), **Tài khoản trả** (chọn từ Tài khoản thanh toán), **Tài khoản thụ hưởng** (nhập), nội dung, **Chứng từ** (tải lên — `[CẦN LÀM RỎ: OQ-08 — dung lượng/định dạng]`).
3. **Lưu** → trangetail với trạng thái **Nháp** + toast "Đã lưu Nháp."
4. Bấm "Gửi phê duyệt" → dialog xác nhận: "Gửi Đề nghị thanh toán này để phê duyệt? Trạng thái sẽ chuyển sang Chờ phê duyệt." → **Success:** badge chuyển **Chờ phê duyệt**, toast "Đề nghị thanh toán đã được gửi phê duyệt."
5. **Loading:** skeleton bảng/form; nút submit spinner + disable tránh bấm 2 lần.
6. **Empty (danh sách):** icon nhẹ + "Chưa có Đề nghị thanh toán nào." + nút "Tạo Đề nghị thanh toán".
7. **Error:** inline trên field (VD: "Số tiền phải lớn hơn 0."); lỗi server → toast đỏ dính kèm nội dung "Đề nghị thanh toán chưa được lưu. Vui lòng thử lại." — nếu lỗi do dữ liệu thay đổi bởi người khác (conflict): "Dữ liệu vừa được người khác thay đổi. Vui lòng tải lại trang và thử lại."

### 3.3 Phê duyệt / Từ chối (P2, P3 — FR-13, FR-14, FR-15)

1. Màn hình "Phê duyệt — Hàng chờ của tôi": bảng các Đề nghị thanh toán ở trạng thái **Chờ phê duyệt** mà người dùng là Approver của **Cấp phê duyệt** hiện tại; cột ưu tiên: **Số tiền**, Phòng ban, thời gian chờ.
2. Vào chi tiết: hiện đủ ngữ cảnh trước khi quyết định (yêu cầu persona P3): **Số tiền** vs **Hạn mức giao dịch** áp dụng, **Cấp phê duyệt** hiện tại, các quyết định ở cấp trước, **Chứng từ** xem inline (không cần tải về).
3. Hành động: nút "Phê duyệt" và "Từ chối" (dialog bắt buộc xem trước tóm tắt).
   - **Phê duyệt** → toast "Đã Phê duyệt tại Cấp phê duyệt {n}." Nếu đây là cấp cuối → badge Đề nghị chuyển sang **Đã phê duyệt**.
   - **Từ chối** → bắt buộc nhập lý do `[CẦN LÀM RỎ: OQ-13]` → trạng thái Đề nghị theo OQ-01 `[CẦN LÀM RỎ]`; hiển thị ngay Lịch sử phê duyệt giữ nguyên các cấp trước.
   - **Maker-Checker (P15/NFR-02):** nếu Đề nghị do chính mình tạo, 2 nút bị disable kèm tooltip: "Maker-Checker: Người tạo không thể Phê duyệt Đề nghị thanh toán của chính mình." Kiểm tra ở server — UI chỉ phản ánh, không phải chốt chặn.
4. **Empty:** "Không có Đề nghị thanh toán nào đang chờ bạn Phê duyệt."
5. **Error / Loading:** như 3.2.

### 3.4 Hủy Đề nghị thanh toán (FR-10)

1. Từ Chi tiết (trạng thái cho phép hủy theo Ma trận chuyển trạng thái `[CẦN LÀM RỎ: OQ-01]`) bấm "Hủy".
2. Dialog: "Hủy Đề nghị thanh toán này? Trạng thái sẽ chuyển sang Đã hủy và không thể tiếp tục phê duyệt." — nút xác nhận "Hủy Đề nghị thanh toán", nút "Đóng".
3. **Success:** badge **Đã hủy**; **Error:** "Không thể Hủy Đề nghị thanh toán ở trạng thái hiện tại." (khi gọi API trực tiếp/ở trạng thái không hợp lệ).

### 3.5 Thực thi & giám sát Lệnh thanh toán (P4 — FR-18→FR-23)

1. "Lệnh thanh toán — Danh sách": bộ lọc theo 8 trạng thái; cột: Đề nghị tương ứng, **Số tiền**, **Mã giao dịch** (khi **Hoàn thành**), **Mã lỗi** (khi **Thất bại**), thời điểm.
2. Chi tiết Lệnh: timeline; **P4 được xem chi tiết kỹ thuật** (thuật ngữ glossary 3.8 hiển thị được: `Idempotency key`, số lần `Retry`, `Timeout` cấu hình) — các persona khác không thấy màn hình này.
3. **Chưa xác định:** banner vàng: "Lệnh thanh toán chưa xác định kết quả. Hệ thống không tự gửi lại để tránh gửi trùng. Nhân viên ngân quỹ cần Tra soát để xác định trạng thái thật." — cấm nút "Gửi lại" tự động cho P4 (chỉ Tra soát giải quyết, FR-21).
4. **Empty:** "Chưa có Lệnh thanh toán nào." **Error/Loading:** như trên.

### 3.6 Tra soát (P4 — FR-23)

Từ chi tiết Lệnh ở trạng thái **Thất bại** hoặc **Chưa xác định**: form `[CẦN LÀM RỎ: OQ-04 — nội dung thao tác cụ thể]` — MVP placeholder: ghi chú + cập nhật trạng thái cuối cùng. **Success:** toast "Đã lưu kết quả Tra soát." **Lịch sử nghiệp vụ** ghi lại.

### 3.7 Đối soát (P4 — FR-27, FR-28)

1. "Đối soát — Nhập file Giao dịch giả lập": tải file (CSV/XLSX `[CẦN LÀM RỎ: OQ-05 — tiêu chí khớp, OQ-08]`).
2. **Loading:** tiến độ + "Đang đối soát... Không đóng trình duyệt."
3. **Error:** "Không đọc được file. Vui lòng kiểm tra định dạng theo mẫu." / "Đối soát thất bại giữa chừng. Vui lòng thử lại."
4. "Kết quả đối soát": bảng với Kết quả đối soát = **Khớp** / **Sai lệch**; bộ lọc; tổng hợp đầu bảng; dòng Sai lệch có cột lý do (Giao dịch giả lập không có Lệnh thanh toán / Lệnh thanh toán không có Giao dịch giả lập / lệch **Số tiền** — `[CẦN LÀM RỎ: OQ-05]`).
5. **Empty:** "Chưa có Kết quả đối soát nào. Hãy Nhập file Giao dịch giả lập để bắt đầu."

### 3.8 Cấu hình (P5 — FR-02, FR-04, FR-05, FR-06, FR-08)

Form CRUD chuẩn (section 5) cho: Quy trình phê duyệt nhiều cấp (thêm **Cấp phê duyệt**, gắn **Hạn mức giao dịch** và **Điều kiện nghiệp vụ** `[CẦN LÀM RỎ: OQ-06 vai trò Approver, OQ-07 định nghĩa Hạn mức]`), Phòng ban, Tài khoản thanh toán, Thành viên và Vai trò. **Success:** toast "Đã lưu cấu hình. Thay đổi có hiệu lực ngay cho Đề nghị thanh toán mới." **Empty:** mỗi màn hình có hướng dẫn 1 dòng + nút tạo.

### 3.9 Quản lý Doanh nghiệp (P6 — FR-01)

Danh sách Doanh nghiệp: tạo/kích hoạt/vô hiệu hóa; dialog xác nhận nêu rõ "Dữ liệu nghiệp vụ của Doanh nghiệp sẽ không truy cập được khi vô hiệu hóa." Ngăn P6 lẫn thao tác dữ liệu nghiệp vụ (UI tách hẳn khu vực cấu hình nền tảng khỏi điều hướng nghiệp vụ).

### 3.10 Nhật ký kiểm toán (P6 — FR-25)

Bảng bất biến: người thực hiện, thời điểm, đối tượng, hành động. **Không có** nút sửa/xóa. Filter theo người/thời gian/loại đối tượng.

## 4. Design tokens cơ bản

**[ĐỀ XUẤT - CẦN DUYỆT]** — chưa có brand guideline; baseline hợp lý cho công cụ nội bộ doanh nghiệp (tinh gọn, tương phản cao, không trang trí):

### 4.1 Bảng màu

| Token | Hex | Dùng cho |
|---|---|---|
| `--pf-primary` | `#1E4FA3` | nút chính, link, focus |
| `--pf-primary-hover` | `#163C7D` | hover nút chính |
| `--pf-secondary` | `#5E6C84` | nút phụ, text phụ |
| `--pf-bg` | `#F5F7FA` | nền trang |
| `--pf-surface` | `#FFFFFF` | nền card/table |
| `--pf-border` | `#D8DCE3` | viền |
| `--pf-text` | `#172B4D` | text chính (contrast ~15:1 trên trắng) |
| `--pf-text-secondary` | `#5E6C84` | text phụ (~5.2:1 — đạt 4.5:1) |
| `--pf-success` | `#2E7D32` | success |
| `--pf-warning` | `#B26A00` | warning |
| `--pf-error` | `#C62828` | error |
| `--pf-info` | `#1565C0` | thông báo |

**Màu badge theo Trạng thái** (bắt buộc thống nhất mọi màn hình; text luôn hiển thị tên trạng thái — không dùng màu làm tín hiệu duy nhất):

| Trạng thái (đúng glossary) | Token màu |
|---|---|
| Nháp | `--pf-secondary` |
| Chờ phê duyệt | `--pf-info` |
| Đã phê duyệt | `#4527A0` |
| Đang thực thi | `--pf-warning` |
| Hoàn thành | `--pf-success` |
| Thất bại | `--pf-error` |
| Chưa xác định | `#8D6E00` (vàng đậm — đủ contrast) |
| Đã hủy | `--pf-secondary` + gạch ngang tên |

### 4.2 Typography **[ĐỀ XUẤT - CẦN DUYỆT]**

Font hệ thống: `-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (không tải webfont — NFR-06 không phụ thuộc ngoài).

| Scale | Size/Line-height | Dùng cho |
|---|---|---|
| Caption | 12/16 | metadata, timestamp |
| Body nhỏ | 13/20 | bảng |
| Body | 14/22 | nội dung mặc định |
| Body lớn | 16/24 | form label quan trọng |
| H3 | 20/28 | tiêu đề card/section |
| H2 | 24/32 | tiêu đề màn hình |
| H1 | 30/38 | chỉ trang chủ nếu có |

### 4.3 Spacing, radius, breakpoint **[ĐỀ XUẤT - CẦN DUYỆT]**

- Spacing: `4 / 8 / 12 / 16 / 24 / 32 / 48` px.
- Radius: 4px (input, button), 8px (card, modal).
- Breakpoints: `mobile < 768`, `tablet 768–1279`, `desktop ≥ 1280`; **hỗ trợ chính: desktop, tối thiểu 1024** (xem section 8).
- Định dạng: **Số tiền** theo locale vi-VN, đơn vị VNĐ [ĐỀ XUẤT - CẦN DUYỆT]; ngày `dd/MM/yyyy`, thời điểm `HH:mm dd/MM/yyyy`.

## 5. Component pattern chung

Áp dụng cho mọi màn hình; **cấm sáng tạo pattern mới** khi code:

| Pattern | Hành vi mặc định | Dùng khi |
|---|---|---|
| **Form** | Label trên input (không dùng placeholder thay label); bắt buộc dấu `*`; validate onBlur + khi submit; lỗi inline dưới field; nút "Lưu" (primary) + "Đóng" (**cấm** dùng "Hủy" cho nút đóng form — "Hủy" chỉ dành cho hành động Hủy Đề nghị theo glossary 3.4) | Mọi tạo/sửa cấu hình & Đề nghị |
| **Bảng** | Phân trang server-side,-sort theo cột, cột Trạng thái = badge (section 4.1), click hàng → chi tiết; hàng nhấp nháy skeleton khi đang tải | Danh sách (Đề nghị, Lệnh, Thành viên...) |
| **Modal** | Chỉ cho hành động phá hủy/xác nhận (Hủy Đề nghị, Từ chối, vô hiệu hóa Doanh nghiệp); có nút đóng; form dài dùng **trang riêng**, không modal | Xác nhận |
| **Toast** | Thành công: tự tắt sau 3s, góc trên phải, `aria-live=polite`; lỗi: dính cho tới khi đóng, `aria-live=assertive` | Phản hồi mọi thao tác |
| **Empty state** | Icon nhẹ + 1 câu đúng thuật ngữ glossary + nút hành động chính (xem 3.2/3.5/3.7) | Danh sách rỗng |
| **Loading skeleton** | Skeleton đúng hình dung tích (bảng/form); nút đang gửi spinner + disable | Chờ dữ liệu / chờ API |
| **Badge Trạng thái** | Đúng tên hiển thị + màu section 4.1; luôn kèm text | Mọi nơi hiện Trạng thái |
| **Tải lên Chứng từ** | Kéo-thả + chọn file; tiến độ; xóa được khi ở **Nháp**; preview ảnh/PDF inline `[CẦN LÀM RỎ: OQ-08]` | Tạo/sửa Đề nghị |
| **Bộ lọc** | Trên danh sách; giữ bộ lọc khi quay lại từ chi tiết (URL query) | Danh sách dài |

## 6. Accessibility tối thiểu

Mức tối thiểu chấp nhận được (không phải checklist WCAG đầy đủ):

1. **Contrast:** text ≥ 4.5:1, text lớn/icon ≥ 3:1 — bảng token section 4.1 đã đạt; token mới phải kiểm tra trước khi dùng.
2. **Keyboard:** toàn bộ điều hướng, bảng, form, modal dùng được bằng bàn phím; modal trap focus, `Esc` đóng; focus ring thấy rõ (`--pf-primary`, 2px).
3. **Label:** mọi input có `<label>` liên kết; input lỗi có `aria-invalid` + mô tả lỗi liên kết `aria-describedby`.
4. **Icon-only button:** bắt buộc `aria-label` (VD: nút đóng modal).
5. **Thông báo:** toast dùng `aria-live` (polite/assertive); cập nhật Trạng thái sau thao tác được screen reader đọc.
6. **Ảnh/Chứng từ preview:** có alt text mô tả ("Chứng từ của Đề nghị thanh toán {mã}"); ảnh scan không có alt tự nhiên → mô tả loại chứng từ.
7. **Bảng:** có `<th scope>`; sort hiện hướng sort bằng icon + `aria-sort`.

## 7. Content / tone of voice trong UI copy

1. **Xưng hô:** "bạn" — thân thiện, chuyên nghiệp; **không** dùng "quý khách" (công cụ nội bộ, không phải kênh khách hàng), không dùng "admin/user" trong copy hiển thị.
2. **Ngôn ngữ:** tiếng Việt; giữ nguyên tên code chỉ khi hiển thị cho P4/P6 theo mục 1 (glossary 3.8).
3. **Cấu trúc thông báo lỗi:** [Cái gì đã xảy ra] + [Bài học? → làm gì tiếp]. VD đúng: "Đề nghị thanh toán chưa được gửi. Vui lòng kiểm tra Chứng từ và thử lại." VD sai: "Lỗi 500: Outbox dispatch failed."
4. **Tên trạng thái & danh từ nghiệp vụ:** nguyên văn glossary — cấm liệt kê lại các từ bị cấm: "yêu cầu (thanh toán)", "bản nháp", "đang xử lý" (thay bằng **Đang thực thi**), "chờ duyệt", "đã duyệt", "thành công" (thay bằng **Hoàn thành** khi là tên trạng thái), "hủy bỏ", "bộ phận", "tài khoản ngân hàng", "giao dịch" đứng một mình, "đối chiếu" dùng thay "đối soát", "người quyết định" (dùng **Người phê duyệt**).
5. **Động từ nút:** "Tạo Đề nghị thanh toán", "Gửi phê duyệt", "Phê duyệt", "Từ chối", "Hủy", "Lưu", "Đóng", "Nhập file Giao dịch giả lập" — nút mô tả việc làm, không mô tả kỹ thuật.
6. **Cảm xúc:** trung lập, không đổ lỗi người dùng, không xin lỗi thừa; lỗi hệ thống phía mình dùng "Hệ thống chưa xử lý được...".
7. Thuật ngữ hạ tầng (`Idempotency key`, `Outbox`, `Retry`...) trong copy cho P1–P5 = lỗi review; thay bằng trạng thái nghiệp vụ hoặc câu mô tả thường (xem 3.5).

## 8. Responsive rule

Mỏng Angular SPA, không có mobile native (ngoài phạm vi PRD) — desktop-first:

| Breakpoint | Hành vi |
|---|---|
| **Desktop ≥ 1280** (hỗ trợ chính) | Layout đầy đủ: sidebar điều hướng + nội dung; bảng đủ cột |
| **Desktop nhỏ 1024–1279** | Giữ đủ chức năng; cột bảng phụ ẩn sau "Thêm cột" |
| **Tablet 768–1279** [ĐỀ XUẤT - CẦN DUYỆT] | Sidebar thu gọn icon; cho phép các luồng chính: xem Chi tiết Đề nghị, Phê duyệt/Từ chối, Tra soát; bảng chuyển card-list khi cột không đủ |
| **Mobile < 768** [ĐỀ XUẤT - CẦN DUYỆT] | Phạm vi tối thiểu: xem Danh sách + Chi tiết, Phê duyệt/Từ chối, xem Lệnh thanh toán; **không** hỗ trợ tạo/sửa cấu hình và Đối soát (ẩn nút, không chỉ disable); table → card |

Nếu duyệt phạm vi mobile hẹp hơn/mở rộng hơn, cập nhật mục này và ghi `docs/decisions.md` (ảnh hưởng scope).

---

**Ghi chú tham chiếu:** `docs/conventions.md` dùng mục 5 (component pattern) + section 4 (tokens) để định nghĩa naming/cấu trúc component Angular; `copilot-instructions.md` bắt buộc đọc file này trước khi code bất kỳ màn hình nào. Thuật ngữ hiển thị mới phát sinh khi implement → bổ sung `docs/domain-glossary.md` (mục 4) **trước**, rồi mới dùng; quyết định đổi tên có ảnh hưởng → ghi `docs/decisions.md`.
