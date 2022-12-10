export function encodeTokenIntoBase64(nextPageToken: { [key: string]: string }): string {
  return Buffer.from(JSON.stringify(nextPageToken)).toString('base64');
}

export function decodeTokenFromBase64(nextPageToken: string): { [key: string]: string } {
  return JSON.parse(Buffer.from(nextPageToken, 'base64').toString());
}
