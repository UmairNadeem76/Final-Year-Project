import { Module } from '@nestjs/common';
import { MriClassificationService } from './mri-classification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MriClassificationService],
  exports: [MriClassificationService],
})
export class MriClassificationModule { }
