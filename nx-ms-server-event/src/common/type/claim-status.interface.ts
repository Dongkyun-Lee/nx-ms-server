export enum CLAIM_STATUS {
  PENDING = 'PENDING', // 진행중
  QUALIFIED = 'QUALIFIED', // 이벤트 완료 && 보상 요청 x
  REQUESTED = 'REQUESTED', // 보상 요청
  APPROVED = 'APPROVED', // 보상 지급 완료
  REJECTED = 'REJECTED', // 보상 요청 거절
  EXPIRED = 'EXPIRED', // 기간 만료
}
