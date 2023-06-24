import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['create','live','dead'],
    default: 'create',
  },
  creator: {
    name:{
      type: String,
      required: true,
    },
    creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
    status: {
    type: String,
    enum: ['win', 'lose','cancel',"pending"],
    default: 'pending',
    },
},
  count:{
    type: Number,
    default: 0, 
  },
  price: {
    type: Number,
    enum: [30, 40,50,100,150,200],
    default: 30,
  },
  room_id: {
    type: Number,
  },
  players: {
      name:{
        type: String,
      },
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ['win', 'lose','cancel','pending'],
      default: 'pending',
    },
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

export const Challenge= new mongoose.model("Challenge", Schema);