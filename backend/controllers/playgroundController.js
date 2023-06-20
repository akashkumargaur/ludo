import { catchAsynError } from "../middleware/catchAsyncError.js";
import {Challenge} from '../models/Challenge.js'
import { Playground } from "../models/Playground.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js"
import cloudinary from "cloudinary"

//request win
export const requestWin = catchAsynError( async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const file=req.file;
    if(!user ){
      return next(new ErrorHandler("user not exist",400))
    }
    //win screenshot
    
    const fileUrl=getDataUri(file)
  
    const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content)
    
    const finduserChallenge = await Challenge.findOne({user:{user_id:finduser._id}});
  
    res.status(200).json({
      success: true,
      message:"Challenge set successfully",
    });
  });