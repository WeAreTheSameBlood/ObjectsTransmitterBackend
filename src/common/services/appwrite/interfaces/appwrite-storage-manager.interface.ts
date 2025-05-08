export interface IAppWriteStorageManager {
  // Upload
  uploadModelFile(
    file: Express.Multer.File,
    bucketId: string
  ): Promise<string>;

  // Download
  getFileDownloadUrl(
    bucketId: string,
    fileId: string
  ): string;
}
