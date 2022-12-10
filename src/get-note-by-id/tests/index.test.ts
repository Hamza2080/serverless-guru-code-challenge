import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../index';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('get note by id', () => {
  beforeEach(() => {
    process.env = { Notes_Table_Name: 'Note' };
  });

  afterEach(() => {
    ddbMock.reset();
  });

  it('Success, get note by id - 200 - database', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        pk: 'notes',
        sk: '2022-12-10T17:07:40.143Z',
        note: 'some note 1',
        topic: 'some Topic',
        createdAt: '2022-12-10T17:07:40.143Z',
        updatedAt: '2022-12-10T17:07:40.143Z',
        createdBy: 'Hamza Javed'
      }
    });

    const response = await handler({
      queryStringParameters: {
        sk: '2020-01-01T00:00:00.000Z'
      }
    } as any);

    expect(JSON.parse(response.body)).toEqual({
      sk: '2022-12-10T17:07:40.143Z', note: 'some note 1', topic: 'some Topic', createdAt: '2022-12-10T17:07:40.143Z', updatedAt: '2022-12-10T17:07:40.143Z', createdBy: 'Hamza Javed'
    });
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

  it('Error, note not found - 404 - database', async () => {
    ddbMock.on(GetCommand).resolves({});

    const response = await handler({
      queryStringParameters: {
        sk: '2020-01-01T00:00:00.000Z'
      }
    } as any);

    expect(response).toEqual({ body: '{"message":"Error: Not-Found: note not found against id"}', statusCode: 404 });
  });
});
