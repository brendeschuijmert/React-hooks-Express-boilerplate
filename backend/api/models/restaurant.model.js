const mongoose = require('mongoose');
const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      required: true,
      default: new Date()
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
