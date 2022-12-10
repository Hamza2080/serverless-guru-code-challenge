import { Token } from './token.type';

export type Note = {
  pk?: string,
  sk: string,
  note: string,
  topic: string,
  createdBy: string,
  updatedAt: string,
  createdAt: string
}

export type NoteQueryResponse = {
  LastEvaluatedKey?: Token;
  Items: Note[];
  Count: number;
}

export type NoteApiResponse = {
  notes: Note[];
  next?: string;
}
