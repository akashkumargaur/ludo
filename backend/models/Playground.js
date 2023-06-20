import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  challenge_id: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acceptedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorstatus: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },
  acceptedUserstatus: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },
  room_id: {
    type: Number,
    required: true
  },
  winnerScreenshot: [
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
  createdAt: {
    type: Date,
    default: Date.now
  }
  });

export const Playground= new mongoose.model("Playground", Schema);