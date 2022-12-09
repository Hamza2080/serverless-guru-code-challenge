import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../index';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('delete note', () => {
  beforeEach(() => {
    process.env = { Notes_Table_Name: 'Note' };
  });

  afterEach(() => {
    ddbMock.reset();
  });

  it('Success, delete note - 200 - database', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    await handler({
      queryStringParameters: {
        sk: '2020-01-01T00:00:00.000Z'
      }
    } as any);

    expect(ddbMock.calls()).toHaveLength(1);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        Key: { pk: 'notes', sk: '2020-01-01T00:00:00.000Z' },
        TableName: 'Note'
      }
    );
  });

  it('Error, sk not exist - 400', async () => {
    process.env.DYNAMODB_ENDPOINT = '';

    const response = await handler({ queryStringParameters: {} } as any);

    expect(response).toEqual({ body: '{"message":"Error: Bad-Request: missing {sk}"}', statusCode: 400 });
  });

  it('Error, database error - 500', async () => {
    process.env.DYNAMODB_ENDPOINT = '';

    ddbMock.callsFake(() => {
      throw new Error('something went wrong');
    });

    const response = await handler({
      queryStringParameters: {
        sk: '2020-01-01T00:00:00.000Z'
      }
    } as any);

    expect(response).toEqual({ body: '{"message":"Error: something went wrong"}', statusCode: 500 });
    expect(ddbMock.calls()).toHaveLength(1);
  });
});
