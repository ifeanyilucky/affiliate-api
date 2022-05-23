const mongoose = require('mongoose');
const { Schema } = mongoose;

const PropertySchema = new Schema({
  title: String,
  about: String,
  rentStartDate: String,
  tokenPrice: Number,
  totalTokens: Number,
  propertyType: String,
  neighborhood: String,
  constructionYear: Number,
  totalUnits: Number,
  stories: Number,
  bedroom: String,
  rentalType: String,
  rented: String,
  images: Array,
  financials: {
    yearlyGrossRent: Number,
    monthlyGrossRent: Number,
    monthlyCosts: Number,
    monthlyNetRent: Number,
    yearlyNetRent: Number,
    totalInvestment: Number,
    expectedIncome: Number,
  },
  details: {
    lotSize: Number,
    constructionType: String,
    foundation: String,
    roofType: String,
    parking: String,
  },
  status: {
    type: String,
    enum: ['sold', 'available'],
    default: 'available'
  }
});

module.exports = mongoose.model('Property', PropertySchema);
