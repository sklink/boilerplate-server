import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { Lesson } from '../lesson/lesson.model';

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Journey {
  @Field(() => ID)
  _id!: string;

  @Field(type => [Lesson])
  @Property({ ref: () => Lesson, required: true, default: [] })
  lessons!: Ref<Lesson>[];

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const JourneyModel = getModelForClass(Journey);
