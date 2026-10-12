# PRD — PayFlow Enterprise

> **Nền tảng:** Nền tảng quản lý đề nghị thanh toán và phê duyệt nhiều cấp cho doanh nghiệp (Enterprise Payment & Approval Platform).
>
> **Ghi chú về đánh mã:** Các mã `FR-xx`, `NFR-xx`, `SM-xx`, `OQ-xx` trong tài liệu này là **mã ổn định**. `docs/architecture.md` và `docs/status.md` sẽ tham chiếu ngược lại các mã này; **không được đổi cách đánh mã hoặc tái sử dụng mã đã hủy** ở giữa chừng — nếu một FR bị loại, giữ lại mã và ghi trạng thái "removed", mã mới đánh tiếp tục.
>
> Các điểm thiếu thông tin trong input được đánh dấu ngay tại chỗ dạng `[CẦN LÀM RỎ: ...]` và được gom lại ở phần 7 (Open Questions). Không có giả định nào được ngầm chấp nhận nếu chưa được xác nhận.

---

## 1. Context & Problem Statement

### Bối cảnh hiện tại

Doanh nghiệp hiện quản lý đề nghị thanh toán bằng email, Excel hoặc các hệ thống nội bộ rời rạc. Mỗi công cụ giữ một phần của quy trình: email chứa yêu cầu và phê duyệt dưới dạng chữ ký/kèm file, Excel theo dõi trạng thái (nếu có người cập nhật), hệ thống ngân hàng thì tách hẳn bên ngoài.

### Vấn đề

Không có một nguồn sự kiện duy nhất (single source of truth) cho "đề nghị thanh toán này đang ở đâu, ai phải hành động tiếp". Hậu quả cụ thể:

- **Thất lạc yêu cầu:** email trôi trong inbox cá nhân, file Excel bị overwrite, không biết đề nghị nào bị bỏ quên.
- **Phê duyệt chậm:** không có cơ chế nhắc/không biết cấp nào đang giữ quyết định, quy trình phụ thuộc vào việc mọi người tự theo dõi.
- **Vượt hạn mức:** không có chỗ nào kiểm tra tập trung hạn mức trước khi lệnh được gửi đi.
- **Thiếu truy vết:** không xác định được ai đã phê duyệt cái gì, khi nào, dựa trên chứng từ nào — rủi ro kiểm toán và trách nhiệm giữa người tạo và người phê duyệt.
- **Lỗi tích hợp ngân hàng:** gọi API ngân hàng có thể timeout, gửi trùng lệnh khi retry, hoặc trả về trạng thái không xác định — nếu không có idempotency và mô hình trạng thái rõ ràng thì hoặc là mất tiền, hoặc là gửi trùng.

### Giải pháp (giới hạn trong phạm vi MVP)

PayFlow Enterprise là **modular monolith trên ABP Framework (.NET + Angular + PostgreSQL)**, multi-tenant (shared DB/shared schema), cung cấp:

1. Một nơi duy nhất để tạo/chỉnh sửa/hủy đề nghị thanh toán theo ma trận trạng thái hợp lệ.
2. Quy trình phê duyệt nhiều cấp dựa trên hạn mức/điều kiện nghiệp vụ, enforced bởi **Maker-Checker** (không ai tự phê duyệt đề nghị của mình).
3. Một **Bank Gateway abstraction** với **Mock Bank Gateway** cho giai đoạn MVP — gửi lệnh thanh toán có idempotency, xử lý retry/timeout/kết quả Unknown một cách an toàn.
4. Audit log và lịch sử phê duyệt bất biến (chỉ-append), cùng chức năng đối soát dữ liệu giao dịch giả lập để phát hiện sai lệch.

### Ranh giới quan trọng cần hiểu ngay từ đầu

- **Không có tiền thật:** MVP không chuyển tiền thật, không quản lý tiền của khách hàng, không phải core banking hay sổ cái kế toán.
- **Không có ngân hàng thật:** chỉ mock gateway; adapter thật là công việc của giai đoạn sau, chỉ được hoán đổi nhờ abstraction layer.
- **Không microservices, không Kubernetes:** kiến trúc là modular monolith chạy local bằng Docker Compose.
- **Ưu tiên backend:** bảo mật, transaction, concurrency, khả năng phục hồi phải xong trước khi mở rộng UI.

