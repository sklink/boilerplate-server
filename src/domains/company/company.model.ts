import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  timezone: { type: String, required: true, default: 'America/Winnipeg' },

  // SSO
  domain: { type: String, validate: DomainValidator },
}, { timestamps: true });

schema.pre('save', function (next) {

  if (this.domain) {
    this.domain = this.domain.toLowerCase();

    return mongoose.model('Company').findOne({ domain: this.domain })
      .then((existingCompany) => {
        if (existingCompany && !existingCompany._id.equals(this._id)) throw new Error('Company validation failed: domain: Error, expected `domain` to be unique.');

        next();
      });
  }

  return next();
});

const Company = mongoose.model('Company', schema);

module.exports = {
  Company,
  schema,
};
