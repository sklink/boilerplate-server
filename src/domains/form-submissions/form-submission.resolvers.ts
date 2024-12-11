import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

// Utils
import { IContext } from "../../loaders/graphql";

// Models
import { FormSubmission, FormSubmissionModel } from "./form-submission.model";
import { Service } from "typedi";

@Service()
@Resolver()
export class FormSubmissionResolver {
  @Query(returns => FormSubmission, { nullable: true })
  async formSubmission(@Ctx() ctx: IContext, @Arg('formRef', { nullable: false }) formRef: string): Promise<FormSubmission> {
    if (!ctx.authId) throw new Error('User is not authenticated');

    return FormSubmissionModel.findOne({ formRef, user: ctx.userId });
  }

  @Mutation(returns => FormSubmission)
  async setFormSubmission(
    @Ctx() ctx: IContext,
    @Arg('formRef', { nullable: false }) formRef: string,
    @Arg('data', { nullable: false }) data: string,
  ) {
    if (!ctx.authId) throw new Error('User is not authenticated');

    const result = await FormSubmissionModel.updateOne({ user: ctx.userId, formRef }, {
      formRef, user: ctx.userId, data
    }, { upsert: true });

    return { success: result.modifiedCount === 1 };
  }
}
