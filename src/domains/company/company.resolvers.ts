import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { AuthenticationError } from 'apollo-server';

import { Company } from './company.model';
import { ACL } from './company.acl';

import { Member } from '../member/member.model';
import { User } from '../user/user.model';
import { Invite } from '../invite';
import { Customer } from '../customer';
import { Roles } from '../roles';
import { ICompany } from '@/domains/company/company.interfaces';

interface ICompanyResolvers {
  Company?: { [key: string]: Function };
  Query?: { [key: string]: Function };
  Mutation?: { [key: string]: Function };
}

const resolvers: ICompanyResolvers = {
  Company: {
    customers(root: ICompany) {
      if (!root) return [];

      return Customer.find({ companyId: root._id });
    },

    members(root: ICompany) {
      if (!root) return [];

      return Member.find({ companyId: root._id });
    },

    invites(root: ICompany, args, context) {
      if (!root) return [];

      return ACL.canGetCompanyInvites(context.user, root._id)
        .then(() => Invite.find({ companyId: root._id }));
    },
  },

  Query: {
    companies(root: ICompany, args, context) {
      if (!context.user) throw new AuthenticationError('Authentication required.');

      return Member.find({ userId: context.user._id })
        .populate({
          path: 'companyId',
          populate: {
            path: 'members',
          },
        })
        .then((memberships) => memberships.map((membership) => membership.companyId));
    },

    companyByDomain(root: ICompany, args) {
      const { domain } = args;

      if (!domain) return null;

      return Company.findOne({ domain: domain.toLowerCase() }, { _id: 1, name: 1, domain: 1 });
    },
  },

  Mutation: {
    createCompany(root: ICompany, args, context) {
      const { companyData } = args;

      // First, pull the user.
      return User.findById(context.user._id)
        .then((user) => Company.create(companyData)
          .then((company) => Member.findAndUpdateOrCreate({
            userId: user._id,
            companyId: company._id,
            role: Roles.OWNER.value,
          })
            .then(() => company)));
    },

    setWizardStep(root: ICompany, args, context) {
      const { companyId, step } = args;

      return hasMemberRole(context.user, companyId)
        .then(() => Company.findById(companyId))
        .then((company) => {
          company.wizardStep = step;
          return company.save();
        });
    },

    setWizardComplete(root: ICompany, args, context) {
      const { companyId } = args;

      return hasMemberRole(context.user, companyId)
        .then(() => Company.findById(companyId))
        .then((company) => {
          company.isWizardComplete = true;
          return company.save();
        });
    },
  },
};

module.exports = {
  resolvers,
};
