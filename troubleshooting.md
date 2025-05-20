# troubleshooting

> 프로젝트를 진행하며 고민하거나 잘못했다고 느낀 것들을 그 때 그 때 기록한 문서

### node v18 <-> nestjs 최신 버전 충돌 문제

#### 상황

> 최신 버전의 nestjs 에서는 node v18 버전 지원 중단(종속 패키지 중 버전 지원이 안됨)

#### 조치

> node v18 이 사용 고정이므로 이와 버전 충돌이 없는 가장 최신의 nest 10.4.9 버전을 채택함

---

### 요구사항 파악 미스

#### 상황

> jwt 발급만 신경쓰느라 server-auth 에 인증/발급/갱신 모두 구성함

#### 조치

> server-gateway 인증 구현 필요. server-auth 불필요 인증 클래스 제거

---

### docker container 간 server 통신

#### 상황

> 한 서버에서 동작하는 docker의 여러개 컨테이너 간 통신 설정이 생각보다 쉽지 않았음
>
> docker container 에 소스코드 hotreload가 잘 되지 않아서 local 에서 작업하는데 테스트 성공했다가 docker container로 띄우면 또 실패하는 문제가 반복적으로 발생함

#### 조치

> gateway 내에 공통 함수로 http proxy 서비스를 구현해두고 이미 구현한 auth 서버의 jwt 발급(POST)을 성공할 때까지 테스트 진행함
>
> docker continer 상에서 반복 실패한 원인은 환경변수 설정이 잘못된 경우가 많았음.
>
> local에서 실행할 때에는 .env.local 파일에 임의 설정한 환경변수를들 사용했는데
>
> 계속 왔다갔다 하다보니 통신이 성공했을 때의 환경변수를 docker-compose.yml 내에 올바르게 옮기지 못하고 통신 실패 원인 파악까지 시간 허비를 꽤 많이 해버림...

---

### auth/event 서버에서의 서버 접근 보안

#### 상황

> gw 에서 jwt의 유효성 확인을 하지만 auth와 event 에서 controller 단에 아무것도 안 쓰고 진행하는 것이 찝찝함

#### 조치

> gw의 http proxy serivce 단에서 req.user 값이 있는 경우 proxy 요청의 header에 유저 정보들을 주입하는 것을 구현해두었음
>
> auth와 event 에서는 decorator 로 header로부터 값을 주입받고 controller 내부에서 validation 하는 방법으로 진행하기로 함

---

### gw post 요청 proxy 중 응답 없는 이슈

#### 상황

> authenticated decorator 구현 이후 docker container 로 통신 테스트를 다시 진행하는데 로그인을 포함한 post 요청이 auth 서버 단까지 넘어가지 않는 문제가 발생함

#### 조치

> 실제로 auth 서버 단까지 넘어가지 않는 것은 아니었고, 작업 중 code refactoring 하느 과정에서 header 값들 중 content-length 필드를 그대로 상속받아 전달하는 것이 오류의 원인임을 파악했음
>
> decorator 구현을 위해 http proxy serivce 에서 header에 ms-user 정보들은 담는 과정에서 content-length 필드는 제거함

#### 조치

---

### 개발 DB 서버의 부재 이슈

#### 상황

> 개발 서버 DB를 따로 구성하지 않고 docker의 mongodb 이미지를 실행시켜서 접속하도록 구성되어있음
>
> 현재 구성에서는 docker-compose를 실행 시킬 때, 최초 실행이라면 기본적인 테스트를 위한 데이터도 없는 상태임
>
> 필요한 initail 데이터들을 최초 생성 방안 필요

#### 조치 방안

- [ ] 각각의 service 들을 OnApplicationBootwtrap 구현체로 만든다
- [ ] mognodb initial script 를 만들고 docker volumes로 연동한다
- [ ] 별도의 initial data 생성 모듈을 구현한다
- [x] mongodb contaiver volume을 형상관리한다

---

### gw 서비스 코드 길이

#### 상황

> event 서버 구현을 진행하며 gw의 controller와 service를 맞춰서 구현하는데, event서버처럼 service 내의 각각에 기능별 메소드를 작성하려니 리소스 낭비처럼 느껴짐

#### 조치

> gw 의 service 단에서는 각 대상 서버의 url을 파싱하고 요청에 맞는 proxy http mehthod를 호출하는 것으로 수정

---

### mongoose 에러 발생 시의 응답값

#### 상황

> 생성 시 unique key 중복 테스트 등 단위 테스트 진행 중 응답 실패 시 모든 응답이 500 error 가 발생함

#### 조치

> global error filter 생성하여 적용
>
> mongoose 에러 같은 경우는 코드를 분류하여 별도 메세지 작성

#### 추후

> error response 응답 커스텀을 진행하고 싶지만 우선 기능 구현이 먼저인 듯 싶어 여건이 될 대 진행 필요

---

### 유저 보상 요청 및 이력

#### 상황

> 보상 요청에 대한 이력을 저장하고 read가 가능해야 함
>
> userId-eventId-rewardIds 값들과 '진행상태', '보상 수령 시간', '보상 수령 여부' 필드를 가지는 스키마를 구상했었음
>
> 유저-이벤트 간의 단건 기록만으로 이력을 모두 확인할 수 없는 문제 인지

#### 조치

> 구상한 스키마를 로그 테이블처럼 사용하기로 함.(RewardClaim schema)
>
> 구상한 스키마를 '유저아이디', '이벤트아이디', '보상수령시간', '참여상태' 를 가지는 스키마로 수정하고, 유저의 요청이 발생할 때마다 요청의 결과(상태)를 저장
>
> 유저는 이벤트 단위로 해당 이벤트의 보상 요청 최신값을 볼 수 있도록 함
>
> 운영자/감시자/관리자는 유저-이벤트 단위로 목록을 볼 수 있게 함
>
> 운영자/감시자/관리자는 보상요청 상세 데이터에서 해당 유저-이벤트의 이력들을 모두 볼 수 있게 함

---

### [운영자/감시자/관리자] 보상 요청 이력 조회

#### 상황

> 조회 조건을 이용해서 이력 조회를 진행하는데, (유저,이벤트) 그룹핑된 데이터의 최신 값만 불러와서 검색에 어려움이 있음
>
> 보상 요청 상태 등의 조건으로 검색 시 검색에 불편함이 있음

#### 조치

> 그룹핑을 사용하지 않음
>
> 최초에는 이력에서 이벤트 혹은 유저 단위로 검색 후 상세 화면에서 해당 보상 요청의 이력을 나열할 생각이었지만 리스트에서는 전체를 대상으로 조회 하는 것으로 수정
>
> 단일 보상 요청의 데이터를 요청하는 API는 추후 고도화를 위해 삭제하지 않음. 해당 요청에는 event와 reward 등의 데이터를 추가로 가져오도록 구현하면 상세 화면의 데이터가 유의미 해질 것으로 보임

---

### gw의 exception

#### 상황

> gw<->event/auth 통신 중 로직 상 의도적으로 발생시킨 exception message이 응답이 오지 않고 500 error로 통일됨

#### 조치

> http-proxy.service 를 수정하여, observable 의 catchError 를 지정해 발생한 exception를 그대로 발생시킴
>
> 서비스 단에서 그대로 발생시키기 때문에 gw response 까지도 전달됨
