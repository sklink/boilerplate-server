import { Resolver, Query, Ctx, FieldResolver, Mutation } from 'type-graphql';
import { Inject, Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { User, UserModel } from './user.model';
import { Journey, JourneyModel } from '../journey/journey.model';

// Services
import { UserService } from './user.service';

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
  async registerUser(@Ctx() ctx: IContext) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    if (await UserModel.countDocuments({ authId: ctx.authId }) > 0)
      throw new Error('User is already registered');

    return this.userService.register(ctx.authId);
  }

  @FieldResolver(of => Journey)
  async activeJourney(@Ctx() ctx: IContext) {
    if (!ctx.activeJourneyId) return null;

    return JourneyModel.findOne({ _id: ctx.activeJourneyId });
  }
}
