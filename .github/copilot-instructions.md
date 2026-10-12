# Copilot Instructions — PayFlow Enterprise

> GitHub Copilot tự động đọc file này ở gốc repository mỗi session.
> Nội dung là lệnh trực tiếp cho agent — tuân theo chặt chẽ, không viết theo văn phong giải thích.

---

## 0. File docs bắt buộc — đọc trước khi làm bất cứ task gì

Trước khi bắt đầu bất kỳ task nào (viết code mới, sửa bug, refactor, viết test, chỉnh file
carefully chosen `docs/**/*.md`), agent **bắt buộc đọc các file sau**:

- `docs/prd.md` — **phần FR/NFR liên quan đến task** đang làm. Đây là ranh giới phạm vi của chuyện này.
- `docs/domain-glossary.md` — **đọc TOÀN BỘ**, không chỉ phần liên quan. Bất kỳ task nào chạm vào
  khái niệm nghiệp vụ đều cần đúng thuật ngữ gốc, dù chỉ là label UI, tên biến, class entity,
  tên bảng, comment, response key.
- `docs/architecture.md` — **phần module/component liên quan** đến task (nằm ở layer nào,
  contract API nào, boundary nào).
- `docs/conventions.md` — **đọc TOÀN BỘ**. Áp dụng rule naming, structure, test placement, code style
  cho toàn bộ change, kể cả những phần không trực tiếp liên quan.
- `docs/status.md` — **phase hiện tại** đang sống, **Deferred Work** để không trùng vào việc đã
  được cố ý hoãn, **Blocker log** để biết chuyện gì đang chặn bạn trước khi nói "xong".
- `docs/decisions.md` — **rà cả file** xem có decision cũ nào liên quan đến task này không. Nếu có,
  tuân theo, không đi ngược lại không biết. Context có thể đã đổi giữa các session; không
  dựa vào ký ức session trước.

### Bắt buộc đọc thêm — tuân theo strict

- Nếu task có liên quan đến **giao diện** (tạo màn hình, sửa màn hình, component, form,
  kế hoạch UI pattern, viết UI copy…), **BẮT BUỘC đọc thêm `docs/ux.md` trước khi code**.
  Không tự sáng tạo pattern UI khác với đã định nghĩa trong đó.
- Nếu task liên quan đến **build / deploy / release / CI-CD / cấu hình orchestrator**, **BẮT BUỘC
  đọc thêm `docs/deploy.md` trước khi thực hiện bất kỳ bước nào**.

### Kiểm tra tiền đề — dừng lại nếu thiếu

Nếu **bất kỳ file nào trong 9 file sau** không tồn tại hoặc có nội dung trống khi lẽ ra phải có:

- `docs/prd.md`
- `docs/domain-glossary.md`
- `docs/decisions.md`
- `docs/architecture.md`
- `docs/ux.md`
- `docs/deploy.md`
- `docs/conventions.md`
- `docs/status.md`
- `copilot-instructions.md` (chính file này)

thì **DỪNG LẠI**, báo cho người dùng ngay (liệt kê file nào thiếu/trống, tại sao lẽ ra phải có),
**không tự suy diễn nội dung thay thế**.

---

## 1. Definition of Done — task XONG khi và chỉ khi đủ 3 tầng test

Một task được coi là **hoàn thành (xanh)** khi **đồng thời có và pass** cả 3 tầng test sau,
tương ứng với phạm vi thay đổi:

- **(a) Unit test** — cho bất kỳ logic mới hoặc logic đã sửa (domain rule, service method,
  helper, البنية tính toán…).
- **(b) Integration test** — cho luồng liên quan đến dữ liệu/component được thay đổi (repository
  query, pipeline, domain event, integration boundary).
- **(c) E2E test** — cho hành vi người dùng cuối **nếu task ảnh hưởng đến luồng user-facing** mà
  người dùng có thể nhìn thấy/thao tác được.

Thiếu **1 trong 3 tầng test** (mà tầng đó **áp dụng được** cho loại thay đổi này) thì task
**CHƯA xong**. Khi báo kết quả, phải nói rõ:

