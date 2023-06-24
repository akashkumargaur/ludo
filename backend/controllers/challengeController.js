import { catchAsynError } from "../middleware/catchAsyncError.js";
import {Challenge} from '../models/Challenge.js'
import { Playground } from "../models/Playground.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js"
import cloudinary from "cloudinary"
import axios from 'axios'

// get all unaccepted challenge
export const getAllChallenge = catchAsynError( async (req, res, next) => {
    const {price} =req.body;
    const requestChallenge =  await Challenge.find({'price': { $lt: price }});
    res.status(200).json({
      success: true,
      requestChallenge,
    });
});
//create challenge
// export const createChallenge = catchAsynError( async (req, res, next) => {
//   const {price} = req.body;
//   const user = await User.findById(req.user._id);
//   console.log(user.challenge_id)
//   if(!user ){
//     return next(new ErrorHandler("user not exist",400))
//   }
//   if(!user.challenge_pending){
//     return next(new ErrorHandler("please finish your previous match first",400))
//   }
//   const existingChallenge = await Challenge.findOne({
//     "creator.creator_id":user._id,
//     "price":price,
//   });

//   if (existingChallenge ) {
//     // Return the existing challenge
//     return next(new ErrorHandler("your previous challenge is still in search",400))
//   }
//   const existingChallengePrice = await Challenge.findOne({
//     "creator.creator_id": user._id,
//   });

//   if (existingChallengePrice) {
//     // Return the existing challenge
//     await existingChallengePrice.remove();
//   }
//   const matchingChallenge = await Challenge.findOne({
//     status: 'create',
//     price: price,
//     count: { $lt: 2 },
//   }).sort({ createdAt: 1 });

//   console.log(matchingChallenge)

//   if (matchingChallenge) {
//     // Update the matching challenge
//     matchingChallenge.status = 'live';
//     matchingChallenge.count += 1;
//     matchingChallenge.players.push({
//       name: user.userName,
//       player_id: user._id,
//     });

//     await matchingChallenge.save();

//     //room id 
//     const response = await axios.get('http://apnaludo.in.net/demo');
//     const jsonData = response.data;
//     // Check if jsonData is not empty
//     const roomCode = jsonData ? jsonData.roomcode : "00000";

//     matchingChallenge.push({
//       room_id: roomCode,
//     })

//     user.challenge_pending.push({
//       username: matchingChallenge.creator.name,
//       challenge_id: matchingChallenge._id,
//       price: price,
//     });
    
//     //change other player model
//     const player = await User.findById(matchingChallenge.creator.user_id);
//     player.challenge_pending.push({
//       username: user.username,
//       challenge_id: matchingChallenge._id,
//       price: price,
//     });

//     //balance change
//     user.cash_balance-=price;
//     player.cash_balance-=price;

//     // Return the updated challenge or any relevant response indicating success
//     res.status(200).json({
//       success: true,
//       challenge:matchingChallenge,
//     });
//   }else{
//     const challenge = new Challenge({
//       status: 'create',
//       creator:{
//         name:user.username,
//         creator_id:user._id,
//       },
//       count: 1,
//       price: price,
//     });

//     await challenge.save();

//     // Return the user's challenge indicating that they are waiting for a match
//     res.status(200).json({
//       success: true,
//       challenge,
//     });
//   }

