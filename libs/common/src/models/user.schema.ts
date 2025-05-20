import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ versionKey: false })
@ObjectType()
export class UserDocument extends AbstractDocument {
    @Prop()
    @Field()
    email: string;

    @Prop()
    password: string;

    @Prop()
    @Field(() => [String], { nullable: true })
    roles?: string[];
}

export const UserSchema =
    SchemaFactory.createForClass(UserDocument);