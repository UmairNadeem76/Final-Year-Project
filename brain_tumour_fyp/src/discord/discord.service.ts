import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Client, Embed, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js';

export class DiscordMessagePayload {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    description: string;
}


@Injectable()
export class DiscordService {

    private client: Client;
    private channelId: string;
    private readonly logger = new Logger(DiscordService.name);
    private isReady: boolean = false;

    constructor(private readonly configService: ConfigService) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
            ],
        });
        this.channelId = this.configService.get<string>('DISCORD_CHANNEL_ID')!;
        this.client.on('ready', () => {
            this.isReady = true;
            this.logger.log(`Discord bot is ready!`);
        });

        this.client.login(this.configService.get<string>('DISCORD_BOT_TOKEN'))
            .catch(err => this.logger.error(`Failed to login to Discord: ${err}`));
    }

    async sendMessage(payload: DiscordMessagePayload) {
        if (!this.isReady) {
            this.logger.warn('Discord bot is not ready yet. Message will not be sent.');
            return;
        }
        try {
            const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
            if (!channel) {
                throw new Error(`Channel with ID ${this.channelId} not found`);
            }
            const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTimestamp()
            .setTitle(payload.title)
            .addFields(
                { name: 'Email', value: payload.email, inline: true },
            )
            .setDescription(payload.description);


            await channel.send({ embeds: [embed] });
            this.logger.log(`Message sent to Discord channel ${this.channelId}`);


        }
        catch(err) {
            this.logger.error(`Failed to send message: ${err}`);
            throw err
        }
    }


    onModuleDestroy() {
        this.client.destroy();
    }

}
