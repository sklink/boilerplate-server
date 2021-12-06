import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { User } from './user.model';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  name: string;

  @Field()
  @Length(1, 255)
  description: String;
}
