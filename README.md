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
