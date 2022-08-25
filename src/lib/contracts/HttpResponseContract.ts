export interface HttpResponseContract<T = any> {
  status: boolean;
  data: T;
  message: string;
}
