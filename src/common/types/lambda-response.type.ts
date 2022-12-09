export type LambdaResponseHeaders = { [headerName: string]: string }

export interface LambdaResponse {
  body: string;
  statusCode: number;
  headers?: LambdaResponseHeaders;
}
