import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/core/service/base.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { S3DAO } from "../dao/S3.DAO";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from "@nestjs/config";
import { S3DTO } from "../dtos/s3.dto";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { TenantContext } from "src/core/contexts/tenant.context";

@Injectable()
export class S3Service extends BaseService {
  private s3: S3Client;
  private readonly bucketName: string;
  private readonly bucketFolder: string;

  constructor(
    @InjectConnection() connection: Connection,
    @Inject(DATABASE_CONSTANTS.S3_DAO)
    private readonly s3Dao: S3DAO,
    private readonly configService: ConfigService,
  ) {
    super(connection);

    this.s3 = new S3Client({
      region: this.configService.get<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      },
    });

    this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME");
    this.bucketFolder = this.configService.get<string>("AWS_BUCKET_FOLDER");
  }

  async getSignedUploadUrl(fileName: string, fileType: string,projectId:string): Promise<{ signedUrl: string; fileUrl: string }> {
    const tenantId = TenantContext.getInstance().getTenantId();
    const key = `${this.bucketFolder}/${tenantId}/${projectId}/cde/scope/${fileName}`;

    if(!tenantId)
    {
        throw new NotFoundException("TenantId Not found")
    }
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });
  
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    const fileUrl = key;
  
    return {
      signedUrl,
      fileUrl,
    };
  }
  

  async saveFileRecord(dto: S3DTO) {
    return this.s3Dao.create(dto);
  }

  async getSignedDownloadUrl(fileName: string,projectId: string): Promise<string> {
    const tenantId = TenantContext.getInstance().getTenantId();
    const key = `${this.bucketFolder}/${tenantId}/${projectId}/cde/scope/${fileName}`;
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
  
    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async deleteFile(fileName: string, projectId: string): Promise<void> {
    const tenantId = TenantContext.getInstance().getTenantId();
    if (!tenantId) {
      throw new NotFoundException("TenantId not found");
    }
  
    const key = `${this.bucketFolder}/${tenantId}/${projectId}/cde/scope/${fileName}`;
  
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
  
    await this.s3.send(command);
  }

  async getAssessmentSignedUploadUrl(fileName: string, fileType: string): Promise<{ signedUrl: string; fileUrl: string }> {
    const tenantId = TenantContext.getInstance().getTenantId();
    const key = `${this.bucketFolder}/${tenantId}/assessment/scope/${fileName}`;

    if(!tenantId)
    {
        throw new NotFoundException("TenantId Not found")
    }
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });
  
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    const fileUrl = key;
  
    return {
      signedUrl,
      fileUrl,
    };
  }

  async getSignedAssessmentDownloadUrl(fileName: string): Promise<string> {
    const tenantId = TenantContext.getInstance().getTenantId();
    const key = `${this.bucketFolder}/${tenantId}/assessment/scope/${fileName}`;
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
  
    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async generatePresignedUrl(fileName: string, fileType: string, folderName: string): Promise<{ url: string; key: string }> {
    const tenantId = TenantContext.getInstance().getTenantId();
    const key = `${this.bucketFolder}/${tenantId}/${folderName}/${fileName}`;

    if (!tenantId) {
      throw new NotFoundException("TenantId Not found");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    
    return {
      url: signedUrl,
      key: key
    };
  }

  async getPresignedUrl(fileKey: string): Promise<{ url: string }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    
    return {
      url: signedUrl
    };
  }
}