- task đã hoàn thành những tầng nào,
- **thiếu tầng test nào** (nếu có),
- lý do nếu có tầng thực sự không áp dụng được.

**Không được báo “hoàn thành” khi chưa đủ tầng test áp dụng.**

---

## 2. Quy trình sau khi hoàn thành 1 task — làm đúng thứ tự

Sau khi code/test hoàn tất, agent **bắt buộc** làm đủ thứ tự sau trước khi báo:

1. **Chạy đủ 3 tầng test** (unit / integration / e2e) và **xác nhận pass**. Không báo pass nếu
   chỉ vừa chạy xylem hoặc chạy một subset không đại diện.
2. **Tick vào checklist tương ứng trong `docs/status.md`** — ghi xong task thực sự, cập nhật trạng thái
   phase/hạng mục nếu cần.
3. **Thêm vào Deferred Work trong `docs/status.md`** bất kỳ việc nào **bị hoãn lại trong quá trình
   làm**   (không làm hôm nay vì lý do thực tế), kèm: việc gì / tại sao / mốc quay lại. Không bỏ
   im lặng việc hoãn.
4. **Review code vừa viết** theo checklist trong `docs/conventions.md` trước khi báo kết quả cho
   người dùng.

---

## 3. Quy tắc ghi quyết định vào `docs/decisions.md`

Mỗi khi phải **chọn giữa nhiều cách làm đều hợp lý**, agent bắt buộc ghi 1 entry mới vào
`docs/decisions.md` **trước khi báo hoàn thành task**, theo đúng format đã định nghĩa trong file
đó (Context / Options / Decision / Rationale / Trade-off / Status):

- Chọn thư viện / framework cho 1 vai trò.
- Đổi cách tiếp cận so với `docs/architecture.md` ban đầu.
- Chọn giải pháp cho vấn đề **chưa có tiền lệ** trong dự án.
- Quyết định **bỏ qua 1 best practice** vì lý do thực tế hiển nhiên.

Viết **TRƯỚC khi báo done**, không gộp lại ghi sau (sẽ quên lý do thật).

Việc nhỏ **không ảnh hưởng người khác** (tên biến, inline format code, refactoring local không
đổi contract…) **không cần ghi decision** — tuân theo đúng ngưỡng đã định nghĩa trong
`docs/decisions.md`.

---

## 4. Quy tắc kỷ luật thuật ngữ nghiệp vụ (`docs/domain-glossary.md`)

Mọi thứ đại diện cho 1 khái niệm nghiệp vụ phải truy ngược được về **đúng 1 entry trong
`docs/domain-glossary.md`**:

- Tên biến / class / entity / bảng dữ liệu.
- Label UI, copy, message, response key, enum value.
- Comment đại diện cho khái niệm nghiệp vụ (không phải comment kỹ thuật thuần).

Nếu task cần **1 khái niệm nghiệp vụ chưa có trong glossary**, agent **bắt buộc bổ sung vào
`docs/domain-glossary.md` TRƯỚC khi viết code hoặc dùng tên đó trong UI copy**, đúng format
đã định nghĩa: thuật ngữ chuẩn / định nghĩa / không được gọi là / thuật ngữ liên quan.

**Tuyệt đối không:**
- Tự đặt tên tạm rồi dùng ngay.
- Tự dịch hoặc diễn đạt khác đi so với glossary dù chỉ là viết tắt hay đồng nghĩa.
- Dùng từ đồng nghĩa không có trong glossary cho entity/names/public-facing text.

Nếu **phát hiện code/UI hiện tại đang dùng tên khác với glossary** (do task trước tạo ra, hoặc
do phát hiện lỗi), agent **phải báo cho người dùng và hỏi**:
- Có nên đổi lại tên code/UI cho khớp glossary?
- Hay cập nhật glossary theo tên hiện có?

**Không tự ý sửa hàng loạt** không hỏi.

---

## 5. Quy tắc khi implement giao diện

Mọi màn hình / component mới phải **khớp với** những gì đã định nghĩa trong `docs/ux.md`:

- Nguyên tắc thiết kế chung.
- Design token (màu, typography, spacing, hiệu ứng…).
- Component pattern đã có.

