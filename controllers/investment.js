const InvestModel = require('../models/investment');
const properties = require('../models/properties');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const coinbase = require('coinbase-commerce-node');
const { NotFoundError, BadRequestError } = require('../errors');
const Client = coinbase.Client;
const { Charge } = coinbase.resources;
const moment = require('moment');
const {
  addDays,
  getMilliseconds,
  milliseconds,
  intervalToDuration,
} = require('date-fns');

Client.init('ade083e4-d45d-4ca6-aa5d-75ca27c25961');

const createInvestment = async (req, res) => {
  const { property, title, amount, ethToken } = req.body;
  const user = await User.findById(req.user.userId);
  let chargeData = {
    name: `${user.firstName} ${user.lastName}`,
    description: title,
    local_price: {
      amount: amount,
      currency: 'USD',
    },
    pricing_type: 'fixed_price',
    redirect_url: 'http://localhost:3000/investment-success',
    cancel_url: 'http://localhost:3000/investment-cancel',
  };
  Charge.create(chargeData, async (err, response) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else {
      res.status(200).send({
        hosted_url: response.hosted_url,
        id: response.id,
        code: response.code,
      });
    }
  });
};

const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const { incrementAmount, incrementDate } = req.body;
  // update investment amount
  const investment = InvestModel.findByIdAndUpdate(
    id,
    { incrementAmount: incrementAmount, incrementDate: incrementDate },
    { new: true }
  );
  if (!investment) {
    throw new NotFoundError('Not found!');
  }
  res.status(StatusCodes.OK).json(investment);
};

// const updateInvestment = async (req, res) => {
//   const { id: investmentId } = req.params;
//   // get the single investment
//   const currentInvestment = await InvestModel.findOne({ _id: investmentId });
//   if (!currentInvestment)
//     throw new NotFoundError('investment with this ID not found!');

//   const { amount, createdAt } = currentInvestment;
//   console.log('current date', createdAt);
//   // 7 days after
//   // const sevenDaysAfter = new Date(new Date().setDate(new Date().getDate() + 7));
//   const sevenDaysAfter = new Date(new Date().setDate(createdAt.getDate() + 7));
//   console.log('seven days after', sevenDaysAfter);
//   const daysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
//   console.log('days in milliseconds', daysInMilliseconds);

//   // 10 percentage of amount
//   const amountPercentage = (amount / 100) * 10;
//   console.log('seven days after less createdAt', sevenDaysAfter - createdAt);
//   setInterval(async () => {
//     const updatedAmount = amount + amountPercentage;
//     if (sevenDaysAfter - createdAt === daysInMilliseconds) {
//       // update investment amount
//       return await InvestModel.findByIdAndUpdate(
//         investmentId,
//         { incrementAmount: updatedAmount, incrementedAt: Date.now },
//         { new: true }
//       ).then((res) => {
//         console.log(res);
//       });
//       // console.log(updatedInvestment);
//       // console.log('1 second');
//       // console.log(amount);
//       // console.log(amountPercentage);
//     }
//     console.log(updatedAmount);
//   }, daysInMilliseconds);
// };

// const updateAccount = (req, res) => {
//   const {} = req.body;

// }
// const successPayment = async (id) =>
//   await InvestModel.updateOne({ id }, { status: 'success' });
// const updatePayment = async (id) =>
//   await InvestModel.updateOne({ id }, { status: 'pending' });
// const deletePayment = async (id) => await InvestModel.deleteOne({ id });

const getAllInvestment = async (req, res) => {
  const investment = await InvestModel.find({});
  // const investment = await InvestModel.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json(investment);
};

const chargeStatus = async (req, res) => {
  let id = req.body.id;
  Charge.retrieve(id, (err, charge) => {
    console.log(err);
    console.log(charge);

    // if (charge['timeline'][0]['status'] == 'NEW') {
    //   try {
    //     if (
    //       charge['timeline'][1]['status'] == 'PEDNING' &&
    //       charge['timeline'].length == 2
    //     ) {
    //       return res
    //         .status(200)
    //         .json({ message: 'Payment pending, awaiting confirmations.' });
    //     } else if (charge['timeline'][1]['status'] == 'EXPIRED') {
    //       return res.status(400).json({ message: 'Payment expired' });
    //     } else if (charge['timeline'][2]['status'] == 'COMPLETED') {
    //       return res.status(200).json({ message: 'Payment completed.' });
    //     }
    //   } catch (err) {
    //     return res.status(200).json({ message: 'No payment detected' });
    //   }
    // } else {
    //   return res.status(400).json({ message: 'Charge not found.' });
    // }
  });
};

const getSingleInvestment = async (req, res) => {
  const { id } = req.params;
  const investment = await InvestModel.findById(id);
  if (!investment) {
    throw new NotFoundError('No investment found');
  }
  res.status(StatusCodes.OK).json(investment);
};

const createProperty = async (req, res) => {
  const property = await properties.create(req.body);
  res.status(StatusCodes.CREATED).json(property);
};

const getProperties = async (req, res) => {
  const property = await properties.find({});
  res.status(StatusCodes.OK).json(property);
};

const getSingleProperty = async (req, res) => {
  const { id } = req.params;
  const property = await properties.findById(id);
  if (!property) throw new NotFoundError('No property found!');
  res.status(StatusCodes.OK).json(property);
};

module.exports = {
  getSingleInvestment,
  getAllInvestment,
  createInvestment,
  createProperty,
  getProperties,
  getSingleProperty,
  chargeStatus,
  updateInvestment,
};
