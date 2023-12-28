export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  isVerified: boolean;
  isAdmin: boolean;
  settings: IUserSettings;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date
}

export interface IUserSettings {
  activeCompany?: string;
  activeProject?: string;
}
