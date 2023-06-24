import  express  from "express";
import { getAllChallenge, createChallenge, requestWin, acceptChallenge} from "../controllers/challengeController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/Auth.js";

const router= express.Router();

//get all unaccepted challenge
router.route("/getallchallenge").post(getAllChallenge)
//create new challenge
router.route("/createchallenge").post(isAuthenticated,createChallenge)
//accept challenge
router.route("/acceptchallenge").post(isAuthenticated,acceptChallenge)
//request win
router.route("/requestwin").post(requestWin)
//request loss 
router.route("/requestloss").get(getAllChallenge)
//request cancel
router.route("/requestcancel").get(getAllChallenge)

export default  router;