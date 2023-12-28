import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass, modelOptions as ModelOptions, mongoose } from '@typegoose/typegoose';
import { IUser, IUserSettings } from './user.interfaces';

@ObjectType({ description: 'User model' })
@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Property({ required: true })
  name: string;

  @Field()
  @Property({ required: true, unique: true, index: true, lowercase: true })
  email: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property()
  salt: string;

  @Field()
  @Property({ default: false, required: true })
  isVerified: boolean;

  @Field()
  @Property({ default: false, required: true })
  isAdmin: boolean;

  @Field(type => UserSettings)
  @Property({ default: false, required: true })
  settings: IUserSettings;

  @Field()
  @Property()
  deletedAt: Date;
}

@ObjectType()
export class UserSettings {
  @Field({ nullable: true })
  activeCompany?: string;

  @Field({ nullable: true })
  activeProject?: string;
}

export const UserModel = getModelForClass(User);
