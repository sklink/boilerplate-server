import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { Journey } from '../journey/journey.model';

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Clinic {
  @Field(() => ID)
  _id!: string;

  @Field(type => Journey, { nullable: true })
  @Property({ ref: () => Journey })
  journey?: Ref<Journey>;

  @Field()
  @Property({ required: true })
  name!: string;

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const ClinicModel = getModelForClass(Clinic);
