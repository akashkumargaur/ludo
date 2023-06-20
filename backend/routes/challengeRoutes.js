import  express  from "express";
import { getAllChallenge, getSpecificChallenge, createChallenge, acceptChallenge} from "../controllers/challengeController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/Auth.js";

const router= express.Router();

//get all unaccepted challenge
router.route("/getallchallenge").get(getAllChallenge)
//get all live matchs
router.route("/getalllivematch").get(getAllChallenge)
//get perticular unaccepted challenge
router.route("/getchallenge/:amount").get(getSpecificChallenge)
//create new challenge
router.route("/createchallenge").post(isAuthenticated,createChallenge)
//accept challenge
router.route("/acceptchallenge/:id").post(isAuthenticated,acceptChallenge)

export default  router;