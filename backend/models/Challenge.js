import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: Number,
    enum: [30, 40,50,100,150,200],
    default: 30,
  },
  description: {
    type: String,
    required: true
  },
  accepted: {
    type: Boolean,
    default:false,
  },
  acceptedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
  });

export const Challenge= new mongoose.model("Challenge", Schema);