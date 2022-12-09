import { DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/common/aws-resources.function';

export const deleteNote = async (sk: string): Promise<DeleteCommandOutput> => database().send(new DeleteCommand({
  Key: { pk: 'notes', sk },
  TableName: process.env.Notes_Table_Name
}));
