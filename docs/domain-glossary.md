# Domain Glossary — PayFlow Enterprise

### (Ubiquitous Language — ngôn ngữ chung của dự án)

> **Nguồn:** trích từ `docs/prd.md` — toàn bộ danh từ nghiệp vụ lặp lại ≥ 2 lần trong Context, Personas, Scope, FR, NFR và Success Metrics.
> **Trạng thái:** 5 chỗ PRD dùng lẫn 2 tên cho 1 khái niệm đã được người phụ trách sản phẩm xác nhận (xem mục 3.9). Các ô còn đánh dấu `[CẦN LÀM RỎ]` gắn với Open Questions của PRD — khi có trả lời, cập nhật lại định nghĩa trong bảng, **không đổi tên thuật ngữ**.
> **Áp dụng bắt buộc:** mọi file sinh sau (`architecture.md`, `ux.md`, `conventions.md`, `status.md`, `decisions.md`) và mọi đoạn code, tên biến/class, API payload, UI copy sau này.

---

## 1. Mục đích file

- Đây là nơi **chốt DUY NHẤT 1 tên gọi cho mỗi khái niệm nghiệp vụ**. Một khái niệm — một tên — dùng đúng tên này ở mọi nơi trong dự án.
- **Không** phải nơi giải thích kiến trúc (module, transaction, outbox, EF Core hoạt động thế nào → việc của `docs/architecture.md`).
- **Không** phải nơi mô tả UI (màn nào, nút nào, giọng văn thế nào → việc của `docs/ux.md`).
- Thuật ngữ nằm trong cột **“KHÔNG được gọi là”** là **từ cấm**: không được thay thế bằng chúng trong tên file, tên biến, tên class, API payload, UI copy hay tài liệu (trừ khi trích dẫn nguyên văn có ghi nguồn).

## 2. Bảng thuật ngữ — format & quy ước

Mỗi dòng của bảng là **một dòng đúng 4 cột**:

| Cột | Yêu cầu |
|-----|---------|
| **Thuật ngữ chuẩn** | Tên DUY NHẤT được phép dùng, luôn ghi cả 2 dạng khi 2 tên khác nhau: `Tên hiển thị (tiếng Việt)` / `TênCode` (tiếng Anh). |
| **Định nghĩa** | 1–2 câu, đúng ngữ cảnh dự án này — không phải định nghĩa từ điển. |
| **KHÔNG được gọi là** | Các từ đồng nghĩa / biến thể dễ dùng nhầm — đều là **từ cấm**. |
| **Thuật ngữ liên quan** | Tên chuẩn của các thuật ngữ có quan hệ trực tiếp (tra cứu chéo). |

**Quy ước viết tắt (chỉ trong câu, không dùng làm tên):** “đề nghị” = Đề nghị thanh toán; “lệnh” = Lệnh thanh toán; “cấp” = Cấp phê duyệt — chỉ khi ngữ cảnh câu đã chỉ đúng thực thể. Tên entity/code luôn dùng dạng đầy đủ.

**Quy ước nhóm domain:** cùng một từ có thể mang nghĩa khác nhau ở domain khác → **tách biệt, không gộp chung 1 dòng** (liệt kê đầy đủ ở mục 3.9).

---

## 3. Bảng thuật ngữ theo domain

### 3.1 Domain: Vai trò người dùng (Persona)

> Tên ở đây là tên persona/hiển thị. **Tên vai trò permission chính thức trong hệ thống còn chờ OQ-06** — khi chốt phải lấy tên ở bảng này làm gốc, không đặt tên mới.

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Nhân viên kế toán** / `Accountant` | Persona P1. Tạo Đề nghị thanh toán, đính kèm Chứng từ, theo dõi trạng thái xử lý. Am hiểu kỹ thuật thấp → UI phải nói ngôn ngữ nghiệp vụ. | kế toán viên, nhân viên tài chính, “người dùng P1” | Đề nghị thanh toán, Người tạo, Chứng từ |
| **Trưởng phòng** / `DepartmentManager` | Persona P2. Kiểm tra thông tin và phê duyệt đề nghị thuộc Phòng ban phụ trách. | **Quản lý bộ phận** (đã bị cấm — chốt 05/10/2026), bộ phận, trưởng ban, manager | Phòng ban, Người phê duyệt, Cấp phê duyệt |
| **Giám đốc tài chính (CFO)** / `CFO` | Persona P3. Phê duyệt giao dịch theo Hạn mức giao dịch và chính sách; cấp thẩm quyền cao nhất trong quy trình. | **Người có thẩm quyền** (chỉ là mô tả phạm vi, không phải tên persona), giám đốc, ban lãnh đạo | Hạn mức giao dịch, Người phê duyệt, Cấp phê duyệt |
| **Nhân viên ngân quỹ** / `Treasury` | Persona P4. Theo dõi gửi Lệnh thanh toán, kết quả giao dịch; xử lý Tra soát và Đối soát. | thủ quỹ, kho bạc, treasury (khi hiển thị cho người dùng) | Lệnh thanh toán, Tra soát, Đối soát, Giao dịch ngân hàng |
| **Quản trị viên doanh nghiệp** / `TenantAdmin` | Persona P5. Quản lý Thành viên, Vai trò, Phòng ban và cấu hình Quy trình phê duyệt trong Doanh nghiệp của mình. | quản trị hệ thống (đó là Platform Admin), sysadmin, “admin tenant” khi hiển thị | Doanh nghiệp, Vai trò, Phòng ban, Quy trình phê duyệt nhiều cấp |
| **Quản trị viên nền tảng** / `PlatformAdmin` | Persona P6. Quản lý Doanh nghiệp (tenant) và cấu hình vận hành cấp hệ thống; không được lẫn thao tác với dữ liệu nghiệp vụ của tenant. | quản trị viên doanh nghiệp (đó là Tenant Admin), super admin, root | Doanh nghiệp, Multi-tenancy |

