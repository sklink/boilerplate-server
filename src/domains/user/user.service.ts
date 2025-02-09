// Models
import { Service } from 'typedi';
import { ClinicModel } from '../clinic/clinic.model';
import { MemberModel, ROLE } from '../member/member.model';

// Types
import { UserModel } from './user.model';
import { ConversationModel } from '../conversation/conversation.model';

interface IOnboardingInput {
  firstName: string;
  lastName: string;
}

interface IProgressInput {
  lessonKey: string;
  currPage: number;
}

@Service()
export class UserService {
  async register(authId: string, input: IOnboardingInput) {
    if (await UserModel.countDocuments({ authId }) > 0)
      throw new Error('User is already registered');

    const clinic = await ClinicModel.findOne({ name: 'Bravies' });
    if (!clinic) throw new Error('Clinic could not be found');

    const user = await UserModel.create({
      firstName: input.firstName,
      lastName: input.lastName,
      authId,
      progress: [
        { lessonKey: "welcome", currPage: 0 },
        { lessonKey: "explain_anxiety", currPage: 0 },
        { lessonKey: "showing_support", currPage: 0 },
        { lessonKey: "language", currPage: 0 },
        { lessonKey: "shifting_worry", currPage: 0 },
        { lessonKey: "rewarding_bravery", currPage: 0 },
        { lessonKey: "bravery_challenges", currPage: 0 },
        { lessonKey: "practice", currPage: 0 }
      ]
    });

    await MemberModel.create({
      clinic,
      user,
      roles: [ROLE.PARENT]
    });

    // Create a Conversation for the User
    const readTo = { [String(user._id)]: 0, admin: 0 };
    const conversationOptions = { user, readTo };

    // We should only ever have one
    const conversation = await ConversationModel.findOne({ userId: user._id });
    if (conversation) {
      conversation.set(conversationOptions);

      return await conversation.save();
    }

    await ConversationModel.create(conversationOptions);

    return UserModel.findById(user._id);
  }

  async updateLessonProgress(userId: string, progress: IProgressInput) {
    var user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    let nextProgress = user.progress.find(p => p.lessonKey === progress.lessonKey);

    if (!nextProgress) {
      nextProgress = {
        lessonKey: progress.lessonKey,
        currPage: progress.currPage
      };
      user.progress.push(nextProgress);
    } else {
      nextProgress.currPage = progress.currPage;
    }

    user.markModified('progress');

    return await user.save();
  }

  async markLessonComplete(userId: string, lessonKey: string) {
    var user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    let nextProgress = user.progress.find(p => p.lessonKey === lessonKey);
    if (!nextProgress) throw new Error('Progress not found');
    
    nextProgress.completedOn = nextProgress.completedOn || new Date();

    user.markModified('progress');

    return await user.save();
  }
}

export default new UserService();
