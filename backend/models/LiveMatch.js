import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  game: {
    type: Number,
    enum: [30, 40,50,100,150,200],
    default: 30,
  },
  status: {
    type: String,
    enum: [running,cancle,finished],
    default: running,
  },
  roomid: {
    type: Number,
    required: true,
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
  player1status: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },
  player2status: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  });

export const Challenge= new mongoose.model("Challenge", Schema);