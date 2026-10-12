# Coding Conventions — PayFlow Enterprise

> Chuẩn code để **tự review lại code mình viết ra** trước khi báo "done". Mỗi quy tắc ở đây là **điều kiện đúng/sai**, không phải khuyến nghị. Stack theo `docs/architecture.md`: ASP.NET Core trên ABP 10.6.1 (.NET 10), EF Core + PostgreSQL, Angular SPA; test: **xUnit + NSubstitute + Shouldly + Volo.Abp.TestBase** (khớp package thật trong `test/`).
>
> Tài liệu này được `copilot-instructions.md` bắt buộc đọc trước khi code. Sau mỗi task, chấm theo mục 6.

---

## 1. Naming convention

### 1.1 Quy tắc chuyển đổi từ `docs/domain-glossary.md` (BẮT BUỘC cho mọi tên nghiệp vụ)

Mọi class/entity/enum/property/db-column đại diện cho khái niệm nghiệp vụ phải truy ngược được về **đúng 1 dòng glossary**. Cách chuyển đổi (máy hóa được):

1. **Tra cột "Thuật ngữ chuẩn"** trong glossary, lấy phần trong dấu backtick (tên code EN) — ví dụ `PaymentRequest`, `PaymentOrder`, `TransactionId`.
2. **Tên lấy nguyên vẹn**, không dịch lại, không viết tắt, không thêm/bớt từ. Chỉ casing theo quy ước C# (PascalCase — tên code glossary vốn đã PascalCase).
3. **Tên có khoảng trắng** (8 trạng thái: `Pending Approval`...) → bỏ khoảng trắng, còn 1 từ PascalCase: `PendingApproval`, `Chưa xác định`→`Unknown`. Bảng map đầy đủ: `Draft`, `PendingApproval`, `Approved`, `Processing`, `Completed`, `Failed`, `Unknown`, `Cancelled`.
4. **Không bao giờ** đặt tên class/entity theo nghĩa tiếng Việt dịch tay — chỉ dùng tên code glossary. Nếu thiếu tên → **dừng, bổ sung glossary trước** (glossary mục 4).
5. Tên hiển thị VI chỉ xuất hiện trong localization resource/UI copy, không bao giờ trong identifier.

