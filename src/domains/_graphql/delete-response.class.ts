import { Field, ID } from 'type-graphql';

export default class DeleteResponse {
  @Field(() => ID)
  _id: string;
}
