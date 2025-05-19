export enum CLAIM_STATUS {
  APPROVED = 'APPROVED', // 보상 지급 완료
  DUPLICATED = 'DUPLICATED', // 중복 수령 요청
  NOT_YET_CLAIMABLE = 'NOT_YET_CLAIMABLE', // 보상 기간 이전
  EXPIRED = 'EXPIRED', // 기간 만료
  NOT_QUALIFIED = 'NOT_QUALIFIED', // 조건 미충족. 현재 구현 프로젝트에선 사용되지 않음
}

/**
 * 요청이 이미 있다
 * APPROVED -> DUPLICATED
 * DUPLICATED -> DUPLICATED
 * NOT_YET_CLAIMABLE -> 검증
 * EXPIRED -> EXPIRED
 * NOT_QUALIFIED -> 검증
 *
 * 요청이 없다
 * 일단 검증
 * 가능 -> APPROVED
 * 이전 -> NOT_YET_CLAIMABLE
 * 지남 -> EXPIRED
 * 미충족 -> NOT_QUALIFIED
 */
