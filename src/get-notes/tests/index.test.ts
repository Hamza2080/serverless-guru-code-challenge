import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../index';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('get all notes', () => {
  beforeEach(() => {
    process.env = { Notes_Table_Name: 'Note' };
  });

  afterEach(() => {
    ddbMock.reset();
  });

  it('Success, get all notes - 200 - database', async () => {
    ddbMock.on(QueryCommand).resolves({
      LastEvaluatedKey: {
        pk: 'notes',
        sk: '2022-12-10T17:07:40.143Z'
      },
      Items: [{
        pk: 'notes',
        sk: '2022-12-10T17:07:40.143Z',
        note: 'some note 1',
        topic: 'some Topic',
        createdAt: '2022-12-10T17:07:40.143Z',
        updatedAt: '2022-12-10T17:07:40.143Z',
        createdBy: 'Hamza Javed'
      }],
      Count: 1
    } as any);

    const response = await handler({} as any);

    expect(JSON.parse(response.body)).toEqual({
      next: 'eyJwayI6Im5vdGVzIiwic2siOiIyMDIyLTEyLTEwVDE3OjA3OjQwLjE0M1oifQ==',
      notes: [
        {
          sk: '2022-12-10T17:07:40.143Z',
          note: 'some note 1',
          topic: 'some Topic',
          createdAt: '2022-12-10T17:07:40.143Z',
          updatedAt: '2022-12-10T17:07:40.143Z',
          createdBy: 'Hamza Javed'
        }
      ]
    });
    expect(ddbMock.calls()).toHaveLength(1);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        TableName: 'Note', KeyConditionExpression: 'pk = :pk', ExpressionAttributeValues: { ':pk': 'notes' }, Limit: 20
      }
    );
  });

  it('Success, get all notes with limit and next page token - 200 - database', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [{
        pk: 'notes',
        sk: '2022-12-10T17:07:40.143Z',
        note: 'some note 1',
        topic: 'some Topic',
        createdAt: '2022-12-10T17:07:40.143Z',
        updatedAt: '2022-12-10T17:07:40.143Z',
        createdBy: 'Hamza Javed'
      }],
      Count: 1
    } as any);

    const response = await handler({ queryStringParameters: { limit: 1, next: 'eyJwayI6Im5vdGVzIiwic2siOiIyMDIyLTEyLTEwVDE3OjA3OjQwLjE0M1oifQ==' } } as any);

    expect(JSON.parse(response.body)).toEqual({
      notes: [
        {
          sk: '2022-12-10T17:07:40.143Z',
          note: 'some note 1',
          topic: 'some Topic',
          createdAt: '2022-12-10T17:07:40.143Z',
          updatedAt: '2022-12-10T17:07:40.143Z',
          createdBy: 'Hamza Javed'
        }
      ]
    });
    expect(ddbMock.calls()).toHaveLength(1);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        TableName: 'Note',
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: { ':pk': 'notes' },
        Limit: 1,
        ExclusiveStartKey: {
          pk: 'notes',
          sk: '2022-12-10T17:07:40.143Z'
        }
      }
    );
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
