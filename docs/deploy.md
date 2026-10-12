# Deploy & Vận hành — PayFlow Enterprise

> Hướng dẫn vận hành để **agent tự thực hiện hoặc hỗ trợ deploy đúng quy trình** — không phải tài liệu tham khảo chung chung. Đọc file này trước bất kỳ hành động deploy/release nào.
>
> **Quyết định infra đã chốt (người phụ trách sản phẩm, 2026-10-12):**
> - Hosting: **VPS tự quản lý** (1 server, ~5–10$/tháng, Docker Compose + Caddy) — nhà cung cấp VPS để trống, tùy chọn khi triển khai thật.
> - Availability: **Best-effort demo nội bộ** — không SLA chính thức; cam kết đúng mức NFR-04 đã ghi: "không mất/không trùng dữ liệu khi crash". Health check cơ bản vẫn bắt buộc.
> - TLS: **HTTPS + domain riêng** (Caddy + Let's Encrypt) — liên quan NFR-02.
> - CI: **GitHub Actions** — test gate tự động theo FR-30.
>
> Quyết định này chưa được ghi vào `docs/decisions.md` (chờ bước backfill) — mọi thay đổi tương lai phải đi qua file đó.

---

## 1. Môi trường (Environments)

| Môi trường | Purpose | Database | Domain / URL | Config |
|---|---|---|---|---|
| **local/dev** | Develop & test trên máy dev; demo nội bộ theo SM-01/SM-06 | PostgreSQL trong Docker Compose, volume local | `http://localhost:4200` (Angular dev) / `http://localhost:5000` (API) | `.env` local (git-ignored), Mock Bank Gateway luôn bật, log mức Debug |
| **staging** | Verify trước khi lên production: test migration, smoke test thật trên hạ tầng giống production | DB riêng trên VPS, backup hằng ngày | `https://staging.<tên-miền>` | `.env` riêng trên VPS, Mock Bank Gateway **tắt**, log mức Information |
| **production** | Môi trường người dùng thật sử dụng | DB riêng trên VPS (cùng server với staging — xem mục 2) | `https://<tên-miền>` | `.env` riêng, Mock Bank Gateway **tắt**, log mức Warning |

Khác biệt chính giữa các môi trường chỉ là **config (biến môi trường) và database** — cùng 1 image, cùng 1 compose file. **Không** build riêng binary cho từng môi trường (1 dev, 8 tuần — giảm biến số).

**Lưu ý [ĐỀ XUẤT - CẦN DUYỆT]:** staging và production cùng chạy trên 1 VPS (cùng compose project, khác tên miền/cổng) để tiết kiệm chi phí theo lựa chọn VPS đơn — trade-off: không tách fault domain, staging sập có thể ảnh hưởng tài nguyên production. Nếu sau này cần tách, chỉ cần tách sang VPS thứ 2, không đổi compose file.

## 2. Hạ tầng

**Map với `docs/architecture.md`:** đúng lựa chọn đã ghi — Modular Monolith 1 process (API chứa cả background worker xử lý `Outbox` [KT] trong cùng process), PostgreSQL cùng server, không message broker ngoài, không Kubernetes (ngoài phạm vi PRD).

**Cấu trúc trên VPS** (Ubuntu 22.04/24.04, khuyến nghị 2 vCPU / 4GB RAM):

```
/opt/payflow/
├── docker-compose.yml        # từ repo, checkout theo tag cần deploy
├── .env                      # secrets — chmod 600, KHÔNG commit
├── caddy/
│   └── Caddyfile
└── backups/                  # dump DB + giữ 7 bản gần nhất
```

**Các service trong Compose:**

| Service | Image | Vai trò |
|---|---|---|
| `api` | `ghcr.io/<owner>/payflow-api:<tag>` | ASP.NET Core host (HTTP API + background worker Outbox [KT]) — FR-18/FR-22 |
| `migrator` | image như `api`, chạy one-off | `PayFlow.DbMigrator` — chạy migration trước khi mở traffic (mục 5) |
| `db` | `postgres:16` | PostgreSQL, volume gắn local, backup bằng `pg_dump` cron |
| `caddy` | `caddy:2` | Reverse proxy: TLS Let's Encrypt (HTTPS bắt buộc — NFR-02), serve static Angular build, proxy `/api` → `api` |

Angular: build static (`ng build --configuration production`) → copy `dist/` vào thư mục Caddy serve. Server không chạy Node runtime.

## 3. Quản lý biến môi trường / secret

**Quy tắc:** secret **không bao giờ** commit vào repo (NFR-02) và không in ra log, chat, screenshot.

| Nơi lưu | Cách agent lấy khi cần |
|---|---|
| local/dev | File `.env` ở gốc repo (**git-ignored**, đã có trong `.gitignore`) — agent đọc file local khi chạy test/deploy local; `.env.example` (commit) liệt kê tên biến, **không** chứa giá trị |
| staging/production | File `/opt/payflow/.env` trên VPS (`chmod 600`, owner `deploy`) — agent chỉ truy cập qua SSH khi người dùng yêu cầu; **không** đọc/hiển thị giá trị secret trong câu trả lời |

**Danh sách biến bắt buộc** (đúng format ASP.NET Core double-underscore):

```bash
# DB
POSTGRES_USER=payflow
POSTGRES_PASSWORD=<secret>
POSTGRES_DB=payflow
ConnectionStrings__Default=<chuỗi kết nối PostgreSQL>

# App
ASPNETCORE_ENVIRONMENT=Production
App__Origin=https://<tên-miền>          # NFR-02: luôn https
AllowedHosts=*

# OIDC (OpenIddict — architecture mục 4)
OpenIddict__CertificatePath=/certs/openiddict.pfx
OpenIddict__CertificatePassword=<secret>

# Blob (Chứng từ — OQ-08)
Blob__Provider=FileSystem
Blob__RootPath=/data/blobs
```

`<secret>` sinh ngẫu nhiên (không dùng lại giữa môi trường). Danh sách có thể mở rộng khi implement thật — thêm biến mới phải cập nhật `.env.example` cùng lúc.

## 4. Quy trình build & CI/CD

**GitHub Actions** — pipeline là **gate bắt buộc**: bất kỳ tầng test nào fail → **dừng, không deploy tiếp** (FR-30).

```
push/PR → job 1: build (.NET + ng build)            ── fail → STOP
        → job 2: unit tests (xUnit)                 ── fail → STOP
        → job 3: integration tests (EF Core + PostgreSQL service container)
        → job 4: API security test (phân quyền, cô lập tenant — FR-03/NFR-02)
        → job 5: concurrency test (idempotency, optimistic concurrency — FR-19/NFR-04)
        → job 6: docker build + push image :<git-sha> và :<semver-tag>
```

- Thứ tự test: **unit → integration → API security → concurrency** — đúng thứ tự nhanh→chậm để fail sớm.
- **Deploy staging:** chạy tự động sau khi pipeline pass trên `main` (workflow deploy-staging, `workflow_dispatch` hoặc merge).
- **Deploy production:** **chỉ** bằng `workflow_dispatch` tay, và **chỉ sau xác nhận người dùng trong phiên làm việc** (mục 9).
- Không có pipeline xanh → không có image mới trên registry → không deploy được (quy tắc vật lý, không phải quy ước).

**Build local** (khi không có CI): `dotnet build` → `dotnet test` (đủ 4 tầng test theo thứ tự) → `docker build` — cũng là gate, không được bỏ qua.

## 5. Database migration

- Migration dùng **EF Core migration** trong `PayFlow.DbMigrator` (có sẵn trong repo) — chạy bằng one-off container:
  ```bash
  docker compose run --rm migrator
  ```
- **Thứ tự deploy bất di bất dịch:** migrate **trước** khi mở traffic (api mới đọc schema mới; api cũ không được chạy song song với schema đã đổi breaking).

**Quy tắc bắt buộc:**

1. Mỗi migration EF **phải có `Down()` hoạt động** (reversible) — thêm vào review checklist; migration không Down được phải kèm script rollback tay trong cùng PR.
2. **Trước khi migrate production: luôn backup DB** (mục 7); không có backup = không migrate.
3. Migration breaking (đổi tên cột, drop) → thực hiện theo 2 phase: thêm mới → migrate dữ liệu → bỏ cũ ở release sau (không drop trong 1 release).
4. **Không sửa migration đã từng chạy ở môi trường bất kỳ** — tạo migration mới.

## 6. Quy trình deploy từng bước

Checklist agent phải làm **đúng thứ tự**, dừng lại hỏi ở bước thiếu xác nhận:

**Pre-check**
1. Xác nhận nhánh/tag cần deploy; pipeline gần nhất **xanh cả 4 tầng test** (mục 4).
2. Rà `git log` version mới ↔ migration mới (có migration mới không? có breaking change gì?).
3. **Production: xác nhận rõ ràng từ người dùng trong phiên hiện tại** (mục 9) — bước này không được skip.
4. Backup DB production: `docker compose exec db pg_dump -U payflow payflow | gzip > /opt/payflow/backups/pre-deploy-$(date +%Y%m%d-%H%M).sql.gz`.

**Build & đẩy image**
5. Đánh tag semver + push → CI build & push image (hoặc build local rồi push).
6. Trên VPS: `docker compose pull`.

**Migrate**
7. Chạy migrator one-off: `docker compose run --rm migrator`. Có lỗi → **dừng, sang Rollback (mục 7)**, không tiếp tục.

**Deploy**
8. `docker compose up -d api caddy` (reload cấu hình Caddy nếu đổi domain).
9. Chờ api healthy (xem mục 8).

**Smoke test sau deploy** (bắt buộc, production và staging đều chạy)
10. `curl -fsS https://<tên-miền>/health` → 200.
11. Đăng nhập OIDC thành công qua domain thật (HTTPS).
12. Vào 1 màn hình danh sách (Đề nghị thanh toán) — không lỗi console.
13. Chạy 1 vòng nghiệp vụ nhẹ: tạo Đề nghị thanh toán → gửi phê duyệt (subset của SM-01).
14. `docker compose logs api --since 10m` — không có error lặp lại.
15. Smoke fail → sang **Rollback** ngay, không "thử lại lần nữa" quá 1 lần.

## 7. Rollback

**Điều kiện phải rollback:** smoke test sau deploy fail (mục 6 bước 15); lỗi nghiêm trọng phát hiện sau deploy (API 5xx lặp, mất dữ liệu); migration fail giữa chừng.

**Cách rollback:**

| Tình huống | Các bước |
|---|---|
| **Chỉ đổi code, không đổi migration** | `docker compose up -d api` với image tag phiên bản trước (giữ ≥ 2 tag gần nhất trên registry) → chạy lại smoke test. Database giữ nguyên. |
| **Có migration đã chạy, code quay lại** | Quay code về tag trước (schema mới → code cũ thường vẫn chạy nếu migration chỉ *thêm*). Nếu migration đã drop/breaking → **không** chạy `Down()` bừa bãi trên production có dữ liệu thật. |
| **Migration fail giữa chừng / mất dữ liệu** | Dừng api (`docker compose stop api`) → restore từ backup `pre-deploy-*.sql.gz` → báo người dùng, điều tra, fix forward rồi deploy lại. **Đây là lý do bước backup là bắt buộc.** |

Rollback staging: tương tự, không cần backup restore trừ khi migrate — nhanh hơn nên khuyến nghị test toàn bộ migration trên staging trước production.

**Nhắc lại trade-off best-effort:** không có SLA (đã chốt) → downtime khi rollback không vi phạm cam kết, nhưng **mất/không trùng dữ liệu là vi phạm NFR-04** — mọi rollback liên quan DB phải ưu tiên nguyên vẹn dữ liệu hơn uptime.

## 8. Monitoring & Logging sau deploy

**Ngay sau deploy (ngoài smoke test):**

| Hạng mục | Cách kiểm tra | Ngưỡng cảnh báo |
|---|---|---|
| **Health check** | `GET /health` — kiểm tra API phản hồi **và** kết nối DB được (framework ASP.NET Core Health Checks); Caddy không proxy `/health` sang external. | != 200 → coi như sự cố |
| **Log lỗi** | `docker compose logs api --since 15m \| grep -i "error\\|exception"` | Lỗi lặp > 3 lần/phút → dừng xem, cân nhắc rollback |
| **Outbox backlog [KT]** | Đếm bản ghi Outbox chờ dispatch quá tuổi (câu truy vấn nhỏ hoặc endpoint nội bộ) | Backlog tăng liên tục 15 phút → worker chết, restart `api`; không giảm → escalate người dùng |
| **DB volume & backup** | Kiểm tra backup file mới nhất có từ 24h qua; dung lượng disk | Disk > 80% → dọn backup cũ (> 7 bản) |
| **HTTPS** | Trình duyệt tới `https://<tên-miền>` không cảnh báo certificate | Sắp hết hạn cert (Caddy tự động renew — cảnh báo nếu fail) |

**Logging:** Serilog ra stdout của container (`docker logs` + log rotation driver `max-size: 10m, max-file: 5`) — log kỹ thuật. **Không** nhầm với `AuditLog` nghiệp vụ (lưu trong DB, bất biến, xem qua màn hình Nhật ký kiểm toán — FR-25). Không cần hạ tầng log bên ngoài ở mức best-effort này; nếu sau này cần tập trung log → ghi `docs/decisions.md` trước.

**Alerting:** ở mức best-effort (đã chốt, không SLA) — chưa cấu hình pager/telegram. Tối thiểu: health check fail liên tục 5 phút → gửi email thông báo cho người vận hành [ĐỀ XUẤT - CẦN DUYỆT].

## 9. Quy tắc bắt buộc dành cho agent

> **KHÔNG được tự ý deploy lên production khi chưa có xác nhận rõ ràng từ người dùng trong cùng phiên làm việc, kể cả khi mọi test đã pass. Deploy lên staging có thể tự thực hiện nếu pipeline cho phép, nhưng production luôn cần xác nhận thủ công.**

Kèm các quy tắc bổ sung:

1. **Không bao giờ** in/hiển thị giá trị secret (`.env`, chuỗi kết nối, certificate password) trong câu trả lời, log hay commit.
2. **Không commit** `.env` hay file secret; `.env.example` chỉ chứa tên biến.
3. Không migrate production khi **chưa có backup** trong phiên đó (mục 6 bước 4).
4. Không sửa migration đã chạy; không chạy `Down()` trên production có dữ liệu thật khi chưa trao đổi với người dùng.
5. Smoke test fail → dừng, báo cáo người dùng kèm log liên quan — **không** "thử lại" vô hạn, không che lỗi.
6. Không đổi hạ tầng ngoài phạm vi file này (thêm service, đổi provider, mở port) khi chưa được yêu cầu và chưa ghi `docs/decisions.md`.
7. Nếu output không chắc chắn (pipeline state không rõ, migration trạng thái không rõ) → **dừng và hỏi**, không suy đoán để tiếp tục deploy.

---

**Tham chiếu:** quy trình này map NFR-04 (không mất/không trùng dữ liệu), NFR-02 (HTTPS, secret), NFR-06 (Docker Compose), FR-18/FR-22 (worker Outbox [KT] trong cùng process), FR-25 (AuditLog khác log kỹ thuật), FR-30 (test gate), SM-01/SM-06 (demo môi trường sạch). Khi thay đổi infra → ghi `docs/decisions.md` (mục 3: PHẢI ghi — chọn hạ tầng), cập nhật file này.
