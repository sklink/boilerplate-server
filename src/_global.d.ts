import { Document, Model } from 'mongoose';

import { IUser } from '@/domains/user/user.interfaces';
import { ICompany } from '@/domains/company/company.interfaces';
import { IMember } from '@/domains/member/member.interfaces';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type CompanyModel = Model<ICompany & Document>;
    export type MemberModel = Model<IMember & Document>;
  }
}
