import mongooseLoader from '../src/loaders/mongoose';

// Models
import { UserModel } from '../src/domains/user/user.model';
import { ClinicModel } from '../src/domains/clinic/clinic.model';
import { MemberModel } from '../src/domains/member/member.model';

import { Service, Inject } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Service()
export default class SeedAdminUsers {
  constructor(
    @Inject('userModel') private userModel: UserModel,
    @Inject('clinicModel') private clinicModel: ClinicModel,
    @Inject('memberModel') private memberModel: MemberModel,
    @Inject('logger') private logger,
  ) {
  }

  async seedAdminUsers() {

  }
}

async function seedAdminUsers() {
  this.logger.info('Initializing database...');
  const connection = await mongooseLoader();
  this.logger.info('Database initialized');

  const salt = randomBytes(32);
  this.logger.info('WARNING!!!! Creating admin users. Please ensure that you have set the env variable ADMIN_PASSWORD');
  const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
  const hashedPassword = await argon2.hash(DEFAULT_PASSWORD, { salt });

  const userRecord = await this.userModel.create({
    salt: salt.toString('hex'),
    password: hashedPassword,
  });

  if (!userRecord) {
    throw new Error('User cannot be created');
  }


const users = [
  { name: 'Matt', email: 'contact@mattdoak.ca', isAdmin: true },
];

const promises = users.map((user) => User.findOne({ email: user.email })
  .then((existingUser) => {
    if (!existingUser) {
      const u = new User(user);
      u.password = u.hashPassword(DEFAULT_PASSWORD);
      return u.save();
    }

    return existingUser;
  }));

Promise.all(promises)
  .then((users) => {
    logger.info('Users found or created.');

    return Promise.all([users, Clinic.find({})]);
  })
  .then(([adminUsers, companies]) => {
    const updates = [];

    adminUsers.forEach((user) => {
      companies.forEach((clinic) => {
        updates.push(
          Member.findAndUpdateOrCreate({
            userId: user._id,
            clinicId: clinic._id,
            roles: Object.keys(Roles),
            isAdmin: true,
          }),
        );
      });

      if (!user.settings.activeClinicId && companies.length) {
        user.settings.activeClinicId = companies[0]._id;
        user.markModified('settings');

        updates.push(user.save());
      }
    });

    return Promise.all(updates);
  })
  .then(() => logger.info('Added admins to all companies'))
  .then(() => process.exit())
  .error((error) => logger.error('Failed to find or create users', error));
