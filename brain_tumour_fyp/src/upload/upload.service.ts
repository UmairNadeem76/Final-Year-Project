import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UploadService {

  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, email: string): Promise<string> {
    try {
      const fileExt = path.extname(file.originalname);
      const uniqueId = uuidv4();
      const filename = `${uniqueId}${fileExt}`;

      // Save file
      const filePath = path.join(this.uploadDir, filename);
      await fs.writeFile(filePath, file.buffer);

      return filename;

    } catch (error) {
      console.error('Error Saving File:', error);
      throw new HttpException('Failed To Save File', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFile(filename: string): Promise<string> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.access(filePath); // Check if file exists
      return filePath;
    } catch (error) {
      console.error('Error Accessing File:', error);
      throw new HttpException('File Not Found', HttpStatus.NOT_FOUND);
    }
  }
}