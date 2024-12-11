import { ArgsType, Field, ID, InputType, Int, ObjectType } from "type-graphql";

@ArgsType()
export class CreateLessonArgs {
  @Field()
  title!: string;

  @Field()
  subtitle!: string;

  @Field()
  description!: string;
}

@InputType()
export class EditLessonInput {
  @Field()
  title!: string;

  @Field()
  subtitle!: string;

  @Field()
  description!: string;
}

@ArgsType()
export class EditLessonArgs {
  @Field(type => ID)
  lessonId!: string;

  @Field(type => EditLessonInput)
  data!: EditLessonInput;
}

@ArgsType()
export class EditLessonPageArgs {
  @Field(type => ID)
  lessonId!: string;

  @Field(type => Int)
  pageNum!: number;

  @Field()
  label!: string;

  @Field(type => [ContentBlockArgs])
  blocks!: ContentBlockArgs[];
}

@ArgsType()
export class RemoveLessonPageArgs {
  @Field(type => ID)
  lessonId!: string;

  @Field(type => Int)
  pageNum!: number;
}

@InputType()
export class ContentBlockArgs {
  @Field()
  id!: string;

  @Field()
  type!: string;

  @Field(type => String)
  data!: String;
}

@ObjectType()
export class StatusResponse {
  @Field()
  success!: boolean;
}
