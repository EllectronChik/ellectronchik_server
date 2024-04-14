export default interface IFile {
  originalname: string;
  mimetype: string;
  encoding: string;
  size: number;
  buffer: Buffer;
  fieldname: string;
}