# nx-ms-server-event

> 이벤트 CRUD, 보상 CRUD, 보상 요청, 보상 요청 이력 조회 기능 제공

---

## Swagger

> http://${HOST}:{PORT}/docs

---

## 📁 디렉토리 구조

```bash
src
├── common # 공통 모듈 모음 (상수, 데코레이터, 필터, 가드 등)
│ ├── constant # 역할(Role) 및 상수 정의
│ │ ├── index.ts
│ │ └── user-roles.constant.ts # 유저 권한 enum
│ ├── decorator # 커스텀 데코레이터 정의
│ │ ├── authenticated-user.decorator.ts # 인증된 유저 정보 주입(gw 요청의 header로부터)
│ │ ├── index.ts
│ │ └── roles.decorator.ts # 유저 역할 주입
│ ├── dto # 공통 DTO 정의
│ │ └── common.dto.ts
│ ├── entity # 공통 Entity 정의
│ │ └── common.entity.ts
│ ├── filter # 예외 처리 필터 정의
│ │ ├── global-error.filter.ts # mongodb, http 등 에러메시지 처리 글로벌 필터
│ │ └── index.ts
│ ├── guard # 역할 기반 접근 제어
│ │ ├── index.ts
│ │ └── roles.guard.ts # 헤더로부터 읽어온 ms-user-roles 값과 Roles 데코레이터의 비교를 하는 guard
│ ├── interceptor/log # 요청/응답 로깅 인터셉터
│ │ └── log.interceptor.ts # 전역 로그 인터셉터
│ └── type # 공통 타입 및 인터페이스 정의
│    ├── authenticated-user-info.interface.ts # authenticated-usesr.decorator 로부터 주입받는 data type
│    ├── claim-status.interface.ts # 보상 요청 상태 type
│    ├── reward-type.interface.ts # 보상 유형 type
│    ├── user-headers.interface.ts # swagger의 ApiHeaders 반복 작성 회피를 위한 type
│    └── index.ts
│
├── event # 이벤트 관련 도메인
│ ├── dto
│ │ └── event.dto.ts # 이벤트 관련 요청 DTO
│ ├── entities
│ ├── event.controller.ts # 이벤트 요청 처리 컨트롤러
│ ├── event.module.ts # 이벤트 모듈
│ └── event.service.ts # 이벤트 비즈니스 로직
│
├── reward # 보상 도메인
│ ├── dto
│ │ └── reward.dto.ts # 보상 관련 요청 DTO
│ ├── entities
│ ├── reward.controller.ts # 보상 처리 컨트롤러
│ ├── reward.module.ts # 보상 모듈
│ └── reward.service.ts # 보상 비즈니스 로직
│
├── reward-claim # 보상 요청 도메인
│ ├── dto
│ │ └── reward-claim.dto.ts # 보상 요청 요청 DTO
│ ├── entity
│ ├── reward-claim.controller.ts # 보상 요청 컨트롤러
│ ├── reward-claim.module.ts # 보상 요청 모듈
│ └── reward-claim.service.ts # 보상 요청 서비스
│
├── app.module.ts # 루트 모듈
└── main.ts # 애플리케이션 부트스트랩

```

---

## Endpoints

### Event

```http
POST   /event            이벤트 생성
GET    /event            이벤트 목록 조회
GET    /event/{id}       이벤트 단건 조회
PATCH  /event/{id}       이벤트 수정
DELETE /event/{id}       이벤트 삭제
```

---

### Reward

```http
POST   /reward           [운영자, 관리자] 보상 생성
GET    /reward           [운영자, 감시자, 관리자] 보상 목록 조회
GET    /reward/{id}      [운영자, 감시자, 관리자] 보상 단건 조회
PATCH  /reward/{id}      [운영자, 관리자] 보상 수정
DELETE /reward/{id}      [운영자, 관리자] 보상 삭제
```

---

### Reward Claim

```http
POST   /claim                         [유저] 보상 요청
GET    /claim                         [운영자, 감시자, 관리자] 전체 유저 이력 목록 조회
GET    /claim/my                      [유저] 본인 이력 목록 조회
GET    /claim/my/{rewardClaimId}      [유저] 본인의 특정 보상 요청 이력 상세 조회
GET    /claim/{rewardClaimId}         [운영자, 감시자, 관리자] 특정 보상 요청 이력 상세 조회
```

## 설계 배경

### 공통

1. `Mongoose Document` 와 `Dto` 들 간의 형변환을 위해 `Response` 용 `Dto`에는 `fromDocument` 혹은 `fromDoc` 메서드를 구현하였습니다. 서비스 단에서 데이터 추출 후 메서드의 `return`시 응답 타입을 맞추기 위해 사용됩니다.

2. `gateway` 요청의 `header` 에 담겨진 유저 정보들이 필요한 경우(`userId, userRole`)에 반복 코드의 길이가 불필요하게 길어지는 것을 막기 위해서 header data 주입을 위한 `AuthenticatedUserDecorator`를 생성하였습니다.

3. CRUD 시에 권한 조건이 걸려있는 기능이 많기에 `RolesGuard`와 `RolesDecorator`를 구현하였습니다.

### 이벤트

