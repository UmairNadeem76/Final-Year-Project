import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = User & Document & {
    addRecord: (filename: string, result: string) => UserDocument;
};

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

const HistorySchema = new MongooseSchema({
    filename: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    result: { type: String, required: true },
}, { _id: false });

export type DiagnosisHistory = {
    filename: string;
    timestamp: Date;
    result: string;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ default: UserRole.USER })
    role: UserRole;

    @Prop({
        type: [HistorySchema],
        default: [],
    })
    history: DiagnosisHistory[];
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.methods.addRecord = function (filename: string, result: string) {
    const historyItem = { filename, result, timestamp: new Date() };
    this.history.push(historyItem);
    this.save();
    return this;
}