---

## 2. Đối tượng người dùng

| # | Persona | Hành vi chính | Mức độ am hiểu kỹ thuật (ảnh hưởng UX) |
|---|---------|---------------|----------------------------------------|
| P1 | **Nhân viên kế toán** | Tạo đề nghị thanh toán, đính kèm chứng từ, theo dõi trạng thái xử lý | Thấp–Trung bình: quen Excel, không hiểu thuật ngữ kỹ thuật (idempotency, outbox). UX phải hiển thị trạng thái bằng ngôn ngữ nghiệp vụ, form nhập rõ ràng, lỗi phải nói được "cần làm gì tiếp". |
| P2 | **Trưởng phòng / Quản lý bộ phận** | Kiểm tra thông tin, phê duyệt yêu cầu thuộc phạm vi phụ trách | Trung bình: am hiểu quy trình nội bộ, dùng web hàng ngày. Cần danh sách chờ phê duyệt ưu tiên, xem được chứng từ ngay khi quyết định. |
| P3 | **CFO / Người có thẩm quyền** | Phê duyệt giao dịch theo hạn mức và chính sách | Trung bình–Cao: hiểu nghiệp vụ tài chính, không necessarily kỹ thuật. Cần thấy đầy đủ ngữ cảnh (số tiền, cấp trước, hạn mức) trước khi quyết định; mọi thao tác của họ phải được audit. |
| P4 | **Nhân viên ngân quỹ / Treasury** | Theo dõi gửi lệnh thanh toán, kết quả giao dịch, xử lý tra soát | Cao: làm việc với trạng thái giao dịch, mã lỗi gateway. Cần view kỹ thuật (lệnh, mã lỗi, thời điểm), thao tác tra soát và đối soát. |
| P5 | **Quản trị viên doanh nghiệp (Tenant Admin)** | Quản lý thành viên, vai trò, phòng ban, cấu hình quy trình phê duyệt | Cao: hiểu cấu hình hệ thống. UX dạng trang cấu hình, thay đổi phải có hiệu lực ngay và được audit. |
| P6 | **Quản trị viên nền tảng (Platform Admin)** | Quản lý tenant và cấu hình vận hành cấp hệ thống | Rất cao: kỹ thuật nhất trong 6 persona. Thao tác ảnh hưởng toàn hệ thống nên cần xác nhận rõ và không được lẫn với dữ liệu nghiệp vụ của tenant. |

Ghi chú chung cho UX sau này: 5/6 persona đầu tư vào **nghiệp vụ, không phải kỹ thuật** — mọi màn hình phải ẩn thuật ngữ hạ tầng (outbox, idempotency key, concurrency token) và dịch nó sang ngôn ngữ trạng thái nghiệp vụ; persona P6 và P4 là ngoại lệ cần chi tiết kỹ thuật.

---

## 3. Phạm vi (Scope)

### Trong phạm vi (MVP)

- Quản lý tenant, người dùng, vai trò và quyền truy cập (multi-tenant shared DB/shared schema).
- Quản lý phòng ban, tài khoản thanh toán và hạn mức giao dịch.
- Tạo / xem / cập nhật / hủy đề nghị thanh toán theo trạng thái hợp lệ (8 trạng thái: Draft, Pending Approval, Approved, Processing, Completed, Failed, Unknown, Cancelled).
- Thiết lập quy trình phê duyệt nhiều cấp dựa trên hạn mức hoặc điều kiện nghiệp vụ.
- Cơ chế Maker-Checker: ngăn người tạo tự phê duyệt yêu cầu của mình.
- Gửi lệnh thanh toán qua **Mock Bank Gateway** qua Bank Gateway abstraction.
- Xử lý idempotency, concurrency, retry, timeout và kết quả giao dịch chưa định (Unknown).
- Lịch sử nghiệp vụ, audit log, lịch sử phê duyệt.
- Nhập dữ liệu giao dịch giả lập để đối soát và phát hiện sai lệch.
- API cho các chức năng nghiệp vụ + kiểm thử tự động: unit, integration, API security, concurrency.
- Công nghệ: C#/ASP.NET Core trên ABP Framework, PostgreSQL + EF Core, Angular, Docker Compose cho môi trường dev local; tận dụng module ABP (Identity, Permission Management, Tenant Management, Setting Management, Audit Logging).

