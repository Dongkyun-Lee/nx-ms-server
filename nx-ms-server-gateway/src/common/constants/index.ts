import { HttpMethod } from '../types';

export const HTTP_CONSTANTS = {
  GET: 'get' as HttpMethod,
  POST: 'post' as HttpMethod,
  DELETE: 'delete' as HttpMethod,
  PUT: 'put' as HttpMethod,
};

export * from './roles';
