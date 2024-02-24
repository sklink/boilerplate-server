import { Resolver, Query, Ctx,  FieldResolver, Mutation, Arg, Int, Args } from 'type-graphql';
import { Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { Lesson, LessonModel } from './lesson.model';
import { CreateLessonArgs } from './lesson.arguments';

@Service()
@Resolver(of => Lesson)
export class LessonResolver {
  @Mutation(() => Lesson, { nullable: false })
  async createLesson(@Ctx() ctx: IContext, @Args() { title, subtitle, description }: CreateLessonArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = new LessonModel({ title, subtitle, description });

    return lesson.save();
  }

  @Query(() => [Lesson])
  async lessons(@Arg("archived", { defaultValue: false }) archived: boolean) {
    const query = archived ? { deletedAt: { $ne: null } } : { deletedAt: null };

    return LessonModel.find(query);
  }

  @Query(() => Int)
  async countArchivedLessons() {
    return LessonModel.countDocuments({ deletedAt: { $ne: null } });
  }

  @Query(() => Int)
  async countActiveLessons() {
    return LessonModel.countDocuments({ deletedAt: null });
  }
}
