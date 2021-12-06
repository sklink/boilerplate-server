import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass, modelOptions as ModelOptions } from '@typegoose/typegoose';

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

  @Field()
  @Property({ type: mongoose.Schema.Types.Mixed, default: false, required: true })
  settings: object;

  @Field()
  @Property()
  deletedAt: Date;
}

export const UserModel = getModelForClass(User);