// });
//create challenge
export const createChallenge = catchAsynError( async (req, res, next) => {
  const {price} = req.body;
  const user = await User.findById(req.user._id);
  if(!user ){
    return next(new ErrorHandler("user not exist",400))
  }
  const existingChallenge = await Challenge.findOne({
    "creator.creator_id":user._id,
    "price":price,
  });

  if (existingChallenge ) {
    // Return the existing challenge
    return next(new ErrorHandler("your previous challenge is still in search",400))
  }
  const existingChallengePrice = await Challenge.findOne({
    "creator.creator_id": user._id,
  });

  if (existingChallengePrice) {
    // Return the existing challenge
    await existingChallengePrice.remove();
  }
    const challenge = new Challenge({
      status: 'create',
      creator:{
        name:user.username,
        creator_id:user._id,
      },
      count: 1,
      price: price,
    });

    await challenge.save();
    // Return the user's challenge indicating that they are waiting for a match
    res.status(200).json({
      success: true,
      challenge,
    });
});
//accept challenge
export const acceptChallenge = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {id} = req.body;
  if(!user ){
    return next(new ErrorHandler("user not exist",400))
  }
  const existingChallenge = await Challenge.findOne({
    "creator.creator_id":user._id,
  });
  if (existingChallenge ) {
    // Return the existing challenge
    await existingChallenge.remove();
  }
  const challenge = await Challenge.findOne({
    _id:id,
  });
  //room id 
    const response = await axios.get('http://apnaludo.in.net/demo');
    const jsonData = response.data;
    // Check if jsonData is not empty
    const roomCode = jsonData ? jsonData.roomcode : "00000";
  console.log(challenge.status)
  challenge.count = 2;
  challenge.room_id=roomCode;
  // challenge.status = 'live';
  challenge.players.name = user.username;
  challenge.players.player_id = user._id;
  // challenge.players.status = "live";
  const updatedChallenge = await challenge.save();
  user.challenge_pending.price=challenge.price;
  user.challenge_pending.name=user.username;
  user.challenge_pending.challenge_id=challenge._id;
   await user.save();
    // Return the user's challenge indicating that they are waiting for a match
    res.status(200).json({
      success: true,
      updatedChallenge,
    });
});
//request win
export const requestWin = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const result=req.body;
  const file=req.file;
  if(!user ){
    return next(new ErrorHandler("user not exist",400))
  }
  if(!file ){
    return next(new ErrorHandler("screen shot is necessary",400))
  }
  if(user.challenge_pending.challenge_id===undefined){
    return next(new ErrorHandler("something  went wrong",400))
  }

  //win screenshot
  
  const fileUrl=getDataUri(file)

  const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content)
  
  const finduserChallenge = await Challenge.findOne(user.challenge_pending.challenge_id);

  //check creator or not
  if(finduserChallenge.creator.creator_id===user._id){
    if(finduserChallenge.players.status==='pending'){
      finduserChallenge.push(creator.status='win')
      finduserChallenge.push({winnerScreenshot:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }})
    }
    else if(finduserChallenge.players.status==='cancel') {
      //:todo if one win other cancel
    }
    else if(finduserChallenge.players.status==='win') {
      finduserChallenge.push(creator.status='win')
      finduserChallenge.push({winnerScreenshot:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }})
    }else{
      const player = await User.findById(finduserChallenge.players.player_id);
      if(user.referal_from===0){
        //:todo
        if(finduserChallenge.price===30){
          user.total_winning+=55;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          user.total_winning+=75;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          user.total_winning+=95;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          user.total_winning+=197;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          user.total_winning+=295.5;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          user.total_winning+=394;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
      }else{ // referal earning //todo referer referal_earning to cash balance
        const referer = await User.findOne({
          referal_code: user.referal_from,
        });
         if(finduserChallenge.price===30){
          user.total_winning+=55;
          referer.referal_earning+=0.6;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          user.total_winning+=55;
          referer.referal_earning+=0.8;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          user.total_winning+=55;
          referer.referal_earning+=1;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          user.total_winning+=55;
          referer.referal_earning+=2;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          user.total_winning+=55;
          referer.referal_earning+=3;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          user.total_winning+=55;
          referer.referal_earning+=4;
          user.challenge_pending={};
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
      }
    }
  }
  else{
    if(finduserChallenge.creator.status==='pending'){
      finduserChallenge.push(players.status='win')
      finduserChallenge.push({winnerScreenshot:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }})
    }
    else if(finduserChallenge.creator.status==='cancel') {
      //:todo if one win other cancel
    }
    else if(finduserChallenge.creator.status==='win') {
      finduserChallenge.push(players.status='win')
      finduserChallenge.push({winnerScreenshot:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }})
    }else{
      const player = await User.findById(finduserChallenge.players.player_id);
      if(user.referal_from===0){
        //:todo
        if(finduserChallenge.price===30){
          player.total_winning+=55;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          player.total_winning+=75;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          player.total_winning+=95;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          player.total_winning+=197;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          player.total_winning+=295.5;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          player.total_winning+=394;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
      }else{ // referal earning //todo referer referal_earning to cash balance
        const referer = await User.findOne({
          referal_code: player.referal_from,
        });
         if(finduserChallenge.price===30){
          player.total_winning+=55;
          referer.referal_earning+=0.6;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          player.total_winning+=55;
          referer.referal_earning+=0.8;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          player.total_winning+=55;
          referer.referal_earning+=1;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          player.total_winning+=55;
          referer.referal_earning+=2;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          player.total_winning+=55;
          referer.referal_earning+=3;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          player.total_winning+=55;
          referer.referal_earning+=4;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
      }
    }

  }
  res.status(200).json({
    success: true,
    message:"Challenge set successfully",
  });
});
//request loss
export const requestLoss = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if(!user ){
    return next(new ErrorHandler("user not exist",400))
  }
  if(user.challenge_pending.challenge_id===undefined){
    return next(new ErrorHandler("something  went wrong",400))
  }

  //check creator or not
  if(finduserChallenge.creator.creator_id===user._id){
    if(finduserChallenge.players.status==='pending'){
      finduserChallenge.push(creator.status='loss')
    }
    else if(finduserChallenge.players.status==='cancel') {
      //:todo if one loss other cancel
    }
    else if(finduserChallenge.players.status==='loss') {
      //:todo if one loss and other loss 
    }else{
      const player = await User.findById(finduserChallenge.players.player_id);
      if(user.referal_from===0){
        //:todo
        if(finduserChallenge.price===30){
          player.total_winning+=55;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          player.total_winning+=75;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          player.total_winning+=95;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          player.total_winning+=197;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          player.total_winning+=295.5;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          player.total_winning+=394;
          player.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
      }else{ // referal earning //todo referer referal_earning to cash balance
        const referer = await User.findOne({
          referal_code: player.referal_from,
        });
         if(finduserChallenge.price===30){
          player.total_winning+=55;
          referer.referal_earning+=0.6;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          player.total_winning+=55;
          referer.referal_earning+=0.8;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          player.total_winning+=55;
          referer.referal_earning+=1;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          player.total_winning+=55;
          referer.referal_earning+=2;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          player.total_winning+=55;
          referer.referal_earning+=3;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          player.total_winning+=55;
          referer.referal_earning+=4;
          player.challenge_pending={};
          await finduserChallenge.remove();
        }
      }
    }
  }
  else{
    if(finduserChallenge.creator.status==='pending'){
      finduserChallenge.push(players.status='loss')
    }
    else if(finduserChallenge.creator.status==='cancel') {
      //:todo if one win other cancel
    }
    else if(finduserChallenge.creator.status==='loss') {
       //:todo if one loss and other loss
    }else{
      const creator = await User.findById(finduserChallenge.creator.player_id);
      if(user.referal_from===0){
        //:todo
        if(finduserChallenge.price===30){
          creator.total_winning+=55;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          creator.total_winning+=75;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          creator.total_winning+=95;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          creator.total_winning+=197;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          creator.total_winning+=295.5;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          creator.total_winning+=394;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
      }else{ // referal earning //todo referer referal_earning to cash balance
        const referer = await User.findOne({
          referal_code: creator.referal_from,
        });
         if(finduserChallenge.price===30){
          creator.total_winning+=55;
          referer.referal_earning+=0.6;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===40){
          creator.total_winning+=55;
          referer.referal_earning+=0.8;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===50){
          creator.total_winning+=55;
          referer.referal_earning+=1;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===100){
          creator.total_winning+=55;
          referer.referal_earning+=2;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===150){
          creator.total_winning+=55;
          referer.referal_earning+=3;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
        else if(finduserChallenge.price===200){
          creator.total_winning+=55;
          referer.referal_earning+=4;
          creator.challenge_pending={};
          user.challenge_pending={};
          await finduserChallenge.remove();
        }
      }
    }

  }
  res.status(200).json({
    success: true,
    message:"feedback successfully",
  });
});

//request cancel
export const requestCancel = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if(!user ){
    return next(new ErrorHandler("user not exist",400))
  }
  if(user.challenge_pending.challenge_id===undefined){
    return next(new ErrorHandler("something  went wrong",400))
  }

  //check creator or not
  if(finduserChallenge.creator.creator_id===user._id){
    if(finduserChallenge.players.status==='pending'){
      finduserChallenge.push(creator.status='cancel')
    }
    else if(finduserChallenge.players.status==='win') {
      //:todo if one win other cancel
    }
    else if(finduserChallenge.players.status==='loss') {
      //:todo if one loss and other loss 
    }else{
      const player = await User.findById(finduserChallenge.players.player_id);
      user.challenge_pending={};
      player.challenge_pending={};
    }
  }
  else{
    if(finduserChallenge.creator.status==='pending'){
      finduserChallenge.push(players.status='cancel')
    }
    else if(finduserChallenge.creator.status==='win') {
      //:todo if one win other cancel
    }
    else if(finduserChallenge.creator.status==='loss') {
       //:todo if one loss and other loss
    }else{
      const creator = await User.findById(finduserChallenge.creator.player_id);
       user.challenge_pending={};
       creator.challenge_pending={};
    }

  }
  res.status(200).json({
    success: true,
    message:"feedback successfully",
  });
});