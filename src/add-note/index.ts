import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getErrorStatus } from 'src/common/get-error-status.function';
import { joiValidatePayload } from 'src/common/joi-validation.function';
import { response } from 'src/common/response.function';
import { addNote } from './functions/add-note.function';
import { addNoteJoiSchema } from './schema/add-note.schema';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const payload = JSON.parse(String(event.body));
    joiValidatePayload(payload, addNoteJoiSchema());

    await addNote(payload);
    return response({ message: 'success' }, 200);
  } catch (e) {
    return response({ message: e.toString() }, getErrorStatus(e), { error: e });
  }
};
