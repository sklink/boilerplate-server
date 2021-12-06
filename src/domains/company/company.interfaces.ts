export interface ICompany {
  _id: string;
  roles: string[];
  companyId: string;
  userId: string;
  isAdmin: boolean;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
}
