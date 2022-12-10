import { encodeTokenIntoBase64 } from 'src/common/token.function';
import { Note, NoteApiResponse, NoteQueryResponse } from '../types/note.type';

export const getAllNotesResponseMapper = async (data: NoteQueryResponse): Promise<NoteApiResponse> => ({
  ...data.LastEvaluatedKey && { next: encodeTokenIntoBase64(data.LastEvaluatedKey as any) },
  notes: data.Items.map((item: Note) => ({
    sk: item.sk,
    note: item.note,
    topic: item.topic,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: item.createdBy
  }))
});
