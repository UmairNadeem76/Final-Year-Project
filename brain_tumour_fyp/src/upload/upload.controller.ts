import { Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersGuard } from 'src/users/users.guard';
import { UploadService } from './upload.service';
import { UsersService } from 'src/users/users.service';
import { MriClassificationService } from 'src/mri-classification/mri-classification.service';
import { Response } from 'express';

@Controller('upload')
export class UploadController {

    constructor(
        private readonly uploadService: UploadService,
        private readonly usersService: UsersService,
        private readonly mriClassificationService: MriClassificationService) { }

    @UseGuards(UsersGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }), // 20MB
                    new FileTypeValidator({ fileType: /(image\/jpeg|image\/png|image\/HEIF|image\/HEIC)/ }),
                ],

            }),
        )
        file: Express.Multer.File,
        @Req() request,
    ) {
        const email = request.user.email;
        if (!file) {
            throw new HttpException('File Not Found', HttpStatus.BAD_REQUEST);
        }
        const filename = await this.uploadService.saveFile(file, email);
        const res = await this.mriClassificationService.classifyMri(filename);
        await this.usersService.addRecord(email, filename, res);
        return {
            prediction: res,
        }
    }

    @Get('/display/:filename')
    async displayImage(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = await this.uploadService.getFile(filename);
        if (!filePath) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }
        res.sendFile(filePath, { headers: { 'Content-Type': /(image\/jpeg|image\/png|image\/HEIF|image\/HEIC)/ } });
    }
}