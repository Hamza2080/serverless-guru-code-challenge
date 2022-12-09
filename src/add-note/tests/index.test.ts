import { handler } from '../index';

describe('send email through exponea', () => {
  it('hit add note - get 200 in resoponse', async () => {
    expect(await handler({})).toEqual({ body: 'null', statusCode: 200 });
  });
});
