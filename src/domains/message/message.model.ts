import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { User } from '../user/user.model';
import { Conversation } from '../conversation/conversation.model';

@ModelOptions({ schemaOptions: { timestamps: true } })
@ObjectType()
export class Message {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Property({ ref: () => Conversation, required: true })
  conversation!: Ref<Conversation>;

  @Field(() => ID)
  @Property({ ref: () => User, required: true })
  user!: Ref<User>;

  @Field(() => String)
  @Property({ required: true })
  content!: string;

  @Field(() => Date)
  @Property({ default: Date.now })
  sentAt!: Date;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const MessageModel = getModelForClass(Message);
