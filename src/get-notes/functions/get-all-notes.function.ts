import { QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { database } from 'src/common/aws-resources.function';
import { Token } from '../types/token.type';

export const getAllNotes = async (limit: string, lastKey: Token | undefined): Promise<QueryCommandOutput> => {
  const params: QueryCommandInput = {
    TableName: process.env.Notes_Table_Name,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'notes'
    },
    ...limit && { Limit: Number(limit) }
  };

  if (lastKey) {
    params.ExclusiveStartKey = lastKey;
  }

  return database().send(new QueryCommand(params));
};
