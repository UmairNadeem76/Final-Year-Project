import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { MriClassificationModule } from './mri-classification/mri-classification.module';
import { DiscordModule } from './discord/discord.module';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UploadModule,
    MriClassificationModule,
    DiscordModule,
  ],
  controllers: [NotificationsController],
})
export class AppModule {}
