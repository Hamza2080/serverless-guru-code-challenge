import { UpdateCommand, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/common/aws-resources.function';
import { UpdateNoteRequestType } from '../types/update-note.request.type';

export const updateNote = async (payload: UpdateNoteRequestType): Promise<UpdateCommandOutput> => {
  const isoDate = new Date().toISOString();
  payload.updatedAt = isoDate;

  const {
    updatedAt, sk, note, topic
  } = payload;

  const body = {
    updatedAt, note, topic
  };

  const params: any = {
    UpdateExpression: '',
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {}
  };

  let prefix = 'set ';
  Object.keys(body).forEach(attributeName => {
    const dbAttribute = attributeName[0].toLowerCase() + attributeName.substring(1);
    params.UpdateExpression += `${prefix}#${dbAttribute} = :${dbAttribute}`;
    params.ExpressionAttributeValues[`:${dbAttribute}`] = payload[attributeName];
    params.ExpressionAttributeNames[`#${dbAttribute}`] = dbAttribute;
    prefix = ', ';
  });

  return database().send(new UpdateCommand({
    TableName: process.env.Notes_Table_Name,
    Key: { pk: 'notes', sk },
    ...params
  }));
};
