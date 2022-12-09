import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isDevelopmentMode = (): boolean => process.env.ENV === 'dev';

const getMarshallOptions = (): {
  convertEmptyValues: boolean,
  removeUndefinedValues: boolean,
  convertClassInstanceToMap: boolean
} => ({
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
});

export const database = (): DynamoDBDocumentClient => {
  const dynamodbClient = new DynamoDBClient({
    apiVersion: '2012-08-10',
    ...(isDevelopmentMode() && {
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'AWS_ACCESS_KEY',
        secretAccessKey: 'AWS_ACCESS_SECRET'
      }
    })
  });
  return DynamoDBDocumentClient.from(dynamodbClient, { marshallOptions: getMarshallOptions() });
};
