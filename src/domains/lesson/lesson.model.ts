import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Lesson {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  title!: string;

  @Field(type => [String])
  @Property({ type: [String], required: true, default: [] })
  pages!: string[];

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const LessonModel = getModelForClass(Lesson);
