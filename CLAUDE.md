# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An outdoor-sports-club SaaS built on the **RuoYi-Vue 3.9.2** rapid-development framework (Spring Boot 4.0.3 backend + Vue 3 frontends). The RuoYi modules (`ruoyi-system`, `ruoyi-framework`, `ruoyi-common`, `ruoyi-quartz`, `ruoyi-generator`, `ruoyi-admin`) are the upstream framework largely unmodified; the actual product code lives in **`ruoyi-outdoor`** plus the outdoor-specific controllers and the customer-facing frontends.

## Commands

Backend (Maven, JDK 17+, run from repo root):

```bash
mvn clean install                          # build all modules
cd ruoyi-admin && mvn spring-boot:run      # run backend on :8080
mvn -pl ruoyi-outdoor -am test             # test a single module
mvn -Dtest=ClassName#method test           # run a single test
```

Admin frontend (`ruoyi-ui`, Vue 3 + Element Plus):

```bash
cd ruoyi-ui && npm install && npm run dev  # dev server
npm run build:prod                         # production build
```

H5 customer frontend (`ruoyi-h5`, Vue 3 + Vant):

```bash
cd ruoyi-h5 && npm install && npm run dev  # dev server on :5173
npm run build
```

Production jar lifecycle is managed by `./ry.sh {start|stop|restart|status}` (runs `ruoyi-admin.jar`).

## Architecture

**Single Spring Boot app, layered the RuoYi way.** All HTTP entry points live in `ruoyi-admin` under `com.ruoyi.web.controller`; business logic and persistence live in `ruoyi-outdoor`. There is no separate API service — the same JVM serves the admin console, the miniprogram/H5 API, and WeChat callbacks, separated only by controller package and Spring Security URL rules.

Controller packages (the key distinction to keep straight):

- `controller/admin/outdoor/` — admin-console CRUD. Secured by RuoYi's JWT + `@PreAuthorize` permission strings, paginated via PageHelper, consumed by `ruoyi-ui`.
- `controller/api/outdoor/` — public/customer API consumed by the miniprogram and `ruoyi-h5`. Different auth model (WeChat user token, not the admin JWT).
- `controller/wx/` — WeChat-specific: `WxAuthController` (miniprogram login → user provisioning) and `WxPaymentController` (WeChat Pay unified order + async payment callback).

`ruoyi-outdoor` is organized by **domain feature**, each a self-contained vertical slice with the same internal layering:

```
ruoyi-outdoor/.../outdoor/<feature>/{domain,mapper,service,service/impl}
features: club, wxuser, registration, disclaimer, activity, payment
```

MyBatis mapper XML lives in `ruoyi-outdoor/src/main/resources/mapper/<feature>/`, paired with the `mapper/` Java interfaces. The DB is **PostgreSQL** (not MySQL — watch SQL dialect in mapper XML); Redis backs caching/sessions.

Core business flow: WeChat login (`wxuser`) → browse `activity` → `registration` (with `disclaimer` sign-off) → `payment` via WeChat Pay, with `club` providing multi-tenant scoping.

## Frontends

Four frontends exist; know which one a task targets:

- `ruoyi-ui` — admin console (Vue 3, Element Plus, Vue Router, the upstream RuoYi admin shell).
- `ruoyi-h5` — customer H5 web (Vue 3, Vant, Pinia, axios). Maps to `controller/api`.
- `ruoyi-miniprogram` — native WeChat miniprogram (app.js/app.json).
- `club-miniprogram` — a second miniprogram variant; **also contains loose PHP/WordPress files** (`*.php`, `cloudfunctions/`) that are scratch/reference material, not part of the Java build.

## Configuration

Sensitive runtime config is in `ruoyi-admin/src/main/resources/application.yml` (active profile `druid`; DB connection in `application-druid.yml`). WeChat appid/secret/mch keys and the payment `notifyUrl` live under the `wx:` block in `application.yml` and must be set per-environment. Swagger UI: `http://localhost:8080/swagger-ui.html`.

## Project docs

`docs/` holds the product/spec source of truth in Chinese: `开发规格说明书.md` (spec), `API接口清单.md` (API inventory), `功能规划.md` / `开发待办清单.md` (roadmap/todo), `页面路由规划.md` (route plan). Consult these before adding features.