### Ngoài phạm vi (không làm ở giai đoạn này)

- Thực hiện chuyển tiền thật hoặc trực tiếp quản lý tiền của khách hàng.
- Tích hợp production với nhiều ngân hàng hoặc hệ thống thanh toán thực tế (chỉ mock; adapter thật để giai đoạn sau).
- Xây dựng Core Banking, sổ cái kế toán hoặc hạch toán kép.
- Workflow designer dạng kéo-thả phức tạp.
- Kiến trúc microservices ngay từ đầu.
- Triển khai Kubernetes hoặc hạ tầng phân tán quy mô lớn.
- Hệ thống AI phát hiện gian lận hoặc chấm điểm rủi ro.
- Ứng dụng mobile native.
- Báo cáo tài chính chuyên sâu và BI nâng cao.

---

## 4. Functional Requirements (FR)

Mỗi FR mô tả một hành vi quan sát được: người dùng làm gì → hệ thống phản hồi gì.

### A. Tenancy, người dùng, phân quyền

| Mã | Hành vi |
|----|---------|
| **FR-01** | Platform Admin tạo/kích hoạt/vô hiệu hóa một tenant. Sau khi tạo, mọi bản ghi nghiệp vụ mới được gắn tenant đó; request mang tenant khác (hoặc không hợp lệ) gọi tới dữ liệu của tenant → hệ thống từ chối truy cập (403/404 như appropriate), không trả về dữ liệu chéo tenant dưới mọi trường hợp. |
| **FR-02** | Tenant Admin thêm/mới thành viên và gán vai trò (theo nhóm persona P1–P5) **trong phạm vi tenant của mình**; người dùng được gán vai trò nhận đúng quyền của vai trò đó, người ngoài tenant không quản lý được thành viên kia. *[CẦN LÀM RỎ: danh sách vai trò chuẩn và ma trận quyền chi tiết — input chỉ nêu 6 persona, chưa chốt tên vai trò và permission mapping]* |
| **FR-03** | Với mọi API nghiệp vụ, hệ thống kiểm tra quyền ở **phía server**: request của user không có quyền tương ứng → từ chối với lỗi phân quyền, thao tác không được thực thi (không phụ thuộc việc UI có ẩn nút hay không). *[CẦN LÀM RỎ: ma trận quyền chi tiết cho từng vai trò]* |
| **FR-04** | Tenant Admin quản lý phòng ban (tạo, sửa, gán thành viên); mỗi đề nghị thanh toán được gắn với phòng ban của người tạo và hiển thị trong phạm vi quyền theo phòng ban đó. |

### B. Cấu hình nghiệp vụ (tài khoản thanh toán, hạn mức)

| Mã | Hành vi |
|----|---------|
| **FR-05** | Tenant Admin quản lý danh sách tài khoản thanh toán của doanh nghiệp (thêm/sửa/xem trong tenant mình); tài khoản được chọn làm tài khoản trả trong đề nghị thanh toán. |
| **FR-06** | Tenant Admin cấu hình hạn mức giao dịch; khi một đề nghị được gửi đi, hệ thống đối chiếu số tiền đề nghị với hạn mức để quyết định cấp phê duyệt cần thiết. *[CẦN LÀM RỎ: hạn mức được định nghĩa theo đơn vị gì (mỗi cấp phê duyệt? theo phòng ban? theo tài khoản?), và số cấp phê duyệt tối đa]* |

### C. Đề nghị thanh toán (CRUD theo trạng thái)

