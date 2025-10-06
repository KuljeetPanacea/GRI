import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/core/guards/permissions.guards";
import { Permissions } from "src/core/guards/permissions.guards";
import { S3Service } from "../service/s3.service";
import { S3DTO } from "../dtos/s3.dto";

@Controller("S3")
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Permissions("S3-Upload")
  @Get("upload-url")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getUploadSignedUrl(
    @Query("fileName") fileName: string,
    @Query("fileType") fileType: string,
    @Query("projectId") projectId: string,
  ) {
    return await this.s3Service.getSignedUploadUrl(fileName, fileType,projectId);
    
  }

  @Permissions("S3-Upload")
  @Post("complete-upload")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async saveUploadedFileMeta(@Body() body: S3DTO) {
    await this.s3Service.saveFileRecord(body);
    return { message: "Upload metadata saved successfully" };
  }

  @Permissions("S3-Upload")
  @Get("download-url")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getDownloadSignedUrl(@Query("fileName") fileName: string,@Query("projectId") projectId: string) {
  return  await this.s3Service.getSignedDownloadUrl(fileName,projectId);
}

@Permissions("S3-Upload")
@Delete("delete-file")
@UseGuards(JwtAuthGuard, PermissionsGuard)
async deleteFile(
  @Query("fileName") fileName: string,
  @Query("projectId") projectId: string,
) {
  await this.s3Service.deleteFile(fileName, projectId);
  return { message: "File deleted successfully" };
}

@Permissions("S3-Upload")
  @Get("assessment-upload-url")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getAssessmentSignedUploadUrl(
    @Query("fileName") fileName: string,
    @Query("fileType") fileType: string,
  ) {
    return await this.s3Service.getAssessmentSignedUploadUrl(fileName, fileType);
    
  }

  @Permissions("S3-Upload")
  @Get("download-url-assessment")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getDownloadSAssessment(@Query("fileName") fileName: string) {
  return  await this.s3Service.getSignedAssessmentDownloadUrl(fileName);
}

  @Permissions("S3-Upload")
  @Post("generate-presigned-url")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async generatePresignedUrl(@Body() body: { fileName: string; fileType: string; folderName: string }) {
    return await this.s3Service.generatePresignedUrl(body.fileName, body.fileType, body.folderName);
  }

  @Permissions("S3-Upload")
  @Post("get-presigned-url")
  @UseGuards(JwtAuthGuard,PermissionsGuard)
  async getPresignedUrl(@Body() body: { fileKey: string }) {
    return await this.s3Service.getPresignedUrl(body.fileKey);
  }

}