### 3.2 Domain: Tenancy, người dùng & tổ chức

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Doanh nghiệp** (hiển thị) / `Tenant` (code) | Đơn vị kinh doanh thuê sử dụng hệ thống; là ranh giới cô lập DUY NHẤT của mọi dữ liệu nghiệp vụ (mọi bản ghi nghiệp vụ gắn tenant — FR-01). | khách hàng, công ty, organization, client; viết “tenant” trên UI cho P1–P5 | Cô lập tenant, Multi-tenancy, Thành viên, Quản trị viên doanh nghiệp |
| **Người dùng** / `User` | Bất kỳ tài khoản nào thao tác hệ thống — dùng khi nói chung ở cấp phân quyền và audit log. | user (khi hiển thị), account, **thành viên** (không dùng thay — xem Thành viên) | Thành viên, Vai trò, Quyền |
| **Thành viên** / `Member` | Người dùng đã được thêm vào một Doanh nghiệp và được gán Vai trò trong doanh nghiệp đó (FR-02, FR-04). | user (khi đang nói người thuộc 1 doanh nghiệp), tài khoản, “nhân viên” (quan hệ lao động, không phải quan hệ hệ thống — giữ “Nhân viên kế toán” chỉ persona) | Doanh nghiệp, Người dùng, Vai trò, Phòng ban |
| **Vai trò** / `Role` | Tập hợp Quyền được gán cho một Thành viên trong một Doanh nghiệp. Danh sách vai trò chính thức chờ **OQ-06**. | quyền, permission, chức năng | Thành viên, Quyền, Phân quyền |
| **Quyền** / `Permission` | Đơn vị kiểm tra nhỏ nhất mà server kiểm tra trước khi thực thi một thao tác (FR-03). | vai trò, role, đặc quyền | Vai trò, Phân quyền, Người dùng |
| **Phân quyền** / `Authorization` | Cơ chế server kiểm tra Quyền trước khi thực thi; 100% API nghiệp vụ phải có (NFR-02). | **xác thực (authentication)** — hai khái niệm khác nhau; phân cấp | Quyền, Vai trò, Cô lập tenant |
| **Phòng ban** / `Department` | Đơn vị tổ chức bên trong Doanh nghiệp; mỗi Đề nghị gắn với Phòng ban của Người tạo để lọc phạm vi xem (FR-04, FR-11). | bộ phận (bị cấm theo chốt Persona P2), team, nhóm | Thành viên, Trưởng phòng, Đề nghị thanh toán |
| **Multi-tenancy** / `MultiTenancy` | Kiến trúc một instance phục vụ nhiều Doanh nghiệp; MVP dùng shared database/shared schema (NFR-03). | cô lập tenant (khác — xem dòng dưới), multi-database | Doanh nghiệp, Cô lập tenant |
| **Cô lập tenant** / `TenantIsolation` | Tính chất: không tồn tại đường nào đọc/ghi dữ liệu Doanh nghiệp khác, kể cả gọi API trực tiếp theo ID; chứng minh bằng test (NFR-02, SM-02). | multi-tenancy (là kiến trúc, không phải tính chất kiểm tra), “bảo mật tenant” | Multi-tenancy, Phân quyền, Doanh nghiệp |

