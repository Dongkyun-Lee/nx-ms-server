import { HttpBaseResponse } from 'src/common/types';

export interface GetHelloResponse extends HttpBaseResponse {
  data: string;
}
