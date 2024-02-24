import { Resolver, Query, Ctx,  FieldResolver, Mutation, Arg, Int } from 'type-graphql';
import { Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { Journey, JourneyModel } from './journey.model';

@Service()
@Resolver(of => Journey)
export class JourneyResolver {
  @Mutation(() => Journey, { nullable: false })
  async createJourney(@Ctx() ctx: IContext) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    return null;
  }

  @Query(() => [Journey])
  async journies(@Arg("archived", { defaultValue: false }) archived: boolean) {
    const query = archived ? { deletedAt: { $ne: null } } : { deletedAt: null };

    return JourneyModel.find(query);
  }

  @Query(() => Int)
  async countArchivedJournies() {
    return JourneyModel.countDocuments({ deletedAt: { $ne: null } });
  }

  @Query(() => Int)
  async countActiveJournies() {
    return JourneyModel.countDocuments({ deletedAt: null });
  }
}
