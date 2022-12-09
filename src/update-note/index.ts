import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ItemNotFoundException } from 'src/common/error';
import { getErrorStatus } from 'src/common/get-error-status.function';
import { joiValidatePayload } from 'src/common/joi-validation.function';
import { response } from 'src/common/response.function';
import { getNoteById } from './functions/get-note.function';
import { updateNote } from './functions/update-note.function';
import { updateNoteJoiSchema } from './schema/update-note.schema';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const payload = JSON.parse(String(event.body));
    joiValidatePayload(payload, updateNoteJoiSchema());

    const note = await getNoteById(payload.sk);
    if (!note.Item) {
      throw new ItemNotFoundException('Not-Found: note not found against id');
    }

    await updateNote(payload);
    return response({ message: 'success' }, 200);
  } catch (e) {
    return response({ message: e.toString() }, getErrorStatus(e), { error: e });
  }
};
