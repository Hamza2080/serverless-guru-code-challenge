import { NoteApiResponse, NoteQueryResponse } from '../types/note.type';

export const getNoteByIdResponseMapper = (data: NoteQueryResponse): NoteApiResponse => ({
  sk: data.sk,
  note: data.note,
  topic: data.topic,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  createdBy: data.createdBy
});
