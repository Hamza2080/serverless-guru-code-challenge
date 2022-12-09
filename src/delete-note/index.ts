import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError } from 'src/common/error';
import { getErrorStatus } from 'src/common/get-error-status.function';
import { response } from 'src/common/response.function';
import { deleteNote } from './functions/delete-note.function';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { sk } = event.queryStringParameters;
    if (!sk) {
      throw new BadRequestError('Bad-Request: missing {sk}');
    }

    await deleteNote(sk);
    return response({ message: 'success' }, 200);
  } catch (e) {
    return response({ message: e.toString() }, getErrorStatus(e), { error: e });
  }
};