| Mã | Hành vi |
|----|---------|
| **FR-07** | Nhân viên kế toán tạo đề nghị (số tiền, tài khoản thụ hưởng, tài khoản trả, nội dung, chứng từ đính kèm) → hệ thống lưu ở trạng thái **Draft**, ghi nhận người tạo và thời điểm. *[CẦN LÀM RỎ: cơ chế lưu chứng từ đính kèm — nơi lưu trữ, giới hạn dung lượng/định dạng]* |
| **FR-08** | Người tạo gửi đề nghị (submit) → hệ thống chuyển sang **Pending Approval**, đồng thời tự xác định quy trình phê duyệt nhiều cấp áp dụng cho đề nghị đó dựa trên hạn mức/điều kiện nghiệp vụ đã cấu hình. |
| **FR-09** | Người tạo yêu cầu cập nhật đề nghị → hệ thống cho phép chỉ khi đề nghị đang ở trạng thái hợp lệ; ở trạng thái không hợp lệ → từ chối với thông báo rõ ràng. *[CẦN LÀM RỎ: ma trận trạng thái nào được phép cập nhật]* |
| **FR-10** | Người tạo (hoặc người có quyền hủy) yêu cầu hủy đề nghị → hệ thống chuyển sang **Cancelled** chỉ khi ở trạng thái hợp lệ; từ chối ở trạng thái không cho phép hủy. *[CẦN LÀM RỎ: ma trận trạng thái nào được phép hủy — đặc biệt sau Approved nhưng trước khi thực thi]* |
| **FR-11** | Người dùng yêu cầu xem danh sách/chi tiết đề nghị → hệ thống chỉ trả về đề nghị trong phạm vi quyền của họ (theo vai trò, phòng ban, tenant); vượt phạm vi → không thấy trong danh sách và không truy cập được khi gọi trực tiếp theo ID. |
| **FR-12** | Hệ thống duy nhất 8 trạng thái: Draft → Pending Approval → Approved → Processing → Completed / Failed / Unknown / Cancelled. Bất kỳ thao tác nào gây chuyển trạng thái không hợp lệ (gọi API trực tiếp, request đồng thời) → bị từ chối, trạng thái dữ liệu không thay đổi. *[CẦN LÀM RỎ: ma trận chuyển trạng thái đầy đủ — input chỉ liệt kê trạng thái, chưa nêu từng cạnh chuyển; gồm cả quy tắc: từ chối (reject) đưa đề nghị về trạng thái gì]* |

### D. Phê duyệt nhiều cấp & Maker-Checker

| Mã | Hành vi |
|----|---------|
| **FR-13** | Khi đề nghị ở **Pending Approval**, hệ thống xác định thứ tự các cấp phê duyệt; cấp kế chỉ nhận quyết định sau khi cấp trước đã **Phê duyệt** — gọi thẳng API phê duyệt cấp kế khi cấp trước chưa xong → bị từ chối. |
| **FR-14** | Người phê duyệt ở cấp của mình chọn **Phê duyệt** hoặc **Từ chối** cho một đề nghị → hệ thống ghi nhận người quyết định, thời điểm, kết quả và cấp tương ứng vào lịch sử phê duyệt. *[CẦN LÀM RỎ: lý do từ chối có bắt buộc nhập không?]* |
| **FR-15** | **Maker-Checker:** một người dùng muốn phê duyệt một đề nghị mà chính mình đã tạo → hệ thống từ chối ở phía server (dù người đó có quyền phê duyệt); kiểm tra này phải được xác minh bằng test tự động gọi API. |
| **FR-16** | Từ chối phê duyệt → đề nghị chuyển sang trạng thái theo quy tắc (xem FR-12) và toàn bộ lịch sử phê duyệt các cấp trước đó vẫn được giữ nguyên, xem lại được. *[CẦN LÀM RỎ: trạng thái đích sau khi từ chối]* |
| **FR-17** | Người dùng có quyền xem chi tiết đề nghị → hiển thị đầy đủ lịch sử phê duyệt: cấp nào, ai quyết định, khi nào, kết quả gì; lịch sử không chỉnh sửa được qua giao diện. |

### E. Thực thi thanh toán (Bank Gateway)

