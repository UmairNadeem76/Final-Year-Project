import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UsersModule } from 'src/users/users.module';
import { MriClassificationModule } from 'src/mri-classification/mri-classification.module';

@Module({
  imports: [
    UsersModule,
    MriClassificationModule
  ],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule { }
