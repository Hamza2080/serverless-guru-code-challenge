import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { get } from 'src/common/get.function';
import { decodeTokenFromBase64 } from 'src/common/token.function';
import { response } from 'src/common/response.function';
import { getErrorStatus } from 'src/common/get-error-status.function';
import { getAllNotes } from './functions/get-all-notes.function';
import { getAllNotesResponseMapper } from './functions/get-all-notes-response-mapper.function';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const limit: string = get(event, 'queryStringParameters.limit', 20);
    let lastKey = get(event, 'queryStringParameters.next', null);
    lastKey = lastKey ? decodeTokenFromBase64(lastKey as string) : null;

    const notes = await getAllNotes(limit, lastKey) as any;
    return response(await getAllNotesResponseMapper(notes), 200);
  } catch (error) {
    return response({ message: error.toString() }, getErrorStatus(error), { error });
  }
};