| Mã | Hành vi |
|----|---------|
| **FR-18** | Đề nghị đạt **Approved** → hệ thống tạo lệnh thanh toán và gửi qua **Bank Gateway abstraction** (Mock adapter). *[CẦN LÀM RỎ: tự động gửi ngay khi Approved, hay chờ thao tác xác nhận của Treasury — input mô tả Treasury "theo dõi việc gửi lệnh", chưa nêu ai chủ động]* |
| **FR-19** | Mỗi lệnh thanh toán mang **idempotency key**; bất kỳ lần gửi trùng lặp nào (retry, request lặp, event chạy lại) với cùng key đều **không** tạo thêm giao dịch mới tại gateway, và kết quả cuối cùng chỉ được ghi nhận một lần vào hệ thống. Tính năng này phải được chứng minh bằng test concurrency. |
| **FR-20** | Khi gửi lệnh thành công nhưng chưa có kết quả → trạng thái **Processing**; nhận kết quả thành công từ gateway → **Completed** kèm mã giao dịch; nhận kết quả thất bại → **Failed** kèm mã lỗi/lý do từ gateway. |
| **FR-21** | Gọi gateway hết thời gian chờ (timeout) hoặc phản hồi không xác định được → chuyển đề nghị/lệnh sang **Unknown** và **không tự động gửi lại lệnh** cho đến khi xác định được trạng thái thật; hệ thống phải có cơ chế xác định lại trạng thái. *[CẦN LÀM RỎ: thời gian timeout; cơ chế xác định lại trạng thái — poll gateway, tra qua đối soát, hay thao tác tay của Treasury]* |
| **FR-22** | Lỗi tạm thời (transient) từ gateway → hệ thống **retry có kiểm soát**; mỗi lần retry vẫn đi qua outbox + idempotency key, nên crash giữa chừng không làm mất lệnh và không thực thi trùng. *[CẦN LÀM RỎ: số lần retry tối đa và chính sách backoff]* |
| **FR-23** | Treasury xem danh sách lệnh thanh toán theo trạng thái và chi tiết kết quả (kèm mã lỗi, thời điểm); thực hiện thao tác tra soát trên các lệnh **Failed/Unknown**. *[CẦN LÀM RỎ: thao tác tra soát cụ thể cho phép cập nhật gì (gõ lại kết quả thật, gắn ghi chú, hủy bỏ?) và trạng thái sau tra soát]* |
| **FR-24** | Để demo được các tình huống lỗi (timeout, failed, unknown), Mock Bank Gateway phải có cách kích hoạt được các kịch bản lỗi đó trong môi trường dev. *[CẦN LÀM RỎ: cơ chế điều khiển lỗi của mock — input yêu cầu demo "xử lý an toàn các tình huống lỗi" nhưng chưa mô tả cách gây lỗi]* |

### F. Audit & truy vết

| Mã | Hành vi |
|----|---------|
| **FR-25** | Với mọi thao tác nghiệp vụ quan trọng (tạo/sửa/hủy đề nghị, gửi đề nghị, quyết định phê duyệt, gửi lệnh thanh toán, đối soát), hệ thống ghi audit log gồm: ai, khi nào, đối tượng nào, thay đổi gì; log chỉ-append — không có chức năng sửa/xóa log từ ứng dụng. |
| **FR-26** | Người dùng có quyền xem lịch sử nghiệp vụ của một đối tượng (đề nghị/lệnh) → hiển thị timeline các sự kiện đã ghi, truy vết được từ kết quả đối soát ngược về đề nghị gốc và người phê duyệt. |

### G. Đối soát

| Mã | Hành vi |
|----|---------|
| **FR-27** | Người có quyền (Treasury) nhập file dữ liệu giao dịch giả lập → hệ thống đối chiếu với các lệnh thanh toán đã ghi và trả về kết quả: **khớp** hoặc **sai lệch**. *[CẦN LÀM RỎ: tiêu chí khớp — theo mã giao dịch/idempotency key, số tiền, thời gian, hay kết hợp]* |
| **FR-28** | Hệ thống liệt kê các giao dịch sai lệch (giao dịch không có lệnh tương ứng, lệnh không có giao dịch, sai lệch số tiền — *[CẦN LÀM RỎ: danh sách loại sai lệch cần phát hiện]*) và đánh dấu để Treasury xử lý; kết quả đối soát được lưu lại kèm thời điểm và người thực hiện. |

### H. API & kiểm thử

| Mã | Hành vi |
|----|---------|
| **FR-29** | Mọi chức năng nghiệp vụ ở trên đều được cung cấp qua API HTTP (REST) có tài liệu; gọi API phải đi qua phân quyền và cô lập tenant giống hệt giao diện. |
| **FR-30** | Bộ kiểm thử tự động tồn tại và chạy được bằng lệnh chuẩn (local/CI) cho các nhóm: unit test, integration test (EF Core), API security test (phân quyền, cô lập tenant), concurrency test (đồng thời, idempotency); chạy mà fail ⇒ không đạt tiêu chí phát hành. |

---

## 5. Non-Functional Requirements (NFR)

