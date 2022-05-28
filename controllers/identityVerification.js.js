const Identity = require('../models/identityVerification.js');
const { StatusCodes } = require('http-status-codes');

const verifyIdentity = async (req, res) => {
  const identity = await Identity.create({
    ...req.body,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json(identity);
};

const getAllIdentity = async (req, res) => {
  const identity = await Identity.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json(identity);
};

const getSingleIdentity = async (req, res) => {
  const { id } = req.params;
  const identity = await Identity.findById(id);
  res.status(StatusCodes.OK).json(identity);
};

module.exports = { verifyIdentity, getAllIdentity, getSingleIdentity };
