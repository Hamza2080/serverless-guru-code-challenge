import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/common/aws-resources.function';
import { AddNoteRequestType } from '../types/add-note.request.type';

export const addNote = async (payload: AddNoteRequestType): Promise<PutCommandOutput> => {
  try {
    const isoDate = new Date().toISOString();
    const { note, topic, createdBy } = payload;

    return database().send(new PutCommand({
      TableName: process.env.Notes_Table_Name,
      Item: {
        pk: 'notes',
        sk: isoDate,
        topic,
        note,
        createdBy,
        createdAt: isoDate,
        updatedAt: isoDate
      }
    }));
  } catch (e) {
    throw new Error(`Could not save Notes to DB - ${e.toString()}`);
  }
};
