const mongoose = require('mongoose');
const { Schema } = mongoose;

const isPositive = rate => rate >= 0 && rate <= 5;

const ReviewSchema = new Schema(
  {
    date: {
      type: Date,
      default: new Date()
    },
    rate: {
      type: Number,
      default: 0,
      validate: [isPositive, 'Rate should be a number from 0 to 5']
    },
    comment: {
      type: String,
      trim: true,
      default: ''
    },
    reply: {
      type: String,
      trim: true,
      default: ''
    },
    restaurant: {
      type: Schema.ObjectId,
      ref: 'Restaurant'
    }
  },
  { timestamp: true, versionKey: false }
);

module.exports = mongoose.model('Review', ReviewSchema);
