import  express  from "express";
import { getAllDeposit,requestDeposit, requestWithdraw, getAllWithdraw, clearenceDeposit, clearenceWithdraw} from "../controllers/transactionController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/Auth.js";
import singleUpload from "../middleware/multer.js";

const router= express.Router();

//request for deposite
router.route("/requestdeposit").post(isAuthenticated,singleUpload,requestDeposit)
//request for withraw
router.route("/requestwithraw").post(isAuthenticated,singleUpload,requestWithdraw)
//admin route
  //get all Deposite
router.route("/admin/alldeposite").get(isAuthenticated,authorizeAdmin,getAllDeposit)
//get all withdraw
router.route("/admin/allwithraw").get(isAuthenticated,authorizeAdmin,getAllWithdraw)
//clear deposite
router.route("/admin/cleardeposit").post(isAuthenticated,authorizeAdmin,clearenceDeposit)
//clear withraw
router.route("/admin/clearwithdraw").post(isAuthenticated,authorizeAdmin,clearenceWithdraw)
export default  router;