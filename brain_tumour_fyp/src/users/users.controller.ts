import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersGuard } from './users.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        createUserDto.email = createUserDto.email.toLowerCase();
        try {
            await this.usersService.register(createUserDto);
            return { message: `User ${createUserDto.email} Registered Successfully` };
        } catch (error) {
            if (error.message === 'User Already Exists') {
                throw new HttpException('User Already Exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        loginDto.email = loginDto.email.toLowerCase();
        try {
            const accessToken = await this.usersService.login(loginDto);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: this.configService.get('NODE_ENV') === 'production',
                sameSite: this.configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            return { message: `User ${loginDto.email} Logged In Successfully` };
        }
        catch (error) {
            if (error.message === 'Invalid credentials') {
                throw new HttpException('Invalid Credentials. Please Recheck And Try Again.', HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(UsersGuard)
    @Post('logout')
    async logout(@Req() request) {
        request.res.clearCookie('accessToken', { path: '/' });
        return { message: 'User logged out successfully' };
    }

    @UseGuards(UsersGuard)
    @Get('me')
    async getMe(@Req() request) {
        const email = request.user.email;
        const user = await this.usersService.getUserData(email);
        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}