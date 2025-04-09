import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, DiagnosisHistory  } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

export type UserPayload = {
    email: string;
    password: string;
    name: string;
    role: string;
    history: DiagnosisHistory[];
}

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.logger.log('UsersService initialized');
    }

    private async findUserByEmail(email: string): Promise<UserPayload | null> {

        const user = await this.userModel.findOne({ email });
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
        }
        this.logger.log(`User found for email: ${email}`);
        const userObject = user.toObject();

        return userObject as UserPayload;

    }

    private async createUser(createUserDto: CreateUserDto): Promise<UserPayload> {
        const { email, password, name } = createUserDto;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await this.userModel.create({
            email,
            password: hashedPassword,
            name,
        });
        this.logger.log(`User created: ${email}`);
        return newUser.toObject() as UserPayload;
        
        
    }


    private async validateUser(loginDto: LoginDto): Promise<UserPayload | null> {
        const { email, password } = loginDto;
        const user = await this.findUserByEmail(email);
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            this.logger.warn(`Invalid password for email: ${email}`);
            return null;
        }
        this.logger.log(`User validated: ${email}`);
        return user;
    }


    async register(createUserDto: CreateUserDto): Promise<UserPayload> {
        const { email } = createUserDto;
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            this.logger.warn(`User already exists: ${email}`);
            throw new Error('User already exists');
        }
        return this.createUser(createUserDto);
    }

    async login(loginDto: LoginDto): Promise<string> {
        const user = await this.validateUser(loginDto);
        if (!user) {
            this.logger.warn(`Invalid credentials for email: ${loginDto.email}`);
            throw new Error('Invalid credentials');
        }
        const payload = { email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '24h',
        });
        this.logger.log(`User logged in: ${user.email}`);
        return accessToken;
    }

    async getUserData(email: string): Promise<any | null> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            return null;
        }
        const {password, ...userData} = user;
        this.logger.log(`User data retrieved for email: ${email}`);
        return userData;
    }

    isAccessTokenValid(token: string): any | false {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            return {
                email: payload.email,
                role: payload.role,
            };
        } catch (error) {
            this.logger.error(`Invalid access token: ${token}`, error);
            return false;
        }
    }

    async addRecord(email: string, filename: string, result: string): Promise<Partial<UserPayload>> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            throw new Error('User not found');
        }
        const updatedUser = user.addRecord(filename, result);
        const userObject = updatedUser.toObject();
        this.logger.log(`Record added for user: ${email}`);
        const { password, ...userData } = userObject;
        return userData as Partial<UserPayload>;

    }

    
}
