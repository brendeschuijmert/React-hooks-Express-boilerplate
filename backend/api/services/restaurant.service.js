const _ = require('lodash');
const Review = require('../models/review.model');
const Restaurant = require('../models/restaurant.model');

class RestaurantService {
  async updateFeedback(restaurant) {
    const reviews = await Review.find({ restaurant: restaurant._id }).lean();
    console.log('reviews from updated service', reviews.length);
    const avgRating =
      _.sumBy(reviews || [], review => review.rate * 1) / reviews.length;

    restaurant.ratingCount = reviews.length;
    restaurant.avgRating = avgRating || 0;
    await restaurant.save();
  }

  async removeRestaurantsByUser(user) {
    const restaurants = await Restaurant.find({ user: user._id }).exec();
    if (!restaurants.length) return;
    const removePromises = restaurants.map(async item => {
      await item.remove();
    });
    await Promise.all(removePromises);
  }
}

const restaurantService = new RestaurantService();
module.exports = { restaurantService };
