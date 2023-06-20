import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const Schema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [2, "name should be greater than two letter"],
    maxlength: [15, "name should be less than 15 character"],
    trim: true,
    required: [true, "Please enter your username"],
  },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "user"],
    default: "user",
  },
  phone_number: {
    type: Number,
    required: [true, "Please enter your phonenumber"],
  },
  cash_balance: {
    type: Number,
    default: 0,
  },
  game_played: {
    type: Number,
    default: 0,
  },
  total_winning: {
    type: Number,
    default: 0,
  },
  referal_earning: {
    type: Number,
    default: 0,
  },
  penalty: {
    type: Number,
    default: 0,
  },
  referal_code: {
    type: Number,
    default: 0,
  },
  upi_id: {
    type: String,
    trim: true,
  },
  history: {
      history_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    },
  deposit_pending: {
      deposit_pending: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deposit",
      },
    },
    withdraw_pending: {
      withdraw_pending: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "withdraw",
      },
    },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//cookies 15days
Schema.methods.getJWTToken = function () {
  return Jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

Schema.methods.getResetToken = function(){
  const resetToken= crypto.randomBytes(20).toString('hex');
  return resetToken
}

export const User = new mongoose.model("User", Schema);
