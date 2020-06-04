const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const ROLES = require('../constants/roles');
const options = require('../constants/passportOptions');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      default: '',
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      default: '',
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.plugin(passportLocalMongoose, options);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const json = this.toJSON();

  delete json.salt;
  delete json.password;
  delete json.email;
  delete json.__v;
  return json;
};

module.exports = mongoose.model('User', userSchema);