### 3.3 Domain: Đề nghị thanh toán

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Đề nghị thanh toán** (hiển thị) / `PaymentRequest` (code) | Thực thể trung tâm: Người tạo khởi tạo với Số tiền, Tài khoản trả, Tài khoản thụ hưởng, Chứng từ; đi qua 8 Trạng thái và Quy trình phê duyệt nhiều cấp. | **yêu cầu, yêu cầu thanh toán** (bị cấm — chốt 05/10/2026; “yêu cầu” chỉ được dùng cho HTTP request/hành động, không chỉ thực thể này), đơn thanh toán, hóa đơn, order | Trạng thái, Người tạo, Người phê duyệt, Lệnh thanh toán, Chứng từ |
| **Người tạo** (hiển thị) / `Maker` (code) | Ai đó tạo một Đề nghị thanh toán cụ thể — vai trò **động theo từng đề nghị**, không phải tên persona. | tác giả, author, người yêu cầu, requester; không đồng nhất với persona Nhân viên kế toán | Đề nghị thanh toán, Maker-Checker, Người phê duyệt |
| **Người phê duyệt** (hiển thị) / `Approver` (code) | Người có quyền ra quyết định Phê duyệt hoặc Từ chối tại một Cấp phê duyệt cho một Đề nghị. | người quyết định (biến thể trong FR-14 — bị cấm), cấp trên, sếp, checker (chỉ dùng bên trong tên nguyên tắc Maker-Checker) | Người tạo, Cấp phê duyệt, Quyết định phê duyệt, Maker-Checker |
| **Chứng từ** / `SupportingDocument` | Tài liệu đính kèm trong Đề nghị để chứng minh lý do thanh toán (FR-07); cơ chế lưu trữ chờ **OQ-08**. | hóa đơn (chỉ là 1 loại chứng từ), tài liệu, file đính kèm, attachment | Đề nghị thanh toán, Người tạo |
| **Số tiền** / `Amount` | Giá trị tiền của một Đề nghị; dùng để đối chiếu Hạn mức giao dịch và phát hiện Sai lệch. | tiền, giá trị, value, tổng tiền | Đề nghị thanh toán, Hạn mức giao dịch, Sai lệch |
| **Tài khoản thanh toán** / `PaymentAccount` | Tài khoản của Doanh nghiệp dùng làm nguồn tiền trả; Tenant Admin quản lý danh sách (FR-05). | tài khoản ngân hàng, bank account, tài khoản đối ứng | Tài khoản trả, Doanh nghiệp, Đề nghị thanh toán |
| **Tài khoản trả** / `PayerAccount` | Tài khoản thanh toán cụ thể được chọn trong một Đề nghị làm nguồn trả. | tài khoản nguồn, nguồn tiền, payer | Tài khoản thanh toán, Tài khoản thụ hưởng, Đề nghị thanh toán |
| **Tài khoản thụ hưởng** / `BeneficiaryAccount` | Tài khoản nhận tiền ghi trong một Đề nghị (FR-07). | người nhận, bên thụ hưởng, tài khoản nhận, người hưởng | Tài khoản trả, Đề nghị thanh toán, Giao dịch ngân hàng |
| **Trạng thái** (của Đề nghị) / `PaymentRequestStatus` | Một trong 8 giá trị của vòng đời Đề nghị; chuyển trạng thái chỉ hợp lệ theo Ma trận chuyển trạng thái (FR-12). | giai đoạn (giai đoạn = tiến độ dự án), tiến độ, stage, tình trạng | Ma trận chuyển trạng thái, 8 trạng thái (bảng bên dưới), Đề nghị thanh toán |
| **Ma trận chuyển trạng thái** / `StateTransitionMatrix` | Tập các cạnh chuyển hợp lệ giữa 8 Trạng thái; mọi thao tác vi phạm bị từ chối, dữ liệu không đổi. Nội dung đầy đủ chờ **OQ-01**. | ma trận trạng thái (biến thể trong PRD — bị cấm), luồng trạng thái, flow | Trạng thái, Đề nghị thanh toán, Hủy |

