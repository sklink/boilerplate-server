import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CreateLessonArgs {
  @Field()
  title!: string;

  @Field()
  subtitle!: string;

  @Field()
  description!: string;
}
