import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, getModelForClass, modelOptions as ModelOptions, mongoose, Ref } from '@typegoose/typegoose';

// Models
import { Lesson } from '../lesson/lesson.model';

@ObjectType()
export class UserSettings {
  @Field({ nullable: true })
  @Property()
  activeClinicId?: string;

  @Field({ nullable: true })
  @Property()
  activeJourneyId?: string;
}

@ObjectType()
export class LessonProgress {
  @Field(type => Lesson)
  @Property({ ref: () => Lesson, required: true })
  lesson!: Ref<Lesson>;

  @Field(type => Int)
  @Property({ required: true })
  currPage!: number;

  @Field()
  @Property()
  isCompleted!: boolean;
}

@ObjectType({ description: 'User model' })
@ModelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  authId!: string;

  @Field(type => UserSettings)
  @Property({ default: {}, required: true })
  settings!: UserSettings;

  @Field(type => [LessonProgress])
  @Property({ default: [], required: true })
  progress!: LessonProgress[];

  @Field()
  @Property({ default: false, required: true })
  isAdmin!: boolean;

  @Field({ nullable: true })
  @Property()
  deletedAt: Date;
}

export const UserModel = getModelForClass(User);
export default UserModel;