**8 trạng thái — bảng map DUY NHẤT giữa mã (code, tiếng Anh) và tên hiển thị (UI, tiếng Việt):**

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| `Draft` (code) / **“Nháp”** (hiển thị) | Mới tạo, chưa gửi phê duyệt; Người tạo còn sửa/hủy được (FR-07). | bản nháp, chưa gửi, new | Trạng thái, Đề nghị thanh toán |
| `Pending Approval` (code) / **“Chờ phê duyệt”** (hiển thị) | Đã gửi, đang chờ các Cấp phê duyệt quyết định (FR-08). | đang xử lý (đó là Processing), chờ duyệt, pending | Trạng thái, Cấp phê duyệt, Quy trình phê duyệt nhiều cấp |
| `Approved` (code) / **“Đã phê duyệt”** (hiển thị) | Đủ các cấp đã Phê duyệt; sẵn sàng thực thi thành Lệnh thanh toán (FR-18). | đã duyệt, chấp nhận, accepted | Trạng thái, Lệnh thanh toán, Phê duyệt |
| `Processing` (code) / **“Đang thực thi”** (hiển thị) | Lệnh đã gửi đi, chưa có kết quả từ gateway (FR-20). | đang xử lý, đang gửi, sending, pending | Trạng thái, Lệnh thanh toán, Thực thi thanh toán |
| `Completed` (code) / **“Hoàn thành”** (hiển thị) | Nhận kết quả thành công từ gateway, kèm Mã giao dịch (FR-20). | thành công, success, done | Trạng thái, Giao dịch ngân hàng, Mã giao dịch |
| `Failed` (code) / **“Thất bại”** (hiển thị) | Nhận kết quả thất bại từ gateway, kèm Mã lỗi (FR-20). | lỗi, error, bị từ chối | Trạng thái, Mã lỗi, Tra soát |
| `Unknown` (code) / **“Chưa xác định”** (hiển thị) | Timeout hoặc phản hồi không xác định được; KHÔNG tự động gửi lại lệnh cho đến khi xác định được trạng thái thật (FR-21). | không xác định, chưa định (biến thể trong prose PRD), unknown khi hiển thị, “lỗi không rõ” | Trạng thái, Timeout, Tra soát, Đối soát |
| `Cancelled` (code) / **“Đã hủy”** (hiển thị) | Đề nghị bị Hủy bởi Người tạo/người có quyền hủy khi còn ở trạng thái hợp lệ (FR-10). | hủy bỏ, bị hủy, từ chối (khác — Từ chối là quyết định của Người phê duyệt) | Trạng thái, Hủy, Từ chối |

> **[CẦN LÀM RỎ — liên kết OQ-01]:** FR-20/21/23 nói “trạng thái” của **Lệnh thanh toán** (Processing, Failed, Unknown…) nhưng PRD chưa chốt Lệnh dùng chung bộ 8 trạng thái của Đề nghị hay một bộ con riêng. **Không tự tạo bộ trạng thái thứ hai cho Lệnh** trước khi OQ-01 được trả lời; nếu chung một enum thì ghi rõ ở đây.

### 3.4 Domain: Phê duyệt

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Quy trình phê duyệt nhiều cấp** / `ApprovalWorkflow` | Chuỗi các Cấp phê duyệt áp dụng cho một Đề nghị, xác định khi đề nghị được gửi, dựa trên Hạn mức giao dịch và Điều kiện nghiệp vụ (FR-08). Viết rút gọn “quy trình phê duyệt” khi ngữ cảnh đã rõ. | luồng phê duyệt, luồng duyệt, approval flow, workflow, quy trình duyệt | Cấp phê duyệt, Hạn mức giao dịch, Điều kiện nghiệp vụ, Đề nghị thanh toán |
| **Cấp phê duyệt** / `ApprovalLevel` | Vị trí thứ tự trong quy trình mà một Người phê duyệt ra Quyết định phê duyệt; cấp kế chỉ mở khi cấp trước đã Phê duyệt (FR-13). Viết tắt “cấp”. | bước duyệt, giai đoạn phê duyệt, level, step | Quy trình phê duyệt nhiều cấp, Người phê duyệt, Quyết định phê duyệt |
| **Hạn mức giao dịch** / `TransactionLimit` | Mức trần Số tiền do Tenant Admin cấu hình; đối chiếu với Số tiền đề nghị để quyết định số Cấp phê duyệt (FR-06). **Thuật ngữ nguyên khối** — xem 3.9. | ngân sách, budget, hạn mức tiền; KHÔNG hiểu “giao dịch” trong cụm này là Giao dịch ngân hàng | Số tiền, Cấp phê duyệt, Điều kiện nghiệp vụ, Đề nghị thanh toán |
| **Điều kiện nghiệp vụ** / `BusinessCondition` | Tiêu chí nghiệp vụ khác Số tiền, cùng Hạn mức quyết định quy trình nào áp dụng cho đề nghị. Nội dung cụ thể chờ **OQ-07**. | luật nghiệp vụ, rule, điều khoản | Hạn mức giao dịch, Quy trình phê duyệt nhiều cấp |
| **Quyết định phê duyệt** / `ApprovalDecision` | Kết quả của một cấp: Phê duyệt hoặc Từ chối, kèm Người phê duyệt, thời điểm, cấp tương ứng; lưu bất biến vào Lịch sử phê duyệt (FR-14). | kết quả (chung chung), kết quả đối soát (khác domain), vote | Người phê duyệt, Phê duyệt, Từ chối, Lịch sử phê duyệt |
| **Phê duyệt** (hiển thị) / `Approve` (code) | Lựa chọn chấp thuận của Người phê duyệt tại một cấp; là điều kiện để cấp kế mở (FR-13). | duyệt, accept, OK | Từ chối, Quyết định phê duyệt, Cấp phê duyệt |
| **Từ chối** (hiển thị) / `Reject` (code) | Lựa chọn không chấp thuận của Người phê duyệt; đề nghị chuyển trạng thái theo OQ-01, giữ nguyên lịch sử các cấp trước (FR-16). | **hủy** (khác — Hủy là hành động của Người tạo), không duyệt, bác bỏ | Phê duyệt, Hủy, Quyết định phê duyệt |
| **Hủy** (hiển thị) / `Cancel` (code) | Hành động của Người tạo (hoặc người có quyền hủy) đưa Đề nghị sang `Cancelled`, chỉ khi còn ở trạng thái hợp lệ (FR-10). | **từ chối** (khác — phía Người phê duyệt), xóa (dự án không có chức năng xóa đề nghị), reject | Từ chối, Đã hủy, Trạng thái |
| **Maker-Checker** | Nguyên tắc: Người tạo KHÔNG THỂ tự phê duyệt đề nghị của mình, chặn ở phía server kể cả gọi API trực tiếp (FR-15, NFR-02). | nguyên tắc 4 mắt, four-eyes principle (phải dùng đúng Maker-Checker), “tự phê duyệt được” | Người tạo, Người phê duyệt, Phê duyệt |
| **Lịch sử phê duyệt** / `ApprovalHistory` | Tập Quyết định phê duyệt theo cấp của một Đề nghị; bất biến, không chỉnh sửa được qua giao diện (FR-17). | lịch sử duyệt, audit log (rộng hơn — xem 3.7) | Quyết định phê duyệt, Nhật ký kiểm toán, Lịch sử nghiệp vụ |