1. 단순하게 느껴졌었지만 이벤트와 보상 간의 관계를 어떻게 정리할 지가 생각보다 큰 숙제였습니다.. 보상을 먼저 만들고 이벤트를 만들 지, 그 반대의 순서로 할 지. 이벤트 등록을 진행하는 사람의 입장에서 화면을 구성해 보았을 때, 이벤트 등록 화면에 이미 생성되어 있는 보상을 연결만 시키고도 싶을 것이고, 신규 보상을 만들면서 이벤트를 등록하고도 싶을 것이라고 생각했습니다.

   > 그래서 신규 이벤트를 등록할 때에는 `rewardIds`(이미 있는 보상 id 배열) 혹은 `rewards`(신규 등록할 보상)가 필요하도록 설계했습니다.
   > `rewardIds` 들은 이벤트 최초 insert 시 값을 담아 insert 합니다.
   > `rewards` 값들은 이벤트 insert 이후 신규 보상으로 insesrt 하여 idsf를 타깃 이벤트의 `rewardsIds` 에 값을 추가합니다.

2. 이벤트 없는 보상은 존재할 수 있지만, 보상 없는 이벤트는 존재할 수 없습니다. 사용자의 입장에서는 그렇습니다. 그래서 보상은 별도의 CRUD가 가능하도록 하였고 이벤트 생성 시와는 다르게 별도의 사전, 사후 프로세스를 구현하지 않았습니다.

3. 이벤트의 달성 조건 여부를 확인하는 방법은 따로 주어지지 않았습니다. 상용 서비스였다면 유저의 액션이 발생하고 이벤트의 조건에 충족됐는 지 확인할 수 있겠지만 현재 범위에선 불가능합니다. 따라서 조건 충족 여부는 보상수령가능 기간에 보상 요청을 했다면 조건이 충족됐다고 판단하는 것으로 작업했습니다.

   > 달성 조건 필드는 단순한 stirng 으로 선언만 해두었습니다. 추후 작업이 진행된다면 { type: [사냥마릿수, 출석일수, 보스포인트, ...], amount: number} 형식의 객체로 고도화 하여 보완을 진행할 생각입니다.

4. 앞서 언급한 것처럼 이벤트에는 이벤트 시작일, 이벤트 종료일, 보상 시작일, 보상 종료일 값을 가지게 하였습니다. 네 가지 값 모두 필수 필드입니다. 생성 시 이벤트 시작일이 이벤트 종료일 보다 이후이거나 보상 시작일이 종료일보다 이후일 경우에는 `exception`을 반환합니다.

5. 이벤트는 이름, 달성 조건, 설명, 활성화 여부 필드를 추가로 가지며 이벤트의 이름을 unique 설정하였습니다.

### 보상

1. 보상의 유형은 enum 을 생성하였습니다. (`RewardTypeInterface`)

2. 보상은 연결된 이벤트 아이디 리스트, 이름, 설명, 유형, 개수 의 필드를 가집니다.

3. `RewardType`은 실제 인게임에서 받아보았던 보상들을 생각하여 구성하였습니다. (칭호, 소비아이템, 치장아이템, 성장이 비약, exp 쿠폰 등)

### 보상 요청

1. 보상 요청은 `참여 유저 아이디`, `참여 이벤트 아이디`, `보상 수령 요청 시간`, `보상 요청 상태` 의 필드로 구성되어 있습니다.

2. 초기에는 단순한 결과 보관을 위해서 설계했었습니다. 하지만 하나의 (유저-이벤트) 묶음으로 보상 수령 요청에 대해서 히스토리를 기록할 필요가 있다고 느꼈기 때문에 현재와 같은 모습으로 설계를 수정하였습니다. 마치 로그 테이블처럼 보상 수령 요청이 올때마다 서버는 보상 자격 검증, 보상 수령 여부에 따라 결과 상태를 새롭게 `insert` 합니다.

3. 로그 테이블처럼 사용하려고 하니 목록 조회시에 추가적인 설계가 필요했습니다. 따라서 유저가 이력 목록 조회를 한다면 `userId-eventId` 그룹핑 `createdAt` 컬럼을 기준으로 가장 최신의 데이터들의 목록을 반환하는 것으로 구현하였습니다.

   > 유저가 조회하는 경우에는 사실 해당 이벤트의 보상 수령을 했는 지 안 했는 지, 수령했다면 언제 수령했는 지가 중요하다고 생각합니다. 따라서 추후 보완 작업 시에는 단순히 이벤트별 가장 최신의 데이터 목록이 아니라, `Approved` 된 상태의 데이터를 우선으로 추출하여 반환하도록 보완을 진행할 예정입니다.

4. 보상 요청 유형은 `APPROVED(지급 완료)`, `DUPLICATED(중복 수령 요청)`, `NOT_YET_CLAIMABLE(보상 기간 이전)`, `EXPIRED(보상 기간 만료)`, `NOT_QUALIFIED(조건 미충족)` 총 5가지의 상태로 구성하였습니다. `FAILURE` 상태도 있었으나 단순히 실패 상태를 기록하는 것은 추후에 원인 파악이 힘들다고 판단하여 삭제하였습니다.
