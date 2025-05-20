// auth-db 초기 데이터
const authDB = db.getSiblingDB("auth-db");

authDB.users.insertMany([
  {
    nickname: "user1",
    email: "user1@test.com",
    password: "$2b$10$/47/D.zhRi4MvyT6AAuSvO9RgwqLO/tE2oPm7R0BIr0CIv.iE7QM2",
    roles: ["USER"]
  },
  {
    nickname: "user2",
    email: "user2@test.com",
    password: "$2b$10$/47/D.zhRi4MvyT6AAuSvO9RgwqLO/tE2oPm7R0BIr0CIv.iE7QM2",
    roles: ["USER"]
  },
  {
    nickname: "admin",
    email: "admin@test.com",
    password: "$2b$10$/47/D.zhRi4MvyT6AAuSvO9RgwqLO/tE2oPm7R0BIr0CIv.iE7QM2",
    roles: ["ADMIN"]
  },
  {
    nickname: "operator",
    email: "operator@test.com",
    password: "$2b$10$/47/D.zhRi4MvyT6AAuSvO9RgwqLO/tE2oPm7R0BIr0CIv.iE7QM2",
    roles: ["OPERATOR"]
  },
  {
    nickname: "auditor",
    email: "auditor@test.com",
    password: "$2b$10$/47/D.zhRi4MvyT6AAuSvO9RgwqLO/tE2oPm7R0BIr0CIv.iE7QM2",
    roles: ["AUDITOR"]
  }
]);

// event-db 초기 데이터
const eventDB = db.getSiblingDB("event-db");

eventDB.events.insertMany([
  {
    name: "봄 이벤트",
    condition: "몬스터 1000마리",
    eventStartDate: new Date("2025-01-01"),
    eventEndDate: new Date("2025-05-01"),
    rewardStartDate: new Date("2025-01-01"),
    rewardEndDate: new Date("2025-05-08"),
    isActive: true,
    rewardIds: []
  },
  {
    name: "헤이스트",
    condition: "몬스터 100000마리",
    eventStartDate: new Date("2025-01-01"),
    eventEndDate: new Date("2025-05-01"),
    rewardStartDate: new Date("2025-01-01"),
    rewardEndDate: new Date("2025-05-08"),
    isActive: true,
    rewardIds: []
  }
]);
