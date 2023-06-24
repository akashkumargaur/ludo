// import { catchAsynError } from "../middleware/catchAsyncError.js";
// import {Challenge} from '../models/Challenge.js'
// import { Playground } from "../models/Playground.js";
// import { User } from "../models/User.js";
// import getDataUri from "../utils/dataUri.js";
// import ErrorHandler from "../utils/errorHandler.js"
// import cloudinary from "cloudinary"

// // get all unaccepted challenge
// export const getAllChallenge = catchAsynError( async (req, res, next) => {
//     const challenge = await Challenge();
//     res.status(200).json({
//       success: true,
//       challenge,
//     });
// });
// // get all live challenge
// export const getAllLiveChallenge = catchAsynError( async (req, res, next) => {
//   const liveChallenge = await Challenge.find({ accepted: true });
//   res.status(200).json({
//     success: true,
//     liveChallenge,
//   });
// });
// // get perticular unaccepted challenge
// export const getSpecificChallenge = catchAsynError( async (req, res, next) => {
//   const amount=req.params.name;
//   const challenge = await Challenge.find({ game: amount });
//   res.status(200).json({
//     success: true,
//     challenge,
//   });
// });
// //create challenge
// export const createChallenge = catchAsynError( async (req, res, next) => {
//   const user = await User.findById(req.user._id);
//   const {amount} = req.body;
//   if(!user ){
//     return next(new ErrorHandler("user not exist",400))
//   }
//   if(!amount ){
//     return next(new ErrorHandler("please add all field",400))
//   }
//   if(amount ==30  ||amount == 40 ||amount ==50 ||amount == 100 ||amount == 150||amount ==  200 ){
//     return next(new ErrorHandler("please add all field",400))
//   }
//   if(amount > user.cash_balance){
//     return next(new ErrorHandler("not enough amount ",400))
//   }

//   const challenge = await Challenge.create({
//     creator:user._id,
//     game:amount,
//     description:amount,
//   });

//   res.status(200).json({
//     success: true,
//     message:"Challenge set successfully",
//   });
// });
// //accept challenge
// export const acceptChallenge = catchAsynError( async (req, res, next) => {
//   const user = await User.findById(req.user._id);
//   const id=req.params.id;
//   const finduser = await User.findById(id);
//   const userChallenge = await Challenge.findOne({creator:user._id});
//   if(userChallenge ){
//     return next(new ErrorHandler("please cancel your challenge in order to play",400))
//   }
//   if(!user ){
//     return next(new ErrorHandler("user not exist",400))
//   }
//   const finduserChallenge = await Challenge.findOne({creator:finduser._id});
//   if(user.cash_balance <finduserChallenge.amount ){
//     return next(new ErrorHandler("not enough amount ",400))
//   }
//   finduserChallenge.accepted(true);
//   finduserChallenge.acceptedBy.push(user._id);
//   user.userChallenge-=finduserChallenge.game;
//   finduser.userChallenge-=finduserChallenge.game;

//   const playground = await Playground.create({
//     challenge_id:finduserChallenge._id,
//     creator:finduser._id,
//     acceptedUser:user._id,
//     room_id:'000000',
//   });

//   await playground.save()

//   res.status(200).json({
//     success: true,
//     message:`Challenge accepted it successfully ${playground._id} `,
//   });
// });
