import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MriClassificationService {

    private readonly logger = new Logger(MriClassificationService.name);
    private readonly apiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,

    ) {
        this.apiUrl = this.configService.get<string>('API_URL')!;
    }


    async classifyMri(filename: string): Promise<string> {

        try {
            const response = await this.httpService.axiosRef.post(`${this.apiUrl}`, {
                filename: filename,
            });

            return response.data.predicted_class;
        }
        catch (error) {
            this.logger.error('Error Classifying MRI:', error);
            throw new HttpException(
                'Failed to classify MRI image',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}