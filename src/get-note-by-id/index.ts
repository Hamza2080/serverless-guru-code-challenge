import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError, ItemNotFoundException } from 'src/common/error';
import { getErrorStatus } from 'src/common/get-error-status.function';
import { get } from 'src/common/get.function';
import { response } from 'src/common/response.function';
import { getNoteByIdResponseMapper } from './functions/get-note-by-id-response-mapper.function';
import { getNoteById } from './functions/get-note.function';
import { NoteQueryResponse } from './types/note.type';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const sk: string = get(event, 'queryStringParameters.sk', null);
    if (!sk) {
      throw new BadRequestError('Bad-Request: missing {sk}');
    }

    const note = await getNoteById(sk);
    if (!note.Item) {
      throw new ItemNotFoundException('Not-Found: note not found against id');
    }

    return response(getNoteByIdResponseMapper(note.Item as NoteQueryResponse), 200);
  } catch (e) {
    return response({ message: e.toString() }, getErrorStatus(e), { error: e });
  }
};
