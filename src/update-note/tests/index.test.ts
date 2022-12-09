import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../index';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('update note', () => {
  beforeEach(() => {
    process.env = { Notes_Table_Name: 'Note' };
  });

  afterEach(() => {
    ddbMock.reset();
  });

  it('Success, update note - 200 - database', async () => {
    const mockGetNoteCall = jest.spyOn(require('../functions/get-note.function'), 'getNoteById').mockReturnValue({ Item: { pk: 'notes', sk: 'isoDate' } });
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');
    ddbMock.on(UpdateCommand).resolves({});

    await handler({
      body: JSON.stringify({
        sk: '2020-01-01T00:00:00.000Z',
        note: 'some note 1',
        topic: 'some Topic'
      })
    } as any);

    expect(ddbMock.calls()).toHaveLength(1);
    expect(mockGetNoteCall).toBeCalledTimes(1);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        TableName: 'Note',
        Key: { pk: 'notes', sk: '2020-01-01T00:00:00.000Z' },
        UpdateExpression: 'set #updatedAt = :updatedAt, #note = :note, #topic = :topic',
        ExpressionAttributeValues: {
          ':note': 'some note 1',
          ':topic': 'some Topic',
          ':updatedAt': '2020-01-01T00:00:00.000Z'
        },
        ExpressionAttributeNames: { '#note': 'note', '#topic': 'topic', '#updatedAt': 'updatedAt' }
      }
    );
  });

  it('Error, update note - 404 - database', async () => {
    const mockUpdateNoteCall = jest.spyOn(require('../functions/update-note.function'), 'updateNote').mockReturnValue(null);
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');
    ddbMock.on(GetCommand).resolves({});

    await handler({
      body: JSON.stringify({
        sk: '2020-01-01T00:00:00.000Z',
        note: 'some note 1',
        topic: 'some Topic'
      })
    } as any);

    expect(ddbMock.calls()).toHaveLength(1);
    expect(mockUpdateNoteCall).toBeCalledTimes(0);
    expect(ddbMock.call(0).firstArg.input).toEqual(
      {
        TableName: 'Note',
        Key: { pk: 'notes', sk: '2020-01-01T00:00:00.000Z' }
      }
    );
  });

  it('Error, database error - 500', async () => {
    const mockGetNoteCall = jest.spyOn(require('../functions/get-note.function'), 'getNoteById').mockReturnValue({ Item: { pk: 'notes', sk: 'isoDate' } });
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2020-01-01T00:00:00.000Z');
    ddbMock.on(UpdateCommand).rejects({ message: 'something went wrong' });

    const response = await handler({
      body: JSON.stringify({
        sk: '2020-01-01T00:00:00.000Z',
        note: 'some note 1',
        topic: 'some Topic'
      })
    } as any);

    expect(ddbMock.calls()).toHaveLength(1);
    expect(mockGetNoteCall).toBeCalledTimes(1);
    expect(response).toEqual({ body: '{"message":"Error: something went wrong"}', statusCode: 500 });
  });
});
