import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client/extension';

type GetPresignedUrlArgs = {
  key: string;
  expiresIn: number;
};

type PutPresignedUrlArgs = {
  key: string;
  expiresIn: number;
};

type UploadFileArgs = {
  file: File;
  key: string;
};

export class StorageService {
  private readonly s3: S3Client;

  constructor(private readonly db: PrismaClient) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
      forcePathStyle: true,
    });
  }

  async putPresignedUrl(args: PutPresignedUrlArgs): Promise<string> {
    const { key, expiresIn } = args;

    const command = new PutObjectCommand({
      Bucket: 'storage',
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn });

    return signedUrl;
  }

  async getPresignedUrl(args: GetPresignedUrlArgs): Promise<string> {
    const { key, expiresIn } = args;

    const command = new GetObjectCommand({
      Bucket: 'storage',
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn });

    return signedUrl;
  }

  async uploadFile(args: UploadFileArgs) {
    const { file, key } = args;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'storage',
        Key: key,
        Body: file,
      }),
    );
  }

  async deleteFile(key: string) {
    const result = await this.s3.send(
      new DeleteObjectCommand({
        Bucket: 'storage',
        Key: key,
      }),
    );
  }
}
