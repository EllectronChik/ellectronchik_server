export class createDiaryNoteDto {
  readonly encryptedTitle: string;
  readonly encryptedText: string;
  readonly tags: string[];
  readonly userId: string;
}
