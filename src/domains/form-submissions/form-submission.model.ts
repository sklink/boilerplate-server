import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { User } from '../user/user.model';

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class FormSubmission {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  formRef!: string;

  @Field(type => User)
  @Property({ ref: () => User, required: true })
  user!: Ref<User>;

  @Field()
  @Property({ required: true })
  data!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const FormSubmissionModel = getModelForClass(FormSubmission);