### NFR-01 — Hiệu năng

*(Số liệu cụ thể; input không nêu mục tiêu — các con số dưới đây là đề xuất cần xác nhận.)*

- Độ trễ API đọc/danh sách (phân trang, có phân quyền + lọc tenant): **P95 ≤ 500 ms**. *[CẦN LÀM RỎ: mục tiêu hiệu năng — input không nêu; xác nhận hoặc thay con số]*
- Độ trễ thao tác nghiệp vụ (tạo đề nghị, quyết định phê duyệt, gửi lệnh): **P95 ≤ 1.000 ms** — kết quả xử lý bất đồng bộ (gửi gateway, retry) **không được chặn request API chính**.
- Chịu tải tham chiếu (môi trường Docker Compose 1 host, dùng để đo): **50 người dùng đồng thời**, dữ liệu tham chiếu **≥ 10.000 đề nghị** cho mỗi tenant lớn nhất mà không giảm dưới các ngưỡng trên. *[CẦN LÀM RỎ: quy mô kỳ vọng — số tenant, số user đồng thời, số bản ghi để chốt số liệu]*

### NFR-02 — Bảo mật (mức tối thiểu chấp nhận được)

- **Phân quyền phía server:** 100% API nghiệp vụ có kiểm tra authorization; bộ API security test phải chứng minh mọi truy cập không hợp lệ bị từ chối — **0 trường hợp thành công** trong các test gọi chéo tenant hoặc gọi bằng vai trò sai.
- **Maker-Checker enforced server-side:** 100% test scenario tự phê duyệt (kể cả gọi API trực tiếp, bỏ qua UI) đều bị chặn.
- **Cô lập tenant:** không có đường nào đọc/ghi dữ liệu tenant khác — kể cả qua ID đoán đúng (IDOR), tham số filter, hay request song song; xác minh bằng test tự động.
- **Bí mật hệ thống:** không lưu credential/chuỗi kết nối nhạy cảm trong repo; cấu hình secret lấy từ nguồn ngoài version control.
- **Audit bất biến:** không có API nào cho phép sửa/xóa audit log và lịch sử phê duyệt.
- Yêu cầu bảo mật bổ sung ngoài các điều trên (HTTPS/TLS ở môi trường demo, chính sách mật khẩu/MFA, rate limiting, thời gian khóa tài khoản): *[CẦN LÀM RỎ: input chưa nêu — cần chốt mức tối thiểu cho MVP]*

### NFR-03 — Khả năng mở rộng

- **Mở rộng theo module:** kiến trúc Modular Monolith theo ABP — thêm module nghiệp vụ mới không sửa code module hiện có; phụ thuộc giữa module qua contract/extension point, không tham chiếu trực tiếp lung tung.
- **Mở rộng tenant:** thêm tenant mới chỉ bằng thao tác quản trị (dữ liệu/cấu hình), không cần đổi code; thiết kế chung đủ cho quy mô *[CẦN LÀM RỎ: số tenant và số user dự kiến — đề xuất 100 tenant / 1.000 user]* mà không phải đổi kiến trúc hay chuyển schema.
- **Thay thế gateway:** nhờ Bank Gateway abstraction, thay Mock adapter bằng adapter ngân hàng thật bằng cách thêm implementation của abstraction đó — **không sửa code nghiệp vụ** (domain/application layer giữ nguyên).
- **Đường mở rộng hạ tầng:** multi-tenancy bắt đầu bằng shared database/shared schema nhưng được tổ chức (EF Core, filter tenant) để có thể chuyển sang dedicated schema/database về sau mà không viết lại nghiệp vụ.

### NFR-04 — Độ tin cậy & nhất quán dữ liệu

