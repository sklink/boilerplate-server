import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

// Utils
import { IContext } from "../../loaders/graphql";
import { getExpiryDate } from "./invite.utils";

// Models
import { Invite, InviteModel, STATUS } from "./invite.model";
import { MemberModel, ROLE } from "../member/member.model";
import { UserModel } from "../user/user.model";

@Resolver()
export class InviteResolver {
  @Query(returns => Invite)
  async invite(@Arg('code', { nullable: false }) code: string): Promise<Invite> {
    return InviteModel.findOne({ code });
  }

  @Authorized([ROLE.CLINIC_ADMIN, ROLE.CLINIC_STAFF])
  @Query(returns => [Invite])
  async invites(
    @Ctx() ctx: IContext,
    @Arg('status', { nullable: true }) status?: string,
  ): Promise<Invite[]> {
    const query = { clinicId: ctx.clinicId };

    if (status) {
      query['status'] = status;
    }

    return InviteModel.find({ query });
  }

  @Authorized([ROLE.CLINIC_ADMIN, ROLE.CLINIC_STAFF])
  @Mutation(returns => Invite)
  async sendInvite(
    @Ctx() ctx: IContext,
    @Arg('email', { nullable: false }) email: string,
    @Arg('roles', type => [ROLE], { nullable: false }) roles: ROLE[],
  ) {
    const invite = new InviteModel({
      email,
      roles,
      clinicId: ctx.clinicId,
      sentBy: ctx.user._id,
    });

    // TODO: Use Segment to send invite

    return invite.save();
  }

  @Authorized([ROLE.CLINIC_ADMIN, ROLE.CLINIC_STAFF])
  @Mutation(returns => Invite)
  async resendInvite(
    @Ctx() ctx: IContext,
    @Arg('_id', { nullable: false }) _id: string,
  ) {
    const invite = await InviteModel.findOne({ _id, clinicId: ctx.clinicId });

    if (invite) {
      invite.sentAt = new Date();
      invite.expiresAt = getExpiryDate();

      await invite.save();

      // TODO: Use Segment to send invite
    }
  }

  @Mutation(returns => Invite)
  async acceptInvite(
    @Ctx() ctx: IContext,
    @Arg('code', { nullable: false }) code: string,
  ) {
    const invite = await InviteModel.findOne({ code, status: STATUS.PENDING });

    if (!invite) throw new Error('Invite does not exist.');
    if (invite.isExpired()) throw new Error('Invite has expired.');

    await invite.populate('clinic');

    const result = await UserModel.updateOne(
      { authId: ctx.authId },
      { settings: { activeClinicId: invite.clinic._id, activeJourneyId: invite.clinic.journey } },
      { upsert: true }
    );

    await MemberModel.create({
      clinicId: invite.clinic._id,
      userId: result.upsertedId,
      roles: invite.roles,
    });
  }

  @Authorized([ROLE.CLINIC_ADMIN, ROLE.CLINIC_STAFF])
  @Mutation(returns => Invite)
  async removeInvite(
    @Ctx() ctx: IContext,
    @Arg('_id', { nullable: false }) _id: string,
  ) {
    const result = await InviteModel.updateOne({ _id, clinicId: ctx.clinicId }, { status: STATUS.REMOVED });

    return { success: result.modifiedCount === 1, _id };
  }
}
