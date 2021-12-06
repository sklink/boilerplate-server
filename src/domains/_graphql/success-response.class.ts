import { Field } from 'type-graphql';

export default class SuccessResponse {
  @Field()
  success: boolean;
}