### 3.5 Domain: Thực thi thanh toán & Ngân hàng

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Thực thi thanh toán** / `PaymentExecution` | Giai đoạn từ khi Đề nghị ở `Approved` đến khi Lệnh thanh toán đạt `Completed` / `Failed` / `Unknown` (FR-18 → FR-22). | xử lý thanh toán, chuyển khoản, settle | Lệnh thanh toán, Mock Bank Gateway, Trạng thái |
| **Lệnh thanh toán** / `PaymentOrder` | Bản ghi phía hệ thống gửi tới Bank Gateway abstraction để thực thi một Đề nghị đã `Approved`; mang Idempotency key; là đối tượng Treasury theo dõi (FR-18–23). | **giao dịch** (bị cấm — Giao dịch ngân hàng là khái niệm khác, xem 3.9), thanh toán (đứng một mình), giao dịch thanh toán, payment | Đề nghị thanh toán, Giao dịch ngân hàng, Idempotency key, Mock Bank Gateway |
| **Bank Gateway abstraction** / `IBankGateway` | Lớp trừu tượng bọc mọi lời gọi ngân hàng để hoán đổi adapter mà không sửa code nghiệp vụ (NFR-03). | Mock Bank Gateway (chỉ là adapter giả lập — khác), API ngân hàng (chung chung), bank gateway (khi nói abstraction) | Mock Bank Gateway, Lệnh thanh toán, Giao dịch ngân hàng |
| **Mock Bank Gateway** / `MockBankGateway` | Adapter giả lập duy nhất ở MVP: nhận Lệnh và trả kết quả (thành công / thất bại / timeout). Cách kích hoạt kịch bản lỗi chờ **OQ-09**. | ngân hàng giả lập (biến thể trong Scope — bị cấm), sandbox, fake bank, ngân hàng thật (không có ở MVP) | Bank Gateway abstraction, Lệnh thanh toán, Giao dịch ngân hàng |
| **Giao dịch ngân hàng** (hiển thị) / `BankTransaction` (code) | Bản giao dịch ở phía ngân hàng/gateway: sinh ra khi Lệnh thực thi thành công (được ghi Mã giao dịch) và là loại bản ghi nhập vào Đối soát. | **giao dịch** đứng một mình (bị cấm — chốt 05/10/2026), lệnh thanh toán, thanh toán, transaction (lỏng lẻo) | Lệnh thanh toán, Mã giao dịch, Giao dịch giả lập, Đối soát |
| **Giao dịch giả lập** / `SimulatedTransaction` | Các Giao dịch ngân hàng trong file mô phỏng được nhập vào để Đối soát; MVP không có ngân hàng thật nên mọi giao dịch đều là giả lập (FR-27). | dữ liệu mẫu, test data, demo data, giao dịch thật | Giao dịch ngân hàng, Đối soát, File đối soát |
| **Mã giao dịch** (hiển thị) / `TransactionId` (code) | Mã do ngân hàng trả về khi giao dịch thành công, lưu để truy vết (FR-20). | **idempotency key** (hoàn toàn khác — xem dòng dưới), mã lệnh, mã đề nghị | Giao dịch ngân hàng, Idempotency key, Lệnh thanh toán |
| **Idempotency key** / `IdempotencyKey` | Giá trị duy nhất gắn mỗi Lệnh thanh toán: mọi lần gửi trùng cùng key không tạo giao dịch mới tại gateway, kết quả chỉ ghi một lần (FR-19). ⚠ Thuật ngữ hạ tầng — không hiển thị cho P1–P5. | mã giao dịch, mã lệnh, request id | Lệnh thanh toán, Retry, Outbox, Mã giao dịch |
| **Mã lỗi** (hiển thị) / `ErrorCode` (code) | Mã từ gateway lưu khi Lệnh ở `Failed` (hoặc trong lúc tra soát), hiển thị cho Treasury (FR-20, FR-23). | lỗi (exception nội bộ là chuyện khác), error message (thông báo ≠ mã) | Failed, Tra soát, Lệnh thanh toán |
| **Tra soát** (hiển thị) / `TransactionInvestigation` (code) | Thao tác riêng lẻ của Treasury trên Lệnh `Failed`/`Unknown` để xác định kết quả thật; nội dung thao tác chờ **OQ-04**. | **đối soát** (khác — xem 3.6), kiểm tra, review | Đối soát, Failed, Unknown, Nhân viên ngân quỹ |
| **Kết quả giao dịch ngân hàng** (hiển thị) / `GatewayResult` (code) | Kết quả gateway trả về cho một Lệnh: thành công (kèm Mã giao dịch) hoặc thất bại (kèm Mã lỗi); dẫn tới `Completed`/`Failed` (FR-20). | kết quả đối soát (khác!), kết quả phê duyệt (khác!), response | Lệnh thanh toán, Giao dịch ngân hàng, Trạng thái |

