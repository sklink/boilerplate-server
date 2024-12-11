import { Resolver, Query, Ctx,  FieldResolver, Mutation, Arg, Int, Args, ID } from 'type-graphql';
import { Service } from 'typedi';

// Utils
import { IContext } from '../../loaders/graphql';

// Models
import { Lesson, LessonModel } from './lesson.model';
import { CreateLessonArgs, EditLessonArgs, EditLessonPageArgs, StatusResponse } from './lesson.arguments';

@Service()
@Resolver(of => Lesson)
export class LessonResolver {
  @Mutation(() => Lesson, { nullable: false })
  async createLesson(@Ctx() ctx: IContext, @Args() { title, subtitle, description }: CreateLessonArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = new LessonModel({ title, subtitle, description });

    return lesson.save();
  }

  @Mutation(() => Lesson, { nullable: false })
  async updateLesson(@Ctx() ctx: IContext, @Args() { lessonId, data }: EditLessonArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    lesson.title = data.title;
    lesson.subtitle = data.subtitle;
    lesson.description = data.description;

    return lesson.save();
  }

  @Mutation(() => StatusResponse, { nullable: false })
  async editLessonPage(@Ctx() ctx: IContext, @Args() { lessonId, pageNum, label, blocks }: EditLessonPageArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    lesson.pages[pageNum] = { label, content: blocks };
    await lesson.save();

    return { success: true };
  }

  @Mutation(() => StatusResponse, { nullable: false })
  async insertLessonPage(@Ctx() ctx: IContext, @Args() { lessonId, pageNum, label, blocks }: EditLessonPageArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    lesson.pages.splice(pageNum, 0, { label, content: blocks });
    await lesson.save();

    return { success: true };
  }

  @Mutation(() => StatusResponse, { nullable: false })
  async removeLessonPage(@Ctx() ctx: IContext, @Args() { lessonId, pageNum }: EditLessonPageArgs) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    if (pageNum <= lesson.pages.length && pageNum >= 0) {
      lesson.pages.splice(pageNum, 1);
      await lesson.save();
    }

    return { success: true };
  }

  @Query(() => Lesson)
  async lesson(@Ctx() ctx: IContext, @Arg("lessonId", type => ID) lessonId: string) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    return lesson;
  }

  @Query(() => [Lesson])
  async lessons(@Ctx() ctx: IContext, @Arg("archived", { defaultValue: false }) archived: boolean) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const query = archived ? { deletedAt: { $ne: null } } : { deletedAt: null };

    return LessonModel.find(query);
  }

  @Query(() => Int)
  async countArchivedLessons(@Ctx() ctx: IContext) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    return LessonModel.countDocuments({ deletedAt: { $ne: null } });
  }

  @Query(() => Int)
  async countActiveLessons(@Ctx() ctx: IContext) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    return LessonModel.countDocuments({ deletedAt: null });
  }
}
