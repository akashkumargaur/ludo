import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  user: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  deposit: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      screenshot: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      amount:{
        type: Number,
        required: [true, "Please enter your Amount "],
      }
    },
  ],
  withdraw: [
    {
      date: {
        type: Date,
        required: [true, "Please enter your transaction date"],
      },
      screenshot: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      amount:{
        type: Number,
        required: [true, "Please enter your Amount "],
      }
    },
  ],
  "createdAt": {
    type: Date,
    default: Date.now,
  },
  });

export const Transaction= new mongoose.model("Transaction", Schema);