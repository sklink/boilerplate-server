import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import { User, UserModel } from './user.model';
import { UserInput } from './user.inputs';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: false })
  async loggedInUser(@Arg('id') id: string) {
    return await UserModel.findById({ _id: id });
  }

  @Query(() => [User])
  async returnAllUser() {
    return await UserModel.find();
  }

  @Mutation(() => User)
  async createCategory(
    @Arg('data') { name, description }: UserInput
  ): Promise<User> {
    const category = (
      await UserModel.create({
        name,
        description,
      })
    ).save();
    return category;
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: string) {
    await UserModel.deleteOne({ id });
    return true;
  }
}