| Kiểu tên | Quy tắc | ✅ Đúng | ❌ Sai |
|---|---|---|---|
| **File class C#** | PascalCase, trùng tên class, 1 class/file | `PaymentRequest.cs` | `paymentRequest.cs`, `Payment.cs` |
| **Class/entity/enum** | PascalCase = tên code glossary (1.1) | `PaymentOrder`, `ApprovalDecision`, `PaymentRequestStatus` | `PaymentReq`, `Transaction` (glossary cấm), `PaymentRequestState` |
| **Property C#** | PascalCase; property đại diện khái niệm nghiệp vụ = tên code glossary của khái niệm đó | `Amount`, `TransactionId`, `IdempotencyKey`, `Status` | `Money`, `BankRef`, `StatusValue` |
| **Biến local / parameter** | camelCase | `var amount = req.Amount;` | `var Amount = ...` |
| **Field private** | `_camelCase` | `private readonly IPaymentOrderRepository _repo;` | `private IPaymentOrderRepository repo;` |
| **Method/function** | PascalCase, verb đầu, async suffix | `Task SubmitAsync(...)`, `Task ApproveAsync(...)` | `submit()`, `DoSubmit()` |
| **Biến bool** | `Is/Has/Can` prefix | `CanCancel`, `IsMakerCheckerViolated` | `CancelFlag`, `check` |
| **Bảng DB (EF Core)** | PascalCase **số nhiều** = `{Entity}s` (khớp convention ABP: `AbpUsers`) | `PaymentRequests`, `PaymentOrders`, `ApprovalDecisions` | `payment_requests`, `PaymentRequest` (số ít), `TBL_Payment` |
| **Cột DB** | PascalCase = tên property; viết tắt `Id` (không `ID`) | `TransactionId`, `ConcurrencyStamp`, `TenantId` | `TRANSACTION_ID`, `TransactionID` |
| **Enum value** | PascalCase theo 1.1 bước 3 | `PaymentRequestStatus.PendingApproval` | `PENDING_APPROVAL`, `Pending` |
| **API endpoint** | REST, `/api/{resource-kebab-case-số nhiều}`; resource = tên entity glossary đổi kebab | `POST /api/payment-requests`, `POST /api/payment-requests/{id}/approvals` | `/api/CreatePaymentRequest`, `/api/paymentRequest`, `/api/duyet-de-nghi` |
| **DTO** | `{Name}Dto` / `{Name}CreateDto` / `{Name}UpdateDto` | `PaymentRequestDto`, `PaymentRequestCreateDto` | `PaymentRequestVM`, `PayloadPayment` |
| **App service** | `{Name}AppService` | `PaymentRequestAppService` | `PaymentControllerService`, `PaymentBLL` |
| **Domain service** | `{Name}DomainService` | `PaymentRequestStateTransitionDomainService` | `HelperTransition` |
| **Background job** | `{Name}Job` | `OutboxDispatchJob` | `Worker1`, `DoPayment` |
| **Repository** | `{Entity}Repository` | `PaymentOrderRepository` | `PaymentRepo`, `PaymentOrderDao` |
| **Angular class** | PascalCase + suffix loại | `PaymentRequestListComponent`, `ApproveDialogComponent`, `PaymentRequestService` | `paymentRequestList`, `ListComponent` |
| **Angular file** | kebab-case + suffix | `payment-request-list.component.ts`, `payment-request.service.ts`, `payment-request.model.ts` | `PaymentRequestList.ts`, `list.ts` |
| **Biến Angular** | camelCase; `@Input()/@Output()` PascalCase | `paymentRequests`, `@Input() request` | `$paymentRequests`, `@Input() data` |
| **File CSS/SCSS** | kebab-case theo component | `payment-request-list.component.scss` | `list.scss` |
| **Nhánh git** | `{loại}/{mã-FR}-{mã-tóm-tắt-kebab}` — loại: `feature`, `fix`, `chore`, `docs`, `test` | `feature/FR-07-create-payment-request`, `fix/FR-19-idempotency-key-unique` | `new-feature`, `fix-luu-de-nghi`, `patch` |
| **Commit message** | Conventional Commits + mã FR/NFR, tiếng Việt không dấu vẫn được nhưng nhất quán 1 kiểu | `feat(PaymentRequests): tạo Đề nghị thanh toán với trạng thái Nháp (FR-07)` | `update code`, `fix bug`, `them chuc nang` |

Ghi chú endpoint: thao tác không phải CRUD dùng verb sau resource: `POST /api/payment-requests/{id}/submit` (gửi phê duyệt), `POST /api/payment-requests/{id}/approvals` (Phê duyệt/Từ chối), `POST /api/payment-requests/{id}/cancel` (Hủy) — dùng đúng thuật ngữ glossary khi đặt tên action, không viết tắt.

## 2. Cấu trúc thư mục

Module = **namespace folder** trong layered solution (đã chốt ở `docs/architecture.md` mục 3):

```
src/
├── PayFlow.Domain.Shared/        # dùng chung, KHÔNG tham chiếu gì
│   ├── PaymentRequests/          # enum PaymentRequestStatus, constant StateTransitionMatrix dữ liệu thô
│   └── ...
├── PayFlow.Domain/               # entity + domain service (business rule thuần)
│   ├── PaymentRequests/          # PaymentRequest.cs, PaymentRequestStateTransitionDomainService.cs
│   ├── Approvals/                # ApprovalWorkflow.cs, ApprovalLevel.cs, ApprovalDecision.cs
│   ├── PaymentExecution/         # PaymentOrder.cs, OutboxMessage.cs [KT]
│   ├── Organization/             # Department.cs, PaymentAccount.cs
│   └── Reconciliation/           # ReconciliationResult.cs
├── PayFlow.Application.Contracts/ # DTO + interface công khai (contract giữa module)
│   ├── PaymentRequests/          # PaymentRequestDto.cs, IPaymentRequestRepo-contract nếu cần
│   └── ...
├── PayFlow.Application/          # app service (orchestration + gọi domain service)
│   ├── PaymentRequests/          # PaymentRequestAppService.cs
│   └── ...
├── PayFlow.EntityFrameworkCore/  # DbContext, repository, migrations
│   ├── PaymentRequests/          # PaymentRequestRepository.cs
│   └── Migrations/
├── PayFlow.HttpApi/              # controller mỏng — chỉ map HTTP ↔ AppService
├── PayFlow.HttpApi.Host/         # host: OIDC, Caddy-ready, health check
└── PayFlow.DbMigrator/           # migration runner (deploy.md mục 5)
angular/src/app/
├── shared/                       # badge trạng thái, bảng, form pattern theo ux.md mục 5
├── payment-requests/             # list/detail/create/edit + approve dialog
├── approvals/                    # hàng chờ phê duyệt
├── payment-orders/               # P4
├── reconciliation/               # P4
└── admin/                        # cấu hình P5/P6
```

