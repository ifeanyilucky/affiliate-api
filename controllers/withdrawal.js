const withdrawal = require('../models/withdrawal');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../utils/sendEmail');

const withdrawFunds = async (req, res) => {
  const { email } = req.user;
  const withdraw = await withdrawal.create({
    ...req.body,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json(withdraw);

  const withdrawMsg = `
  
  `;
  await sendEmail({
    from: `Lemox Team <support@lemox.co>`,
    to: email,
    subject: 'Lemox user is requesting for withdrawal!',
    text: '',
  });
};

const getAllWithdrawal = async (req, res) => {
  const withdraw = await withdrawal.find({ user: req.user.userId });
  res.status(StatusCodes.CREATED).json(withdraw);
};

const getSingleWithdrawal = async (req, res) => {
  const { id } = req.params;
  const withdraw = await withdrawal.findById(id);
  res.status(StatusCodes.OK).json(withdraw);
};

module.exports = {
  withdrawFunds,
  getAllWithdrawal,
  getSingleWithdrawal,
};
