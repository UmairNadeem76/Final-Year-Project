import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { DiscordMessagePayload, DiscordService } from 'src/discord/discord.service';

@Controller('notifications')
export class NotificationsController {


    private readonly logger = new Logger(NotificationsController.name);

    constructor(private readonly discordService: DiscordService) {}

    @Post('/')
    async sendNotification(@Body() payload: DiscordMessagePayload) {
        try {
            await this.discordService.sendMessage(payload);
            return { message: 'Notification sent successfully' };
        } catch (error) {
            this.logger.error(`Failed to send notification: ${error}`);
            throw new HttpException('Failed to send notification', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
