export type LambdaResponseHeaders = { [headerName: string]: string }

export type ResponseOptions = {
  headers?: LambdaResponseHeaders;
  error?: Error;
}
