import { User } from "../models/User.js";
import { History } from "../models/History.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsynError } from "../middleware/catchAsyncError.js";
import { sendToken } from "../utils/sendToken.js";
import { Challenge } from "../models/Challenge.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

//for check register A new user
export const checkregister = catchAsynError(async (req, res, next) => {
  const {phone_number,username,referal_code} = req.body;
  if (!phone_number || !username ) {
    return next(new ErrorHandler("please enter phone number and username  ", 400));
  }
  if(referal_code){
    const refer = await User.findOne({referal_code});
    if(!refer){
      return next(new ErrorHandler("Invalid referal code", 400));
    }
  }
  if(username){
    const un = await User.findOne({username});
    if(un){
      return next(new ErrorHandler("username allready taken", 400));
    }
  }
  let user = await User.findOne({ phone_number });
  if (user) {
    return next(new ErrorHandler("phone number Exists", 409));
  }


  res.status(201).json({
    success: true,
    stat:{
      username:username,
      phone_number:phone_number,
      referal_code:referal_code,
    },
    message: "user register check successfully",
  });
});

//for register A new user
export const register = catchAsynError(async (req, res, next) => {
  const { phone_number, username, referal_code,otp } = req.body;
  console.log(req.body)
  if (!phone_number || !username || !otp ) {
    return next(new ErrorHandler("please enter phone number and username", 400));
  }
  if (otp!='000000') {
    return next(new ErrorHandler("enter correct otp", 401));
  }
  if(referal_code!==''){
    const refer = await User.findOne({referal_code});
    if(!refer){
      return next(new ErrorHandler("Invalid referal code", 400));
    }
  }
  if(username){
    const un = await User.findOne({username});
    if(un){
      return next(new ErrorHandler("username allready taken", 400));
    }
  }
  
  let user = await User.findOne({ phone_number });
  if (user) {
    return next(new ErrorHandler("phone number allready Exists", 409));
  }

  user = await User.create({
    username,
    phone_number,
    referal_code,
  });

  await History.create({
    user:{
      user_id:user._id,
    },
    history:[{
      subject:"user id created",
      sub_subject:"injoy playing ludo on ludokingstar",
      value:"null",
      amount:"0",
    }]
  })

  sendToken(res,user, "user register successfully", 201);
});

// for login
export const login = catchAsynError(async (req, res, next) => {
  const { phone_number, otp } = req.body;

  if (!phone_number  ) {
    return next(new ErrorHandler("please enter phone number", 400));
  }

  const user = await User.findOne({ phone_number });

  if (!user) {
    return next(new ErrorHandler("User with this phone number not found", 401));
  }

  if (otp!='000000') {
    return next(new ErrorHandler("enter correct otp", 401));
  }
  sendToken(res, user, `welcome back, ${user.username}`, 200);
});

// for check login
export const checkLogin = catchAsynError(async (req, res, next) => {
  const { phone_number } = req.body;

  if (!phone_number  ) {
    return next(new ErrorHandler("please enter phone number", 400));
  }

  const user = await User.findOne({ phone_number });

  if (!user) {
    return next(new ErrorHandler("User with this phone number not found", 401));
  }

  res.status(201).json({
    success: true,
    stat:{
      phone_number:phone_number,
    },
    message: "user login check successfully",
  });
});

// for log out
export const logout = catchAsynError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      // secure:true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logout successfully",
    });
});

//for getting profile info
export const getProfileInFo = catchAsynError(async (req, res, next) => { 
  console.log(req.user._id)
  const user = await User.findById(req.user._id);
  res.status(201).json({
    success: true,
    user,
  });
});


//for profile internal changes
export const updateProfile = catchAsynError(async (req, res, next) => {
  const { update_username } = req.body;

  if (!update_username ) {
    return next(new ErrorHandler("please add username", 400));
  }

  const user = await User.findById(req.user._id);
  if (update_username) {
    user.username = update_username; 
  }
  await user.save();

  res.status(201).json({
    success: true,
    message: "profile updated successfully",
  });
});


//add  playlist to user :todo 1
export const addToPlaylist = catchAsynError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const usercourse = await Match.findById(req.body.id);

  if (!usercourse) {
    return next(new ErrorHandler("invaild course id", 404));
  }

  const itemExist = user.playlist.find((item) => {
    if (item.course.toString() === usercourse._id.toString()) return true;
  });

  if (itemExist) {
    return next(new ErrorHandler("Item  Allready Exist", 409));
  }

  user.playlist.push({
    course: usercourse._id,
    poster: usercourse.poster.url,
  });
  await user.save();

  res.status(200).json({
    success: true,
    message: "added to playlist",
  });
});

//remove  playlist to user
export const removePlaylist = catchAsynError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const usercourse = await Course.findById(req.query.id);
  if (!usercourse) {
    return next(new ErrorHandler("invaild course id", 404));
  }

  const newplaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== usercourse._id.toString()) return item;
  });
  user.playlist = newplaylist;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Removed from your account",
  });
});

//Admin routes
export const getAllUserData = catchAsynError(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({
    success: true,
    user,
  });
});
//update user role
export const updateUserRole = catchAsynError(async (req, res, next) => {
  const id=req.params.id

  if (!id) {
    return next(new ErrorHandler("not allowed ", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Email or Password Exists", 401));
  }

  if (user.role==="user") {
    user.role="Admin";
  }else{
    user.role="user";
  }
  await user.save();
  res.status(200).json({
    success: true,
    message:"role updated",
  });
});
//delete user :todo 2
export const deleteUser = catchAsynError(async (req, res, next) => {
  const id=req.params.id

  if (!id) {
    return next(new ErrorHandler("not allowed ", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("something wrong  contact us", 401));
  }
  //cancel subcription
  await cloudinary.v2.uploader.destroy(user.avatar[0].public_id);
  await user.remove();
  res.status(200).json({
    success: true,
    message:"user removed successfully",
  });
});
//delete user 
export const deleteMyProfile = catchAsynError(async (req, res, next) => {
  const id=req.user._id

  if (!id) {
    return next(new ErrorHandler("something wrong  contact us ", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("something wrong  contact us", 401));
  }
  //cancel subcription
  await cloudinary.v2.uploader.destroy(user.avatar[0].public_id);
  await user.remove();
  res.status(200).cookie("token",null,{
    expires:new Date(Date.now())
  }).json({
    success: true,
    message:"user removed successfully",
  });
});