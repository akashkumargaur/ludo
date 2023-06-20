import  express  from "express";
import { requestWin} from "../controllers/challengeController.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/Auth.js";

const router= express.Router();

//get all unaccepted challenge
router.route("/requestwin").post(requestWin)
//get all live matchs
router.route("/requestloss").get(getAllChallenge)
//get perticular unaccepted challenge
router.route("/getchallenge/:amount").get(getSpecificChallenge)
//create new challenge
router.route("/createchallenge").post(isAuthenticated,createChallenge)
//accept challenge
router.route("/acceptchallenge/:id").post(isAuthenticated,acceptChallenge)

export default  router;