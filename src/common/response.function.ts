import { LambdaResponse } from './types/lambda-response.type';
import { ResponseOptions } from './types/response-options.type';

/**
 *
 * @param {object} data
 * @param {number} statusCode
 * @param {ResponseOptions} options
 *
 * @returns {LambdaResponse}
 */
export async function response(data: unknown, statusCode: number, options?: ResponseOptions): Promise<LambdaResponse> {
  const res: LambdaResponse = {
    body: JSON.stringify(data),
    statusCode
  };

  // Check if optional and headers exist, if yes attach them to the response
  if (options && options.headers) res.headers = options.headers;

  return res;
}
