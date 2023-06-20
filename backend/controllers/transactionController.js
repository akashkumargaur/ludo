import { catchAsynError } from "../middleware/catchAsyncError.js";
import {Transaction} from '../models/Transaction.js'
import {History} from '../models/History.js' 
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js"
import cloudinary from "cloudinary"
import crypto from "crypto";

//get all deposite
export const getAllDeposit = catchAsynError( async (req, res, next) => {
  const deposits = await Transaction.find({}, { deposit: 1 });
    res.status(200).json({
      success: true,
      deposits,
    });
});

//get all Withraw
export const getAllWithdraw = catchAsynError( async (req, res, next) => {
  const deposits = await Transaction.find({}, { withdraw: 1 });
    res.status(200).json({
      success: true,
      deposits,
    });
});

//create deposit 
export const requestDeposit = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {amount} = req.body;
  const file=req.file;
    if (!user) {
      return next(new ErrorHandler("no user with this Id Exist", 400));
    }
    if(!amount || !file  ){
      return next(new ErrorHandler("please add all field",400))
    }
    //deposite photo manage
    
    const fileUrl=getDataUri(file)
  
    const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content)
    
    const transaction = await Transaction.create({
      user:{
        user_id:req.user._id,
      },
      deposit:[{
        amount:amount,
        screenshot:{
          public_id:mycloud.public_id,
          url:mycloud.secure_url,
        }
      }],
      
    });

    await transaction.save()
  
    res.status(200).json({
      success: true,
      transaction,
    });
  });

//create withraw
export const requestWithdraw = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {amount} = req.body;
  const file=req.file;
    if (!user) {
      return next(new ErrorHandler("no user with this Id Exist", 400));
    }
    if(!amount || !file  ){
      return next(new ErrorHandler("please add all field",400))
    }
    //deposite photo manage
    
    const fileUrl=getDataUri(file)
  
    const mycloud= await cloudinary.v2.uploader.upload(fileUrl.content)
    
    const transaction = await Transaction.create({
      user:{
        user_id:req.user._id,
      },
      withraw:[{
        amount:amount,
        screenshot:{
          public_id:mycloud.public_id,
          url:mycloud.secure_url,
        }
      }],
      
    });

    await transaction.save()
  
    res.status(200).json({
      success: true,
      transaction,
    });
  });
//clearence deposit 
export const clearenceDeposit = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {user_id,amount} = req.body;
  const finduser = await User.findById(user_id);
    if (!user || !finduser) {
      return next(new ErrorHandler("no user with this Id Exist", 400));
    }
    if(!amount ){
      return next(new ErrorHandler("please add all field",400))
    }
    const findusertransaction = await Transaction.findOne({user:{user_id:finduser._id}});
    const finduserhistory = await History.findOne({user:{user_id:finduser._id}});
    finduser.cash_balance+=amount;
    findusertransaction.deposit.pop();
    finduserhistory.history.push({subject:'Amount deposite',sub_subject:'enjoy your games',amount:amount,value:'Pluse',} )

    await finduser.save()
    await findusertransaction.save()
    await finduserhistory.save()
  
    res.status(200).json({
      success: true,
      message:"Amount deposite",
    });
  });

  //clearence Withraw
export const clearenceWithdraw = catchAsynError( async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {user_id,amount} = req.body;
  const finduser = await User.findById(user_id);
    if (!user || !finduser) {
      return next(new ErrorHandler("no user with this Id Exist", 400));
    }
    if(!amount ){
      return next(new ErrorHandler("please add all field",400))
    }
    if(amount > finduser.total_winning ){
      return next(new ErrorHandler("not enough winning",400))
    }
    const findusertransaction = await Transaction.findOne({user:{user_id:finduser._id}});
    const finduserhistory = await History.findOne({user:{user_id:finduser._id}});
    finduser.total_winning-=amount;
    findusertransaction.withdraw.pop();
    finduserhistory.history.push({subject:'Amount withdraw',sub_subject:'enjoy your winning',amount:amount,value:'Minus',} )

    await finduser.save()
    await findusertransaction.save()
    await finduserhistory.save()
  
    res.status(200).json({
      success: true,
      message:"Amount deposite",
    });
  });