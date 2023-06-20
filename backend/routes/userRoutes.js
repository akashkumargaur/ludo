import  express  from "express";
import { register,checkregister,login,logout ,getProfileInFo, updateProfile,addToPlaylist,removePlaylist
    ,getAllUserData, updateUserRole,deleteUser,deleteMyProfile, checkLogin} from "../controllers/userController.js";
import {authorizeAdmin, isAuthenticated} from "../middleware/Auth.js"
import singleUpload from "../middleware/multer.js";

const router= express.Router();

//to register a new user
router.route("/checkregister").post(checkregister)

//to register a new user
router.route("/register").post(register)

//to login a  user
router.route("/login").post(login)

//to login a  user
router.route("/checklogin").post(checkLogin)

//to logout
router.route("/logout").get(logout)

//to get profile info
router.route("/me").get(isAuthenticated,getProfileInFo).delete(isAuthenticated,deleteMyProfile)


//to update profile
router.route("/updateprofile").put(isAuthenticated,updateProfile)

//to add playlist
router.route("/addplaylist").post(isAuthenticated,addToPlaylist)

//to remove playlist
router.route("/removeplaylist").delete(isAuthenticated,removePlaylist)

//Admin route
router.route("/admin/user").get(isAuthenticated,authorizeAdmin,getAllUserData)

router.route("/admin/user/:id").put(isAuthenticated,authorizeAdmin,updateUserRole).delete(isAuthenticated,authorizeAdmin,deleteUser)

export default  router;