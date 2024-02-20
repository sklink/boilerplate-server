// Models
import { Service } from 'typedi';
import { ClinicModel } from '../clinic/clinic.model';
import { MemberModel, ROLE } from '../member/member.model';

// Types
import { UserModel } from './user.model';

@Service()
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
      clinic,
      user,
      roles: [ROLE.PARENT]
    });

    return UserModel.findById(user._id);
  }
}

export default new UserService();
