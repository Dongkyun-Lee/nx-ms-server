# nx-ms-server

> 이벤트 생성, 보상 신청, 보상 이력 확인을 위한 NestJS, MongoDB 기반의 gateway, auth, event 3개의 서버로 이루어진 MSA 프로젝트

---

## 주요 구성

| 구분    | 경로                 | 역할                                     |
| ------- | -------------------- | ---------------------------------------- |
| Gateway | nx-ms-server-gateway | API 요청 라우팅 및 인증 처리             |
| Auth    | nx-ms-server-auth    | JWT 기반 사용자 인증 서버                |
| Event   | nx-ms-server-event   | 이벤트와 보상의 CRUD 서버                |
| mongodb | mongodb_data         | 샘플 데이터 공유를 위한 container volume |

---

## 개발환경

| 구분          |                                                        |
| ------------- | ------------------------------------------------------ |
| OS            | Windows11(Desktop), OSX(Latptop)                       |
| Runtime       | Node(v18.20.8), Docker(28.04), Docker-compose(v2.34.0) |
| NestJS        | 10.4.9                                                 |
| PackageManger | yarn                                                   |

---

## docker container 구성

> 프로젝트는 4개의 이미지(3개의 프로젝트 + mongodb)를 실행함
>
> gateway 서버는 외부와 내부 네트워크를 통신하며, event와 auth 서버는 내부 네트워크를 사용하도록 목표로 함
>
> 개발 환경에서의 구성은 local 접근이 원활할 수 있도록 docker-compose 파일을 분리하였음

[docker-compose.local.yml(바로가기)](./docker-compose.local.yml)

- docker container로 실행하여도 각각의 프로젝트에 로컬호스트에서 접근할 수 있도록 설정한 파일

[docker-compose.prod.yml(바로가기)](./docker-compose.prod.yml)

- 실제 서비스 시의 시점을 고려하여 구성한 설정 파일

- 기본 샘플 유저 데이터 구성을 위하여 mongodb 의 volume mount는 프로젝트의 저장소로 설정하였음

---

## 실행

프로젝트 일괄 실행 (gw access only)

```sh
# NODE_ENV=production
docker-compose -f 'docker-compose.prod.yml' up -d --build
```

프로젝트 일괄 실행 (로컬 접근 가능)

```sh
# NODE_ENV=development
docker-compose -f 'docker-compose.local.yml' up -d --build
```

개별 프로젝트 로컬 실행

> 로컬 실행 시에는 mongodb 서비스를 별도로 시작해주어야 함
>
> docker-compose.local.yml 의 컨테이너 별 환경변수를 각 경로에 .env.{project}.local 파일 생성 필요
> 프로젝트 최상단의 local.envs 폴더에 있는 env 파일 사용 권장

```sh
# env 파일 복사
cp ${project_root}/local.envs/${target_env} ${project_root}/${target_project}
# cp ./local.env/.env.auth.local ./nx-ms-server-auth/

# project 폴더로 이동
cd ./${target-project}
# cd ./nx-ms-server-auth

# package 설치
yarn install
# 서버 구동
yarn start:dev
```

---

## sample dataset

> [initial script](./mongo-init/db-init.js) (password 는 `test` 로 동일)

---

## README

> 각 서버 별 기능 및 설계 배경은 서버 디렉토리의 README.md 참조 바랍니다.
>
> troubleshooing은 프로젝트 진행하면서 고민, 실수 등의 상황과 조치 내용을 작성해둔 파일입니다.

- [gateway readme](./nx-ms-server-gateway/README.md)
- [auth readme](./nx-ms-server-auth/README.md)
- [event readme](./nx-ms-server-event/README.md)
- [troubleshooting](./troubleshooting.md)

---

## troubleshooting

> 프로젝트 진행 중 고뇌했던 자잘한 흔적들 [훔쳐보기](./troubleshooting.md)

___

## 돌아보기

1. nestjs

  - node 생태계의 backend 를 사용해 본 것은 5년만입니다. nestjs 프레임워크 익숙해지느라 초반엔 작업량 없이 공부만 했습니다.
  - 그래도 집중해서 사용하다 보니 금방 익숙해지고 점차 작업에 속도가 붙어서 조금이나라 스스로 긴장감을 늦출 순 있었습니다.
  - 절대적인 시간을 작업량에 오롯이 쓰지 못한 것은 아쉽지만 역시 Learning by Doing 입니다.
  - 제출된 상태의 프로젝트 완성도가 스스로 만족스럽지 못하고 수정 보완해야할 것들 천지이지만 후회는 없습니다.
  - 기회가 된다면 차후에도 BE 프로젝트 담당이 되면 적극적으로 nestjs를 추천할 생각입니다. 재미를 느끼기 시작한 것이 아까워서라도 말이지요.
  - 한번 재미를 느껴 샛길로 새면 이런 것도 되나 저런 것도 되나 기능들을 찾아보고, 적용할 수 있을까 생각해보고 하는데 그런 성향이 지난 7일간을 스스로를 더욱 힘들게 했습니다.

2. 일정관리

  - 분명히 스스로에게 어색한 프레임워크와 아키텍처임이 분명하고 잘 인지하고 있었음에도 설계 접근 방식을 잘못 세웠다고 생각됩니다.
  - 어느 프로젝트에서든 기반과 인프라가 중요하다고 생각하고 있습니다. 그래서 GW, AUTH, EVENT 순으로 작업 순서를 잡았습니다.
  - 중요하다고 생각하고 있는 만큼 좀 더 차분히 여유를 서비스 로직부터 작업하며 프레임 워크에 익숙해지고 나서 AUTH, GW 순으로 작업했다면 작업 효율이나 시간 관리 측면에서 도움이 좀 더 됐었을 거라고 생각됩니다.
  - 그래도 고생한번 해보니 얻은 것은 있습니다. 5년이란 시간동안 개발이라면 어느정도 작업 별로 방향성을 잡을 수 있겠다 싶었었는데요. 이번 경험으로 늘 하던 방법이 늘 옳지만은 않겠구나 라는 걸 뼈저리게 느꼈습니다.

3. 예외처리

  - GW와 AUTH 단 정상 흐름이 확인된 게 5일차 즈음 이었습니다. 그 이후에 서비스 로직 부분 작업을 시작하게 되면서 마음속에 조바심이 너무 많이 생겨 예외처리를 제대로 하지 못해서 아쉽습니다.
  - 제출된 프로젝트의 완성도가 만족스럽기 않은 이유는 이것이 가장 큰 비중을 차지합니다.

4. 공통코드

  - 서버마다 공통된 코드 조각이나 파일들이 너무 많습니다. 기능 확인이 되면 바로 바로 일괄 적용하느라 더욱 많아졌네요. project의 디렉토리 구조를 잘 생각해서 공통된 모듈들은 한 곳으로 모았으면 좋지 않았을까 생각합니다.
  - 시간을 과하게 많이 투자한 것 같지만, 그래도 GW의 service <-> proxy 쪽 코드는 리팩토링을 꾸준히 진행하여 해당 부분은 꽤나 만족스럽습니다.

___

감사합니다.