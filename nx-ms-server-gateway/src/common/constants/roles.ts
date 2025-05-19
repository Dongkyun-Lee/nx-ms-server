export enum ROLES {
  ANONYMOUS = 'ANONYMOUS', // 등록되지 않은 권한
  USER = 'USER', // 보상 요청 가능
  OPERATOR = 'OPERATOR', // 이벤트/보상 등록
  AUDITOR = 'AUDITOR', // 보상 이력 조회만 가능
  ADMIN = 'ADMIN', // 모든 기능 접근 가능
}

export const ALL_ROLES_EXCEPT_ANONYMOUS = Object.values(ROLES).filter(
  (role) => role !== ROLES.ANONYMOUS,
);

export const ALL_USER_ROLES_EXCEPT_USER = Object.values(ROLES).filter(
  (role) => role !== ROLES.ANONYMOUS && role !== ROLES.USER,
);
