import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, getModelForClass, modelOptions as ModelOptions, mongoose, Ref } from '@typegoose/typegoose';

@ObjectType()
export class LessonProgress {
  @Field(type => String)
  @Property({ required: true })
  lessonKey!: string;

  @Field(type => Int)
  @Property({ required: true, default: 0 })
  currPage!: number;

  @Field({ nullable: true })
  @Property()
  completedOn?: Date;
}

@ObjectType({ description: 'User model' })
@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  authId!: string;

  @Field()
  @Property()
  firstName?: string;

  @Field()
  @Property()
  lastName?: string;

  @Field({ nullable: true })
  @Property()
  subscriptionRef?: string;

  @Field({ nullable: true })
  @Property()
  subscriptionStatus?: string;

  @Field(type => [LessonProgress])
  @Property({ default: [], required: true })
  progress!: LessonProgress[];

  @Field()
  @Property({ default: false, required: true })
  hasDeleteRequest!: boolean;

  @Field()
  @Property({ default: false, required: true })
  isAdmin!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field({ nullable: true })
  @Property()
  deletedAt: Date;
}

export const UserModel = getModelForClass(User);
export default UserModel;
