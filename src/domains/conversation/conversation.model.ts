import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { User } from '../user/user.model';

@ModelOptions({ schemaOptions: { timestamps: true } })
@ObjectType()
export class Conversation {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Property({ ref: () => User, required: true })
  user!: Ref<User>;

  @Field(() => String, { nullable: true })
  @Property({ type: () => Object, default: {} })
  readTo?: Record<string, any>;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const ConversationModel = getModelForClass(Conversation);