- **Không mất, không trùng lệnh:** 0 trường hợp mất lệnh thanh toán hay thực thi trùng trong các test crash/retry/concurrency (mọi lệnh đi qua outbox + idempotency key + optimistic concurrency). Đây là ngưỡng chấp nhận: **0**.
- **Tính nguyên tử:** mọi thao tác nghiệp vụ qua ABP Unit of Work + transaction — lỗi giữa chừng phải rollback toàn bộ, không để dữ liệu nửa vời (ví dụ: đề nghị Approved nhưng không có lệnh, hoặc lệnh ghi mà không có audit).
- **Không transition sai:** 0 trường hợp dữ liệu kết thúc ở trạng thái vi phạm ma trận trạng thái khi chạy các test concurrency (nhiều request cùng thao tác trên cùng bản ghi).
- **Phục hồi trạng thái Unknown:** mọi lệnh vào Unknown phải hội tụ về Completed/Failed/[CẦN LÀM RỎ: trạng thái đích khác nếu có] trong thời gian tối đa *[CẦN LÀM RỎ: thời gian hội tụ — gắn với chính sách timeout/retry của FR-21/FR-22]*.
- **Uptime/availability:** *[CẦN LÀM RỎ: input không nêu mục tiêu availability — MVP chạy local bằng Docker nên cần xác nhận có cần SLA/RPO/RTO hay đặt mục tiêu "không mất dữ liệu khi process crash" là đủ]*

### NFR-05 — Truy vết & lưu trữ

- Mọi hành động nghiệp vụ quan trọng phải truy ngược được: audit log → người dùng → đề nghị → quyết định phê duyệt → lệnh thanh toán → kết quả đối soát, trong toàn bộ vòng đời dữ liệu.
- Thời gian lưu giữ audit log và lịch sử phê duyệt: *[CẦN LÀM RỎ: input chưa nêu chính sách retention — cần ít nhất một mức tối thiểu cho yêu cầu kiểm toán]*

### NFR-06 — Môi trường & vận hành

- Toàn bộ hệ thống chạy được hoàn toàn **local bằng Docker Compose**, không phụ thuộc Internet hay dịch vụ cloud trả phí trong quá trình dev/test (đúng ngân sách open-source của dự án).
- Khởi tạo môi trường mới tái lập được: migration + seed dữ liệu chạy bằng một lệnh chuẩn (DbMigrator); không có bước cấu hình thủ công ngoài tài liệu.
- Bộ test (unit, integration, API security, concurrency) chạy được trên máy dev với một lệnh chuẩn, không cần hạ tầng riêng.

---

## 6. Success Metrics

Làm sao biết dự án thành công — tất cả đều đo được:

| Mã | Tiêu chí | Cách đo |
|----|----------|---------|
| **SM-01** | **Demo end-to-end hoàn chỉnh:** một quy trình thanh toán giả lập chạy trọn vẹn: tạo đề nghị → phê duyệt nhiều cấp (nhiều người khác nhau, có Maker-Checker) → thực thi qua mock gateway → đối soát. | Chạy kịch bản demo chuẩn, không lỗi, không can thiệp DB tay. Đây là **điều kiện nghiệm thu chính** của MVP. |
| **SM-02** | **Cô lập tenant được chứng minh:** 0 lỗi trong toàn bộ API security test về phân quyền và truy cập chéo tenant. | Bộ test `API security test` xanh 100%; fail ⇒ không nghiệm thu. |
| **SM-03** | **An toàn khi lỗi:** các tình huống timeout, gửi trùng, kết quả Unknown đều hội tụ đúng trạng thái, 0 lệnh bị thực thi trùng / 0 dữ liệu nửa vời. | Bộ `concurrency + idempotency + fault-injection` test xanh 100%, đối chiếu với FR-19/FR-21/FR-22. |
| **SM-04** | **Phủ kiểm thử:** mọi FR-01 → FR-30 có ít nhất một test case trực tiếp (unit/integration/API); NFR-02 và NFR-04 có test tự động chứng minh. | Bảng truy vết FR ↔ test trong `docs/status.md`; 100% FR được phủ. |
| **SM-05** | **Đúng hạn 8 tuần:** MVP giao đúng lịch; mỗi giai đoạn có deliverable + tiêu chí nghiệm thu được nghiệm thu khi kết thúc giai đoạn. | Số giai nghiệm thu đúng hạn = tổng số giai đoạn. *[CẦN LÀM RỎ: cách chia 8 tuần thành các giai đoạn cụ thể và tiêu chí từng giai đoạn]* |
| **SM-06** | **Môi trường tái lập:** `docker compose up` dựng được toàn bộ hệ thống (API + Angular + PostgreSQL + migrator) trên máy dev sạch và demo được SM-01 mà không cần dịch vụ ngoài. | Thử trên máy sạch theo tài liệu setup; thời gian dựng ≤ *[CẦN LÀM RỎ: ngưỡng thời gian setup chấp nhận được — đề xuất 30 phút]* |

