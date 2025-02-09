import { Resolver, Query, Ctx, FieldResolver, Mutation, InputType, Field, Arg, Int } from 'type-graphql';
import { Inject, Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { User, UserModel } from './user.model';

// Services
import { UserService } from './user.service';

@InputType()
class RegistrationInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(
    @Inject('userService') private userService: UserService,
  ) {
  }

  @Query(() => User, { nullable: true })
  async loggedInUser(@Ctx() ctx: IContext) {
    if (!ctx.authId) return null;

    return UserModel.findOne({ authId: ctx.authId });
  }

  @Mutation(() => User, { nullable: false })
  async registerUser(@Ctx() ctx: IContext, @Arg("input") input: RegistrationInput) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    if (await UserModel.countDocuments({ authId: ctx.authId }) > 0)
      throw new Error('User is already registered');

    return this.userService.register(ctx.authId, input);
  }

  @Mutation(() => User, { nullable: false })
  async updateLessonProgress(@Ctx() ctx: IContext, @Arg("lessonKey") lessonKey: string, @Arg("currPage", type => Int) currPage: number) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const user = await UserModel.findOne({ authId: ctx.authId });
    if (!user) throw new Error('User not found');

    return this.userService.updateLessonProgress(user._id, { lessonKey, currPage });
  }

  @Mutation(() => User, { nullable: false })
  async markLessonComplete(@Ctx() ctx: IContext, @Arg("lessonKey") lessonKey: string) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const user = await UserModel.findOne({ authId: ctx.authId });
    if (!user) throw new Error('User not found');

    return this.userService.markLessonComplete(user._id, lessonKey);
  }
}
