export type HttpMethod = 'get' | 'post' | 'delete' | 'put';

export interface HttpBaseResponse {
  status: number;
  data: any;
  error?: boolean;
  errorMessage?: string;
}
