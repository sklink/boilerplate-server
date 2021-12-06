import mongoose from 'mongoose';

import { IMember } from '@/domains/member/member.interfaces';

const schema = new mongoose.Schema({
  roles: [{ type: String }],
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  deletedAt: { type: Date },
}, { timestamps: true });

schema.statics.findAndUpdateOrCreate = function (options) {
  const { companyId, userId } = options;

  return this.findOne({ companyId, userId })
    .then((member) => {
      if (member) {
        member.set(options);
        return member.save();
      }

      return this.create(options);
    });
};

const Member = mongoose.model<IMember & mongoose.Document>('Member', schema);

module.exports = { Member, schema };
