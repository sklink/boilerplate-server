import { Resolver, Query, Ctx,  FieldResolver, Mutation } from 'type-graphql';
import { Inject, Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { Journey, JourneyModel } from '../journey/journey.model';

// Services
import { Lesson } from './lesson.model';

@Service()
@Resolver(of => User)
export class LessonResolver {
  @Mutation(() => Lesson, { nullable: false })
  async createLesson(@Ctx() ctx: IContext) {
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