### 3.6 Domain: Đối soát

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Đối soát** (hiển thị) / `Reconciliation` (code) | Đối chiếu file Giao dịch giả lập với các Lệnh thanh toán đã ghi để phát hiện Khớp hay Sai lệch; do Treasury thực hiện (FR-27, FR-28). | **đối chiếu** (dùng cho so sánh Hạn mức ở FR-06 — KHÔNG phải đối soát), tra soát (khác — xem 3.5), đối sánh | Kết quả đối soát, Khớp, Sai lệch, Tra soát |
| **Kết quả đối soát** / `ReconciliationResult` | Giá trị đối chiếu của từng bản ghi: Khớp hoặc Sai lệch; được lưu kèm thời điểm và người thực hiện. | kết quả giao dịch (khác!), kết quả thanh toán, kết quả | Đối soát, Khớp, Sai lệch |
| **Khớp** (hiển thị) / `Matched` (code) | Giao dịch giả lập tương ứng với Lệnh thanh toán theo tiêu chí; tiêu chí chờ **OQ-05**. | thành công, success, đúng | Kết quả đối soát, Sai lệch |
| **Sai lệch** (hiển thị) / `Discrepancy` (code) | Các trường hợp: giao dịch không có Lệnh, Lệnh không có giao dịch, lệch Số tiền (danh sách chờ **OQ-05**); được đánh dấu để Treasury xử lý. | lỗi đối soát, lỗi (khác với Mã lỗi), exception | Kết quả đối soát, Khớp, Tra soát |

### 3.7 Domain: Kiểm toán & Truy vết

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Nhật ký kiểm toán** (hiển thị) / `AuditLog` (code) | Bản ghi chỉ-append: ai, khi nào, đối tượng nào, thay đổi gì cho mọi thao tác nghiệp vụ quan trọng; không sửa/xóa được từ ứng dụng (FR-25, NFR-02). | log (chung chung), lịch sử nghiệp vụ (khác — là view hiển thị), access log | Lịch sử nghiệp vụ, Lịch sử phê duyệt, Truy vết |
| **Lịch sử nghiệp vụ** (hiển thị) / `BusinessHistory` (code) | Timeline hiển thị các sự kiện đã ghi của một đối tượng (Đề nghị/Lệnh) cho người có quyền; truy vết được từ Đối soát ngược về Đề nghị gốc (FR-26). | audit log (là dữ liệu ghi, không phải view), lịch sử phê duyệt (chỉ phần phê duyệt) | Nhật ký kiểm toán, Lịch sử phê duyệt, Truy vết |
| **Truy vết** (hiển thị) / `Traceability` (code) | Khả năng truy ngược: Kết quả đối soát → Lệnh thanh toán → Đề nghị → Quyết định phê duyệt → Người dùng, trong toàn bộ vòng đời (NFR-05). | logging (ghi log là hành động, truy vết là khả năng tra cứu), audit trail (dùng Nhật ký kiểm toán) | Nhật ký kiểm toán, Lịch sử nghiệp vụ, Đối soát |

