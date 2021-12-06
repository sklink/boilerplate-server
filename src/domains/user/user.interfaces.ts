export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  isVerified: boolean;
  isAdmin: boolean;
  settings: object;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date
}
