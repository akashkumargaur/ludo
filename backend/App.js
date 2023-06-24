import express from "express";
import {config} from "dotenv";
import ErrorMiddlerware from "./middleware/Error.js"
import cookie_Parser from "cookie-parser"
import bodyParser from "body-parser"
import path from "path"
import { fileURLToPath } from 'url';

config({
    path:"backend/config/config.env"
})
const app=express()
const __dirname = path.resolve();
//using middleware
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie_Parser())

//importing and using all routes
import challenge from "./routes/challengeRoutes.js"
import user from "./routes/userRoutes.js"
import transaction from "./routes/transactionRoutes.js"
import other from "./routes/otherRoutes.js"

app.use("/app/v1",challenge)
app.use("/app/v1",user)
app.use("/app/v1",transaction)
app.use("/app/v1",other)

app.use(express.static(path.join(__dirname, "./backend/build")));

app.get('/*', (req, res) => {
        res.sendFile('index.html', { root: path.join(__dirname, 'backend/build') });
});
// console.log(__dirname)
// app.get('/*', (req, res) => {
//         res.sendFile('server is running');
// });

export default app;

//last
app.use(ErrorMiddlerware)