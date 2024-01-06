import * as shortid from 'shortid';
import { prop as Property, getModelForClass, modelOptions as ModelOptions, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

// Models
import { User } from '../user/user.model';
import { Clinic } from '../clinic/clinic.model';
import { ROLE } from '../member/member.model';
import { getExpiryDate } from './invite.utils';

export enum STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REMOVED = 'removed',
}

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Invite {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Property({ required: true })
  email!: string;

  @Field()
  @Property({ required: true, default: shortid.generate })
  code!: string;

  @Field()
  @Property({ required: true, default: getExpiryDate() })
  expiresAt!: Date;

  @Field(type => STATUS)
  @Property({ enum: STATUS, default: STATUS.PENDING, required: true })
  status!: STATUS;

  @Field()
  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  @Field()
  @Property({ required: true, default: Date.now() })
  sentAt: Date;

  @Field(type => User)
  @Property({ ref: () => User, required: true })
  sentBy!: Ref<User>;

  @Field(type => Clinic)
  @Property({ ref: () => Clinic, required: true })
  clinic!: Ref<Clinic>;

  @Field(type => ROLE)
  @Property({ type: () => [ROLE], required: true })
  roles!: ROLE[];

  @Field({ nullable: true })
  @Property()
  deletedAt?: Date;
}

export const InviteModel = getModelForClass(Invite);
