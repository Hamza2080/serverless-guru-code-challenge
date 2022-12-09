import { response } from 'src/common/response.function';

export const handler = async (event: any): Promise<any> => {
  console.log('hellow world');
  return response(null, 200);
};