### 3.8 Domain: Thuật ngữ hạ tầng (chỉ tài liệu kỹ thuật & code — KHÔNG hiển thị cho P1–P5)

> Theo ghi chú UX trong PRD: màn hình cho P1–P5 phải ẩn thuật ngữ hạ tầng. Cách diễn đạt thay thế cho UI do `docs/ux.md` chốt và **phải được thêm vào bảng này trước khi dùng** (mục 4).

| Thuật ngữ chuẩn | Định nghĩa | KHÔNG được gọi là | Thuật ngữ liên quan |
|---|---|---|---|
| **Idempotency** / `Idempotency` | Tính chất: gửi lại cùng một thao tác không sinh thêm tác dụng phụ; nền tảng cho “0 lệnh trùng” (FR-19, NFR-04). | retry (retry là hành động, idempotency là tính chất), “gửi một lần” | Idempotency key, Retry, Outbox |
| **Retry** / `Retry` | Cơ chế tự động gửi lại Lệnh có kiểm soát cho lỗi tạm thời; mọi retry vẫn qua Outbox + Idempotency key (FR-22). | gửi trùng (đó là sự cố phải chặn, không phải cơ chế), gửi lại thủ công | Idempotency, Outbox, Timeout, Lệnh thanh toán |
| **Timeout** / `Timeout` | Hết thời gian chờ phản hồi gateway → Lệnh chuyển `Unknown`, không tự gửi lại (FR-21). | lỗi mạng, mất kết nối, fail | Unknown, Retry, Tra soát |
| **Outbox** / `Outbox` | Cơ chế ghi cùng transaction các lệnh sẽ gửi đi; crash giữa chừng không làm mất lệnh (FR-22, NFR-04). | message queue, hàng đợi tin nhắn (khác cơ chế), bus | Retry, Idempotency key, Lệnh thanh toán |
| **Concurrency / optimistic concurrency** / `ConcurrencyStamp` (ABP) | Nhiều request thao tác cùng bản ghi được bảo vệ bằng token optimistic; request cũ bị từ chối thay vì ghi đè (NFR-04). | transaction (khác — transaction là tính nguyên tử, không phải chống ghi đè), lock, pessimistic lock | Trạng thái, Outbox, Ma trận chuyển trạng thái |
| **Unit of Work** / `IUnitOfWork` (ABP) | Mọi thao tác nghiệp vụ bọc trong một transaction; lỗi giữa chừng rollback toàn bộ, không để dữ liệu nửa vời (NFR-04). | transaction (dùng đơn lẻ thay thế), middleware, service | Concurrency, Nhật ký kiểm toán |
| **Modular Monolith** / `ModularMonolith` | Kiến trúc 1 ứng dụng chia module nghiệp vụ theo ABP; thêm module không sửa module cũ (NFR-03). | microservices (nằm ngoài phạm vi — Scope), monolith đơn giản, hệ thống phân tán | Multi-tenancy |

### 3.9 Đồng âm / dễ nhầm — phải tách biệt, không gộp chung 1 dòng

| # | Từ dễ nhầm | Cách tách (đã chốt hoặc đánh dấu) |
|---|-----------|----------------------------------|
| 1 | **“giao dịch”** | **Đã chốt 05/10/2026 — tách bạch:** “Giao dịch ngân hàng” (`BankTransaction`) chỉ bản giao dịch ở phía ngân hàng; **cấm dùng “giao dịch” đứng một mình**; “Hạn mức giao dịch” là thuật ngữ nguyên khối, “giao dịch” bên trong cụm đó KHÔNG chỉ bản giao dịch ngân hàng. |
| 2 | **“đối chiếu” vs “đối soát”** | FR-06 “đối chiếu Số tiền với Hạn mức” = phép so sánh khi xác định cấp phê duyệt — KHÔNG phải Đối soát. “Đối soát” chỉ chức năng đối chiếu hàng loạt file giao dịch (FR-27/28). |
| 3 | **“từ chối” vs “hủy” vs “xóa”** | Từ chối = quyết định của Người phê duyệt → trạng thái theo OQ-01. Hủy = hành động của Người tạo → `Cancelled`. Xóa = không có trong sản phẩm. |
| 4 | **“tra soát” vs “đối soát”** | Tra soát = xử lý riêng lẻ một Lệnh Failed/Unknown. Đối soát = đối chiếu hàng loạt file với Lệnh. Lệnh Failed/Unknown có thể cần cả hai. |
| 5 | **“người dùng” vs “thành viên”** | Người dùng = nói chung ở cấp quyền/audit. Thành viên = người dùng thuộc một Doanh nghiệp, đã gán vai trò. Không dùng thay nhau. |
| 6 | **“vai trò” vs “quyền”** | Vai trò = tập hợp quyền. Quyền = đơn vị kiểm tra lẻ ở server. |
| 7 | **“mã giao dịch” vs “idempotency key”** | Mã giao dịch = mã ngân hàng trả về (sau thành công). Idempotency key = do hệ thống sinh ra trước khi gửi lệnh. Không bao giờ dùng thay nhau. |
| 8 | **“đề nghị” vs “lệnh” vs “giao dịch ngân hàng”** | Quan hệ: Đề nghị (vòng đời phê duyệt, 8 trạng thái) → thực thi sinh ra Lệnh thanh toán (mang idempotency key) → thực thi thành công tương ứng một Giao dịch ngân hàng với Mã giao dịch; file Đối soát chứa Giao dịch giả lập. |
| 9 | **“trạng thái” vs “giai đoạn”** | Trạng thái = vòng đời Đề nghị/Lệnh (8 giá trị). Giai đoạn = tiến độ dự án (SM-05, `docs/status.md`). |
| 10 | **“trạng thái” của Đề nghị vs của Lệnh** | **[CẦN LÀM RỎ — OQ-01]:** PRD dùng chung từ “trạng thái” cho cả hai; chưa chốt Lệnh dùng chung enum 8 trạng thái hay bộ con riêng. Xem ghi chú dưới bảng 8 trạng thái (3.3). |