**Quy tắc:** (a) Domain **không** tham chiếu Application/EntityFrameworkCore/HttpApi; (b) module chỉ dùng contract của module khác ở Application.Contracts, không tham chiếu entity nội bộ module khác; (c) controller không chứa business rule; (d) mỗi file namespace khớp vị trí thư mục (`PayFlow.Domain.PaymentRequests`).

## 3. Coding style

### 3.1 Backend C# / ABP

| # | Quy tắc (đúng/sai) |
|---|---|
| B1 | Mọi I/O là `async/await` + suffix `Async` — ✅ `await _repo.FindAsync(id)` ❌ `_repo.Find(id).Result` |
| B2 | `Nullable` enable trong csproj; không dùng `!` để ép null trừ khi đã kiểm chứng | 
| B3 | Business rule nằm ở **domain service / entity**; app service chỉ điều phối — ❌ rule if-approval trong AppService |
| B4 | Transaction qua ambient `IUnitOfWork` của ABP — ❌ `TransactionScope` tay, ❌ `SaveChanges` gọi lung tung ngoài UoW |
| B5 | Đọc list/detail không track: `.AsNoTracking()` — ❌ load toàn bộ danh sách không pagination |
| B6 | Đọc theo id PHẢI đi qua query filter tenant; `.IgnoreQueryFilters()` ⇒ phải có comment giải thích + review riêng |
| B7 | Chuỗi hiển thị cho người dùng KHÔNG hardcode trong service — dùng `IStringLocalizer` resource; mã lỗi dùng code `{Module}:{Rule}` (xem mục 4) |
| B8 | Mapping entity↔DTO: AutoMapper profile của ABP; ❌ copy tay > 3 property trong service |
| B9 | Repository chỉ tạo khi cần query phức tạp/AsNoTracking riêng — ❌ wrapper mỗi DbSet chỉ để `Insert/Get` |
| B10 | Giá tiền dùng `decimal` — ❌ `double/float` cho `Amount` (glossary: Số tiền) |
| B11 | Không `DateTime.Now` trực tiếp — inject `IClock` của ABP (test được) |

### 3.2 Frontend Angular

| # | Quy tắc |
|---|---|
| F1 | Component `standalone`, change detection `OnPush` |
| F2 | Component **không** inject `HttpClient` trực tiếp — mọi API call qua `*Service` (`payment-request.service.ts`) |
| F3 | Async trong template bắt buộc dùng `async` pipe — ❌ `*ngIf="x$ | async"` bị subscribe 2 lần bằng `subscribe()` trong component trừ khi cần callback; subscription dài phải `takeUntilDestroyed()` |
| F4 | Trạng thái hiển thị lấy từ map centralized trong `shared/` (badge 8 trạng thái theo ux.md mục 4.1) — ❌ hardcode màu/tên trạng thái rải rác trong component |
| F5 | Tên hiển thị/status copy lấy từ localization, đúng nguyên văn glossary (ux.md mục 7) — ❌ tự đặt label trong template |
| F6 | Form dùng ReactiveForms; validation message hiển thị theo pattern ux.md mục 5 (label trên, lỗi inline) |
| F7 | ❌ `console.log` trong code đã commit (mục 6/7) |

## 4. Error handling convention

**Mã lỗi backend:** throw `BusinessException` với `Code` theo mẫu `{Module}:{Rule}` — PascalCase, không dấu:

| Tình huống | Code | HTTP |
|---|---|---|
| Vi phạm Maker-Checker | `PaymentRequests:MakerCheckerViolation` | 403 |
| Chuyển trạng thái không hợp lệ (vi phạm StateTransitionMatrix) | `PaymentRequests:InvalidStateTransition` | 409 |
| Gọi Phê duyệt cấp trước khi cấp trước xong | `Approvals:LevelNotReady` | 409 |
| Hủy ở trạng thái không cho phép | `PaymentRequests:CancelNotAllowed` | 409 |
| Xung đột optimistic concurrency | `PayFlow:ConcurrencyConflict` | 409 |