---

## 7. Open Questions

Toàn bộ điểm `[CẦN LÀM RỎ]` đã đánh dấu ở trên, gom lại một chỗ. **Không được tự điền giả định vào các chỗ này mà chưa được xác nhận** — khi trả lời, ghi chú lại vào đúng FR/NFR tương ứng.

| Mã | Câu hỏi | Ảnh hưởng tới |
|----|---------|----------------|
| **OQ-01** | **Ma trận chuyển trạng thái đầy đủ:** liệt kê chính xác từng cạnh chuyển hợp lệ giữa 8 trạng thái; trạng thái nào được phép cập nhật/hủy; từ chối (reject) đưa đề nghị về Draft hay Cancelled; sau Approved nhưng trước Processing có cho hủy không? | FR-09, FR-10, FR-12, FR-16 |
| **OQ-02** | **Ai chủ động gửi lệnh thanh toán:** tự động ngay khi Approved, hay Treasury xác nhận rồi mới gửi? | FR-18 |
| **OQ-03** | **Chính sách timeout/retry:** thời gian timeout gọi gateway là bao lâu, số lần retry tối đa, backoff thế nào, và cơ chế xác định lại trạng thái cho lệnh Unknown (poll gateway / tra đối soát / thao tác tay)? Thời gian hội tụ tối đa của Unknown? | FR-21, FR-22, NFR-04 |
| **OQ-04** | **Tra soát:** các thao tác cụ thể Treasury được làm trên lệnh Failed/Unknown (cập nhật kết quả thật? gắn ghi chú? hủy?), và trạng thái sau tra soát là gì? | FR-23 |
| **OQ-05** | **Đối soát:** tiêu chí "khớp" là gì (mã giao dịch/idempotency key, số tiền, thời gian?) và danh sách loại sai lệch cần phát hiện? | FR-27, FR-28 |
| **OQ-06** | **Vai trò & phân quyền:** chốt danh sách vai trò chuẩn (tên gọi) và ma trận quyền cho từng vai trò — input mới chỉ mô tả theo persona. | FR-02, FR-03, NFR-02 |
| **OQ-07** | **Hạn mức & cấp phê duyệt:** hạn mức được định nghĩa theo đơn vị gì (mỗi cấp? theo phòng ban? theo tài khoản?) và số cấp phê duyệt tối đa? | FR-06, FR-08, FR-13 |
| **OQ-08** | **Chứng từ đính kèm:** lưu ở đâu (local disk / blob storage của ABP), giới hạn dung lượng và định dạng file? | FR-07 |
| **OQ-09** | **Gây lỗi để demo:** Mock Bank Gateway được điều khiển như thế nào để kích hoạt kịch bản timeout/failed/unknown khi demo nghiệm thu? | FR-24, FR-21, FR-22, SM-01 |
| **OQ-10** | **Mục tiêu hiệu năng & quy mô:** xác nhận (hoặc thay) các con số đề xuất ở NFR-01 (P95 500ms/1000ms, 50 user đồng thời, 10k bản ghi) và NFR-03 (100 tenant / 1.000 user). | NFR-01, NFR-03 |
| **OQ-11** | **Availability:** MVP chạy local Docker — có cần mục tiêu uptime/RPO/RTO chính thức không, hay chỉ cần "không mất/không trùng dữ liệu khi crash"? | NFR-04 |
| **OQ-12** | **Bảo mật bổ sung & retention:** có bắt buộc HTTPS/TLS, MFA, rate limiting cho MVP không? Audit log và lịch sử phê duyệt giữ trong bao lâu? | NFR-02, NFR-05 |
| **OQ-13** | **Lý do từ chối:** khi Từ chối phê duyệt, có bắt buộc người phê duyệt nhập lý do không? | FR-14 |
| **OQ-14** | **Kế hoạch 8 tuần:** chia 8 tuần thành những giai đoạn nào, deliverable và tiêu chí nghiệm thu từng giai đoạn là gì? | Success Metrics SM-05 |
| **OQ-15** | **Ngưỡng setup:** thời gian dựng môi trường demo trên máy sạch tối đa chấp nhận được (đề xuất ≤ 30 phút)? | SM-06 |