---

## 4. Quy tắc bổ sung thuật ngữ mới

> Khi implement phát sinh khái niệm nghiệp vụ mới chưa có trong bảng trên, **PHẢI thêm vào đây (đúng format 4 cột) TRƯỚC KHI dùng tên đó trong code hoặc UI**, không được tự đặt tên tạm rồi dùng luôn. Nếu có nhiều cách gọi hợp lý và cần chọn 1, ghi quyết định chọn tên vào `docs/decisions.md`.

Chi tiết:

1. Thêm vào đúng nhóm domain ở mục 3 (chưa có nhóm thì tạo mới) và cập nhật cột “Thuật ngữ liên quan” của các thuật ngữ bị ảnh hưởng.
2. Nếu từ mới là biến thể/đồng nghĩa của thuật ngữ đã có → KHÔNG thêm dòng mới, coi đó là **từ cấm** và bổ sung vào cột “KHÔNG được gọi là” của dòng đã có.
3. Nếu từ mới va chạm với thuật ngữ ở domain khác (đồng âm khác nghĩa) → xử lý như mục 3.9: tách biệt, ghi rõ trong bảng 3.9.
4. Các ô `[CẦN LÀM RỎ]` trong bảng (OQ-01, OQ-04, OQ-05, OQ-06, OQ-07, OQ-08, OQ-09) khi được trả lời: **cập nhật lại phần định nghĩa, KHÔNG đổi tên thuật ngữ** và bỏ dấu `[CẦN LÀM RỎ]`.
5. Ngược lại: mọi file sau này (`architecture.md`, `ux.md`, `conventions.md`, `status.md`) và mọi review code phải đối chiếu bảng này — dùng từ cấm = lỗi phải sửa.

## 5. Ghi chú về đa ngôn ngữ

1. **UI hiển thị tiếng Việt, code viết tiếng Anh.** Bảng này là **bảng map DUY NHẤT** giữa 2 ngôn ngữ: mỗi dòng cho sẵn “tên hiển thị (VI)” và “tên code (EN)” — **không được tự dịch khác đi ở bất kỳ đâu khác** trong dự án (code, comment, API docs, tài liệu, UI copy).
2. Dạng chuẩn của mọi thuật ngữ: `Tên hiển thị (VI)` / `TênCode` (EN). Khi 2 tên giống nhau (vd. “Phòng ban” / `Department` không giống) thì vẫn ghi đủ 2 dạng; khi muốn viết 1 dạng, dùng dạng đúng bối cảnh (VI trên UI, EN trong code).
3. **8 trạng thái:** mã (`Draft`, `Pending Approval`, …) là tên code canonical; tên hiển thị tiếng Việt lấy đúng theo bảng map ở mục 3.3 — không dịch lại theo cách khác ở bất kỳ màn hình nào.
4. **Thuật ngữ hạ tầng (mục 3.8)** không hiển thị cho persona P1–P5; nếu `ux.md` cần một cách diễn đạt thay thế cho UI, đó phải là thuật ngữ mới được bổ sung vào bảng này (mục 4) trước khi dùng.
5. Các quyết định chốt ngày 05/10/2026 (Đề nghị thanh toán, Trưởng phòng, Giám đốc tài chính (CFO), tách “giao dịch”, Doanh nghiệp/Tenant) là **bắt buộc vô điều kiện** — thay đổi chúng phải qua `docs/decisions.md`, không sửa ngầm trong file này.