**Quy tắc đúng/sai:**

| # | Quy tắc |
|---|---|
| E1 | **Không bao giờ** nuốt lỗi: ❌ `catch { }`, ❌ `catch { return null; }` — bắt để dịch mã lỗi hoặc log rồi rethrow |
| E2 | Không bao giờ trả exception/stack trace thô cho client — exception filter của ABP dịch sang `RemoteServiceErrorResponse` |
| E3 | Frontend không `alert()` — hiển thị toast theo ux.md mục 5, copy map từ mã lỗi theo localization |
| E4 | Background worker (`OutboxDispatchJob`) mọi exception PHẢI được log + cập nhật trạng thái bản ghi (retry counter/cập nhật `Failed`) — ❌ catch rồi để job "thành công" giả |
| E5 | Log lỗi dùng `ILogger`, KHÔNG `Console.WriteLine`; không log secret/connection string |
| E6 | Lỗi phân quyền/tenant trả 403/404 nhất quán — ❌ trả 500 khi bị từ chối truy cập |

## 5. Testing convention

Khớp package thật trong repo: **xUnit 2.9.x, NSubstitute (mock), Shouldly (assert), Volo.Abp.TestBase**.

| # | Quy tắc |
|---|---|
| T1 | **File test:** `{ClassUnderTest}Tests.cs` trong project test tương ứng layer (Domain → `PayFlow.Domain.Tests`, App → `PayFlow.Application.Tests`, EF → `PayFlow.EntityFrameworkCore.Tests`) |
| T2 | **Tên test method:** `{Method}_{TìnhHuống}_{KếtQuảDựKiến}` — ✅ `ApproveAsync_WhenRequestCreatedByApprover_ShouldThrowMakerCheckerViolation` — ❌ `TestApprove`, `ApproveTest2` |
| T3 | Cấu trúc **Arrange–Act–Assert** trong mọi test, tách bằng comment `// Arrange / Act / Assert`; 1 test 1 hành vi |
| T4 | **Assertion:** Shouldly — ✅ `await act.ShouldThrowAsync<BusinessException>().ShouldHaveCode("PaymentRequests:MakerCheckerViolation")` — ❌ `try/catch` rồi `Assert.True(true)` |
| T5 | **Mock:** chỉ mock ranh giới ngoài (`IBankGateway`, `IClock`) qua NSubstitute — ❌ mock repository/DbContext trong integration test (dùng PostgreSQL thật qua ABP TestBase), ❌ mock domain service để test app service cùng module |
| T6 | **Integration test** chạy với PostgreSQL thật (testcontainer/service container theo `docs/deploy.md` CI) — ❌ thay bằng InMemory provider để "cho qua" (khác hành vi concurrency) |
| T7 | **Concurrency test bắt buộc** cho FR-19 (gửi trùng IdempotencyKey) và FR-12 (2 request cùng chuyển trạng thái) — không có = không đạt FR-30 |
| T8 | **Coverage tối thiểu** (tương xứng NFR-04 "0 mất/trùng" + SM-04 "100% FR được phủ"): (a) **hard gate: mọi FR-01→FR-30 có ≥ 1 test case** — fail pipeline nếu thiếu; (b) line coverage `PayFlow.Domain` + `PayFlow.PaymentExecution` ≥ **85%**; (c) tổng `src/` ≥ **70%**; (d) UI: không bắt buộc e2e trình duyệt trong MVP — nghiệm thu demo qua test API level (SM-01); e2e Playwright để `[CẦN LÀM RỎ]` nếu muốn thêm sau |
| T9 | Test không phụ thuộc thứ tự chạy, không sleep chờ — dùng fake clock (`IClock`) hoặc polling có timeout |
| T10 | Bug fix PHẢI kèm test tái hiện lỗi (red) trước khi fix (green) |

## 6. Quy tắc review (tự chấm trước khi báo "done")

Trả lời **Đúng/Sai** từng dòng; bất kỳ SAI nào = chưa done:

1. Không có secret/chuỗi kết nối hardcode trong source (chỉ `.env` git-ignored / user-secrets)?
2. Không còn `console.log` / `Console.WriteLine` debug? (grep trước khi nộp)
3. Không có `TODO`/`FIXME` không kèm mã FR/OQ cụ thể?
4. Không còn code bị comment-out hoặc file tạm (`test2.cs`, `NewFolder1`)?
5. Tên mọi class/entity/enum/property nghiệp vụ khớp **nguyên văn** tên code glossary (mục 1.1) — không tên tự chế, không viết tắt?
6. Thuật ngữ mới (nếu có) đã được thêm vào `docs/domain-glossary.md` TRƯỚC khi dùng trong code?
7. Mọi thay đổi hành vi có ít nhất 1 test mới/sửa, và `dotnet test` + `ng test` xanh?
8. Mọi I/O async/await đúng, không `.Result`/`.Wait()`?
9. Query đọc list có `AsNoTracking` + pagination; query theo id không tắt tenant filter?
10. User-facing string không hardcode trong service (qua localization)?
11. Exception đã bắt đều được dịch/log/rethrow — không nuốt, không trả stack trace client?
12. Tên branch/commit đúng format mục 1, commit message có mã FR/NFR?
13. UI dùng đúng pattern ux.md mục 5 (badge trạng thái centralized, empty/loading/error state đủ) và copy đúng glossary?
14. Không sửa migration đã chạy; migration mới có `Down()` hoạt động (deploy.md mục 5)?
15. Không sửa/xóa `AuditLog` bằng code nghiệp vụ?

## 7. Điều cấm tuyệt đối

Mọi dòng dưới đây là **lỗi chặn merge** (CI/review reject), không phải khuyến nghị:

1. **Cấm** đặt tên class/entity/enum/property/bảng đại diện khái niệm nghiệp vụ khác với tên code trong `docs/domain-glossary.md` (gồm cả từ cấm trong cột "KHÔNG được gọi là" — ví dụ: ❌ class `Transaction` chỉ Lệnh thanh toán, ❌ `Request` chỉ Đề nghị thanh toán).
2. **Cấm** business logic trong controller (HTTP layer) hoặc trong Angular component/service frontend.
3. **Cấm** gọi DB/API nghiệp vụ trực tiếp từ frontend ngoài `*Service` đã định nghĩa.
4. **Cấm** nuốt lỗi: `catch { }`, `catch { return null; }`, `catch { }` trong `OutboxDispatchJob`.
5. **Cấm** gửi lệnh thanh toán ra `IBankGateway` ngoài đường qua **`Outbox` + `IdempotencyKey`** (FR-19/NFR-04) — kể cả "chỉ gọi thử" trong code nghiệp vụ.
6. **Cấm** dùng raw SQL ghép chuỗi (`string.Format` vào SQL); parameterized query/EF thôi.
7. **Cấm** tắt tenant filter (`.IgnoreQueryFilters()`) trong query nghiệp vụ không kèm comment giải thích + xác nhận review.
8. **Cấm** sửa/xóa bản ghi `AuditLog`/`ApprovalDecision` qua code nghiệp vụ (bất biến — FR-25/FR-17).
9. **Cấm** commit `.env`, certificate (`openiddict.pfx`), secret vào repo; commit file đã bị git-ignored.
10. **Cấm** deploy production khi chưa có xác nhận người dùng trong phiên (deploy.md mục 9).
11. **Cấm** dùng `DateTime.Now`, `Random` không seed trong business rule (dùng `IClock`/`IRandomProvider` của ABP).
12. **Cấm** giá tiền kiểu `double/float` cho `Amount` — chỉ `decimal`.
13. **Cấm** sửa migration đã từng chạy ở bất kỳ môi trường nào.
14. **Cấm** thêm package NuGet/npm ngoài đã duyệt mà không ghi `docs/decisions.md` (quy tắc quyết định công nghệ).
15. **Cấm** dùng từ cấm của glossary trong UI copy, comment, log message hiển thị cho người dùng (ux.md mục 7.4 liệt kê đầy đủ).

---

**Áp dụng:** sau mỗi task, chạy mục 6 như checklist; nếu một quy tắc cần thay đổi → sửa file này + ghi `docs/decisions.md` (đổi convention đã thống nhất = PHẢI ghi theo decisions.md mục 3). `copilot-instructions.md` tham chiếu file này là checklist bắt buộc trước khi báo "done".
