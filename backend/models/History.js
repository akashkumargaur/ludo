import mongoose from "mongoose";
import validator from "validator";

const Schema = new mongoose.Schema({
    user: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        subject: {
          type: String,
          minlength: [2, "subject should be greater than two letter"],
          trim: true,
          required: [true, "Please enter your subject "],
        },
        sub_subject: {
          type: String,
          minlength: [2, "subject should be greater than two letter"],
          trim: true,
          required: [true, "Please enter your subject "],
        },
        value:{
          type: String,
          required: [true, "Please enter your value positive or negative "],
        },
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

export const History= new mongoose.model("History", Schema);    