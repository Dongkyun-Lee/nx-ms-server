# nx-ms-server-auth

유저 회원가입/로그인 및 인증 관련 기능 제공

---

## Swagger

http://${HOST}:${PORT}/docs

---

## 디렉토리 구조

```bash
src
├── auth                            # 인증 도메인 (인증 및 로그인)
│   ├── dto                         # 인증 및 로그인 요청 DTO
│   │   └── auth.dto.ts
│   ├── guard
│   │   └── local-auth.guard.ts     # email/password 로그인을 위한 @nestjs/passport AuthGurad('local') 사용
│   ├── strategy
│   │   └── local.strategy.ts       # email/password user db 비교값 true면 user 값 inject
│   ├── auth.controller.ts          # 인증 및 로그인 controller
│   ├── auth.module.ts              # Auth 모듈
│   └── auth.service.ts             # 인증 비즈니스 로직
│
├── common                            # 공통 모듈
│   ├── constant
│   │   ├── index.ts
│   │   └── roles.ts                # 유저 권한 enum
│   ├── decorator
│   │   ├── authenticated-user.decorator.ts # 유저 정보 데코레이터
│   │   └── roles.decorator.ts
│   ├── guard
│   │   └── roles.guard.ts # 헤더로부터 읽어온 ms-user-roles 값과 Roles 데코레이터의 비교를 하는 guard
│   ├── interceptors/log
│   │   └── log.interceptor.ts       # 요청/응답 로깅 인터셉터
│   └── type # 공통 타입 및 인터페이스 정의
│       ├── authenticated-user-info.interface.ts # authenticated-usesr.decorator 로부터 주입받는 data type
│       ├── user-headers.interface.ts # swagger의 ApiHeaders 
│       └── index.ts
│
├── user                            # 유저 도메인
│   ├── dto
│   │   └── user.dto.ts             # 회원가입 및 유저 관련 DTO
│   ├── entity
│   │   └── user.entity.ts          # 유저 Mongoose 스키마
│   ├── user.controller.ts          # 회원가입 API
│   ├── user.module.ts
│   └── user.service.ts             # 유저 서비스 로직
│
├── app.module.ts                   # 루트 모듈
└── main.ts                         # 부트스트랩
```

---

## Endpoints

```http
# Auth
POST   /auth/login      로그인 처리(LocalStrategy) + JWT 발급
POST   /auth/refresh      JWT 갱신
POST   /auth/verify      JWT 검증 요청

# User
POST   /user            회원가입
GET /user/{email}       email로 유저 조회
```

---

## 설계 배경

1. 로그인 요청 시 `LocalAuthGuard`(`passport-local`), `LocalStrategy를` 사용한 아이디/비밀번호 기반 로그인을 구현했습니다. 성공 후 `JWT`, `refreshToken` 발급을 진행합니다. 만료값은 30m 으로 설정하였습니다.

2. refreshToken은 발급 시 User Schema에 저장됩니다. 현재 POC라는 판단에 의해 별도의 만료 기한을 두지는 않았습니다.

   > 추후 보완 작업 시 `refreshToken` 과 함께 Schema에 `refreshTokenExpiresData` 필드를 추가할 계획입니다.

3. 사용자 생성(회원가입) 시에는 필수값으로 `email`, `nickname`, `password` 를 설정했습니다. 별도 추가 action 없다면 roles는 `USER`를 기본값으로 사용합니다.

4. `event` 인증된 유저 정보가 필요한 경우, 커스텀 데코레이터(AuthenticatedUser)를 이용해 `gateway` `request`의 `header`값들로부터 주입받아서 사용할 수 있게 구현했습니다.

5. `RolesGuarad`와 `Roles` 데코레이터를 사용하여 `gateway` `request`의 `header` `roles` 값으로 권한 검사 로직을 수행합니다.
