import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { User } from '../user/user.model';
import { Clinic } from '../clinic/clinic.model';

export enum ROLE {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  CLINIC_STAFF = 'CLINIC_STAFF',
  CLINIC_ADMIN = 'CLINIC_ADMIN',
}

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Member {
  @Field(() => ID)
  _id!: string;

  @Field(type => User)
  @Property({ ref: () => User, required: true })
  user!: Ref<User>;

  @Field(type => Clinic)
  @Property({ ref: () => Clinic, required: true })
  clinic!: Ref<Clinic>;

  @Field(type => [ROLE])
  @Property({ type: [String], required: true, enum: ROLE })
  roles!: ROLE[];

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const MemberModel = getModelForClass(Member);