**Nếu task cần 1 pattern UI chưa có trong `docs/ux.md`:**
- Bổ sung vào `docs/ux.md` trước.
- Nếu đây là lựa chọn đáng kể, ghi lý do vào `docs/decisions.md`.

Tự tạo pattern rời rạc riêng cho từng màn hình là **không được**, kể cả khi pattern đó “không
bị lỗi”.

---

## 6. Quy tắc khi thực hiện deploy / release

Must follow `docs/deploy.md` theo đúng thứ tự đã định. Tuyệt đối không tự ý:

- Deploy lên **production** khi chưa có xác nhận rõ ràng từ người dùng **trong phiên làm việc
  hiện tại**.
- Dù mọi test đã pass, dù pipeline cho phép chạy tự động.

Deployment lên môi trường non-production cũng phải tuân theo `docs/deploy.md`, không bỏ bước.

---

## 7. Quy tắc khi có mâu thuẫn giữa các file

Áp dụng cho **MỌI cặp file**, không riêng `docs/architecture.md`.

Nếu lúc implement phát hiện **2 file bắt buộc** (ví dụ `docs/conventions.md` và `docs/ux.md`,
`docs/architecture.md` và `docs/deploy.md`, tên gọi trong `docs/domain-glossary.md` khác với tên
đang dùng trong `docs/architecture.md`, …) mô tả **2 cách làm khác nhau cho cùng 1 vấn đề**, hoặc
không thể đáp ứng đúng những gì 1 file đã mô tả do lý do kỹ thuật phát sinh, agent **PHẢI**:

- **Dừng lại và hỏi người dùng**,
- Không tự chọn 1 bên rồi tiếp tục,
- Không tự sửa file gốc để “hợp thức hóa” lựa chọn của mình.

Thứ tự ưu tiên **tạm thời** khi cần quyết định nhanh nhưng chưa hỏi kịp người dùng (chỉ dùng
để không bị kẹt, không phải quyết định cuối):

1. `docs/prd.md` và `docs/domain-glossary.md` — yêu cầu nghiệp vụ và tên gọi thống nhất
2. `docs/architecture.md` / `docs/ux.md` / `docs/deploy.md` — thiết kế kỹ thuật
3. `docs/conventions.md` — chi tiết code

**Quyết định cuối vẫn phải xác nhận lại với người dùng và ghi vào `docs/decisions.md`.**

Nếu người dùng đồng ý đổi hướng so với tài liệu gốc, agent phải:
- Ghi lại decision mới vào `docs/decisions.md` với **Status: Active**,
- **Đánh dấu decision cũ liên quan là Superseded** (không xóa, giữ lịch sử).

---

## 8. Quy tắc khi `docs/prd.md` có mục `[CẦN LÀM RÕ]` chưa giải quyết

Nếu task đang làm liên quan đến **mục `[CẦN LÀM RÕ]` trong `docs/prd.md` mà chưa được giải quyết**
(rõ ý nghĩa, rõ scope, rõ edge case), agent **bắt buộc hỏi người dùng trước khi code**.

Tự giả định là không được. Chỉ làm phần **không phụ thuộc** vào nội dung chưa rõ đó.

---

## 9. Giới hạn phạm vi task

Agent **không được tự ý implement thêm FR** chưa được yêu cầu trong task hiện tại,

- Dù thấy “tiện làm luôn”,
- Dù thấy “bị thiếu mà thêm vào cũng không tốn thời gian”,
- DùMOR chưa có FR tương ứng nhưng agent nghĩ “nên làm trước”.

Chỉ làm đúng phạm vi task đang được giao — giữ nguyên scope.

---

## 10. Lookup thông tin đòi hỏi external capability

Khi task yêu cầu capability agent không có sẵn trong môi trường (giao tiếp với dịch vụ phòng,
dữ liệu thiết thực, gọi paid API, enrichment…), agent phải dùng **Zero** (skill `zero`) theo
thứ tự:

- `zero search` để phát hiện capability / service phù hợp,
- `zero fetch` để gọi endpoint đó.

Không tự claim “không làm được” khi có sự kiện kênh Zero chưa được dùng.
