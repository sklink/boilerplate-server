// Models
import { ClinicModel } from '../clinic/clinic.model';
import { MemberModel, ROLE } from '../member/member.model';

// Types
import { UserModel } from './user.model';

export class UserService {
  async register(authId: string) {
    if (await UserModel.countDocuments({ authId }) > 0)
      throw new Error('User is already registered');

    const clinic = await ClinicModel.findOne({ name: 'Bravies' });
    if (!clinic) throw new Error('Clinic could not be found');

    const user = await UserModel.create({
      authId,
      settings: { activeClinicId: clinic._id, activeJourneyId: clinic.journey },
      isAdmin: false
    });

    await MemberModel.create({
      clinicId: clinic._id,
      userId: user._id,
      roles: [ROLE.PARENT]
    });
  }
}
