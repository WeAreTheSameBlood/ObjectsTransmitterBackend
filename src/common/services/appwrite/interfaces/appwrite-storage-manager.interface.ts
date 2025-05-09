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

  // Backup Data
  uploadBackupFile(
    data: Buffer,
    bucketId: string,
    remoteKey: string,
  ): Promise<string>;
}
