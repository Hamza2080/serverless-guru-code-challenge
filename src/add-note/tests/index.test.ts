import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../index';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('add note', () => {
  beforeEach(() => {
    process.env = { Notes_Table_Name: 'Note' };
  });

  afterEach(() => {
    ddbMock.reset();
  });

  it('Success, add note - 200 - database', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');
    ddbMock.on(PutCommand).resolves({});

    await handler({
      body: JSON.stringify({
        note: 'some note 1',
        createdBy: 'Hamza Javed',
        topic: 'some Topic'
      })
    } as any);

    expect(ddbMock.calls()).toHaveLength(1);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        TableName: 'Note',
        Item: {
          pk: 'notes',
          sk: '2020-01-01T00:00:00.000Z',
          topic: 'some Topic',
          note: 'some note 1',
          createdBy: 'Hamza Javed',
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z'
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
      body: JSON.stringify({
        note: 'some note 1',
        createdBy: 'Hamza Javed',
        topic: 'some Topic'
      })
    } as any);

    expect(response).toEqual({ body: '{"message":"Error: Could not save Notes to DB - Error: something went wrong"}', statusCode: 500 });
    expect(ddbMock.calls()).toHaveLength(1);
  });
});
