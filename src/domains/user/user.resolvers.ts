import { Resolver, Arg, Query, Mutation } from 'type-graphql';

import { User, UserModel } from './user.model';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: false })
  async loggedInUser(@Arg('id') id: string) {
    return await UserModel.findById({ _id: id });
  }
}
