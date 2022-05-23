const InvestModel = require('../models/investment');
const properties = require('../models/properties');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getStaticInvestments = async (req, res) => {
  const investments = await InvestModel.find({});
  res.status(StatusCodes.OK).json(investments);
};

module.exports = getStaticInvestments;
