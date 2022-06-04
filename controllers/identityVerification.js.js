const Identity = require('../models/identityVerification.js');
const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request.js');
const mongoose = require('mongoose');

const verifyIdentity = async (req, res) => {
  const identity = await Identity.create({
    ...req.body,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json(identity);
};

const updateVerification = async (req, res) => {
  const id = req.params;
  const identity = await Identity.findByIdAndUpdate(
    mongoose.Types.ObjectId(id),
    req.body,
    {
      new: true,
    }
  );
  if (!identity) {
    throw new BadRequestError('Identity not found');
  }
  res.status(StatusCodes.OK).json(identity);
};

const getAllIdentity = async (req, res) => {
  const identity = await Identity.find();
  res.status(StatusCodes.OK).json(identity);
};

const getSingleIdentity = async (req, res) => {
  const { id } = req.params;
  const identity = await Identity.findById(id);
  res.status(StatusCodes.OK).json(identity);
};

module.exports = {
  verifyIdentity,
  getAllIdentity,
  getSingleIdentity,
  updateVerification,
};
