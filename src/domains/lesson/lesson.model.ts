import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Page {
  @Field()
  @Property({ required: false })
  label?: string;

  @Field(type => [ContentBlock])
  @Property({ required: true, default: [] })
  content!: ContentBlock[];
}

@ObjectType()
export class ContentBlock {
  @Field()
  @Property({ required: true })
  id!: string;

  @Field()
  @Property({ required: true })
  type!: string;

  @Field(type => String)
  @Property({ required: true })
  data!: String;
}

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Lesson {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  title!: string;

  @Field()
  @Property({ required: true })
  subtitle!: string;

  @Field()
  @Property({ required: true })
  description!: string;

  @Field(type => [Page], { nullable: "items" })
  @Property({ type: [Page], required: true, default: [] })
  pages!: (Page | null)[];

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const LessonModel = getModelForClass(Lesson);
