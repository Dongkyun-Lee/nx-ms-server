# nx-ms-server-gateway

## 📁 디렉토리 구조

```bash
src
├── auth # 인증 서버 통신 모듈 (컨트롤러, 서비스, 모듈 등)
│ ├── auth.controller.spec.ts # 인증 컨트롤러 테스트
│ ├── auth.controller.ts # 인증 API 요청 처리
│ ├── auth.module.ts # 인증 모듈
│ └── auth.service.ts # 인증 서비스 로직
│
├── common # 공통 모듈 모음 (유틸, 데코레이터, 인터셉터 등)
│ ├── constants # 상수 정의
│ │ ├── index.ts
│ │ └── roles.ts # 역할(Role) 관련 상수
│ ├── decorator # 커스텀 데코레이터 정의
│ │ ├── public.decorator.ts # open API 표기를 위한 decorator
│ │ └── roles.decorator.ts # 역할 배열 주입을 위한 decorator
│ ├── guard # 인증/인가 관련 가드
│ │ ├── jwt-auth.guard.ts # isPublic 또는 @nestjs/passport 통과 인 경우 허용
│ │ └── roles.guard.ts # Roles decorator 로부터 주입받은 권한 목록에 포함된 경우, 또는 ANONYMOUS 대상인 경우 허용
│ ├── interceptors # 인터셉터 모음
│ │ └── log.interceptor.ts # 요청/응답 로깅 인터셉터
│ ├── strategy # Passport 전략 구현
│ │ └── jwt.strategy.ts # scret-key 로 인증되면 허용
│ └── types # 공통 타입 정의
│ └── index.ts
│
├── event # 이벤트 서버 통신 모듈
│ ├── types # 이벤트 관련 타입 정의
│ ├── event.controller.spec.ts
│ ├── event.controller.ts
│ ├── event.module.ts
│ ├── event.service.spec.ts
│ └── event.service.ts
│
├── proxy # 외부 요청 프록시 처리 (HTTP Proxy)
│ ├── http-proxy.service.ts # 프록시 요청 구현 서비스
│ └── proxy.module.ts
│
├── app.controller.spec.ts # 앱 진입점 컨트롤러 테스트
├── app.module.ts # 루트 모듈
└── main.ts # 애플리케이션 부트스트랩
```

---

## 설계 배경

0. 개발 작업 진전에 있어 환경 구성이 가장 중요하고 오래 걸린다고 생각해서 가장 먼저 작업을 시작했습니다.

1. RolesGuard와 JwtGuard를 모두 사용하여 전역 적용하였습니다.

2. 하지만 이벤트의 목록 등 일부 API는 권한이 없는 유저도 볼 수 있어야 한다고 생각해서 Pubcic 데코레이터, 유저 역할에 ANONYMOUS를 추가해두었습니다.

3. 요청/응답 로그가 필요하다고 생각해서 interceptor 구현하여 전역 등록하였고, 이는 3개의 서버에 동일하게 등록하여 gw와 서버 간의 통신 여부와 데이터 이동 과정 확인을 위해서도 사용됐습니다.

4. gateway는 기본적으로 서비스가 아닌 보안의 목적이라고 인지하고 있습니다. 따라서 연결되는 DB는 구성하지 않았고 jwt와 role 검증에만 신경을 썼습니다.

5. 컨트롤러 엔드포인트 맵핑에는, 전역으로 '/api ', 모듈 지정을 위해 각 모듈 이름, 그 뒤에 실제 서버의 엔드포인트를 작성하도록 구성하였습니다. 그러면 event 서버로의 요청일 경우 /api/event/event 같은 엔드포인트가 생성되지만, 저는 각 모듈별로 하나의 서버로 요청하는 것을 원했습니다. 현재는 두개의 서버와 통신하지만 훨씬 더 많은 서버와 통신이 필요해지면 이와 같은 구성이 직관적이라고 생각했습니다.

6. 서비스 단에서는 환경변수에 등록된 각 모듈별 PREFIX를 지운 후 타겟 서버에 알맞은 엔드포인트로 변환하여 HttpProxy 서비스의 메서드를 호출하도록 하였습니다. 서비스 단에서도 구현한 메서드는 Http 메서드와 이름을 같게 구서하였습니다. (post(), get(), ...)

7. HttpProxy는 Http 메서드 별로 proxyGet, proxyPost 등으로 구현하였습니다.

8. 최초 통신 테스트를 위해 작성한 http 요청 메서드를 제너릭으로 만들고 범용으로 사용하려 했지만, 코드의 길이가 너무 길어지고 제너릭 타입들로 인한 코드의 가독성 저하로 위와 같이 구현 방식을 변경하였습니다.

9. gw에서 인증/인가 이후 token으로 부터 얻어낸 데이터들은, proxy 요청 시 요청 헤더의 키값을 지정하여 타깃 서버로 전송하였습니다. Write 작업 시 헤더의 값, 파라미터의 값, db의 저장되어 있는 id 값 등을 이용하여 권한 확인을 상세히 할 수 있다고 생각했습니다.

## 보완할 점

1. 최초에는 gateway 에서 어떤 데이터들이 저장이 필요할까 싶었습니다. 하지만 서버 access log를 gateway 에서 저장한다면, 타 서버의 짐을 덜어줄 수 있을 것 같다고 생각했습니다.

2. 응답 값을 각 서비스 단 내에서 wrapReturnForm 으로 감싸주었긴 하지만 각 서비스 단이 아닌 공통으로 제너릭 타입을 만들지 못한 것이 아쉽습니다. 작업을 진행한다면, 요청 성공 시의 공통된 형태의 객체 포맷을 정하고 요청이 실패했을 때의 폼을 구성하여 하나의 타입으로 선언하고자 합니다.

3. {api}/{modulename}/{path}/{to}/{target} 식으로 구현한 부분은, 통신 서버의 개수만 생각하여 잘못 설계되었다고 생각합니다. 타깃 서버의 엔드포인트가 많아질 수록 gateway 서버 한 개의 controller는 너무 길어지게 됩니다. 보완 작업을 한다면 auth 모듈은 auth 서버와 통신한다는 것은 베이스로 진행하고 실제 auth 서버의 나눠지는 컨트롤러 prefix에 맞게 엔드포인트 controller를 생성하여 gateway의 auth module에서 controller들을 일괄 등록하는 방식으로 작업할 생각입니다.
