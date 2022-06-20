const InvestModel = require('../models/investment');
const properties = require('../models/properties');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const coinbase = require('coinbase-commerce-node');
const ejs = require('ejs');
const config = require('../config');
const { NotFoundError, BadRequestError } = require('../errors');
const Client = coinbase.Client;
const { Charge } = coinbase.resources;
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const moment = require('moment');
const {
  addDays,
  getMilliseconds,
  milliseconds,
  intervalToDuration,
} = require('date-fns');

Client.init(process.env.COINBASE_API_KEY);

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
  };
  Charge.create(chargeData, async (err, response) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else {
      const fAmount = amount.toLocaleString();
      if (response.timeline.at(-1).status === 'COMPLETED') {
        ejs.renderFile(
          path.join(__dirname, '../views/email/investment-complete.ejs'),
          {
            config,
            title: 'Investment completed',
            amount: `$ ${fAmount}`,
            firstName: user.firstName,
            propertyTitle: title,
            id: response.id,
          },
          async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              await sendEmail({
                from: config.email.supportEmbed,
                to: user.email,
                subject: 'Investment completed',
                text: data,
              });
            }
          }
        );
        await InvestModel.create({
          ...req.body,
          incrementAmount: amount,
          charge: response,
          property,
          ethToken,
          amount,
          user: req.user.userId,
        });
      }

      res.status(200).send({
        hosted_url: response.hosted_url,
        id: response.id,
        code: response.code,
      });
    }
  });
};

const successInvestment = async (req, res) => {
  const investment = await InvestModel.create(req.body);
  res.status(StatusCodes.CREATED).json(investment);
};

const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const idArray = id.split(',');
  console.log(idArray);
  const { incrementAmount, incrementedAt } = req.body;
  // update investment amount
  let investment = [];
  for (let i = 0; i < idArray.length; i += 1) {
    investment[i] = await InvestModel.findOneAndUpdate(
      { _id: idArray[i] },
      { incrementAmount: incrementAmount, incrementedAt: incrementedAt },
      { new: true }
    );
    if (!investment[i]) {
      throw new NotFoundError('Not found!');
    }
  }

  res.status(StatusCodes.OK).json(investment);
};

const getAllInvestment = async (req, res) => {
  // const investment = await InvestModel.find({}).sort('createdAt');
  const investment = await InvestModel.find({ user: req.user.userId }).sort({
    createdAt: -1,
  });
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
  console.log(id);
  // const investment = await InvestModel.findById(id);
  // if (!investment) {
  //   throw new NotFoundError('No investment found');
  // }
  // res.status(StatusCodes.OK).json(investment);
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
  successInvestment,
};
