import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/common/constant';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, unique: true, match: /^\S+@\S+\.\S+$/ })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: ROLES, default: ROLES.ANONYMOUS })
  roles: string[];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;

  @Prop()
  refreshToken?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
