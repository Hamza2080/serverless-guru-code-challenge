import { GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/common/aws-resources.function';

export const getNoteById = async (sk: string): Promise<GetCommandOutput> => database().send(new GetCommand({
  TableName: process.env.Notes_Table_Name,
  Key: {
    pk: 'notes',
    sk
  }
}));
