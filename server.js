const express = require('express')
const DatabaseConnect = require("./config/DBconnect");
const cors = require('cors')
const dotenv = require("dotenv")
const cookieParser =require("cookie-parser")
dotenv.config({path: "./.env"});
const Router = require("./routes/Route")

const app = express();
const PORT  = process.env.PORT || 5000;
app.use(cookieParser())
app.use(express.json());
app.use(cors({credentials: true,origin:process.env.ORIGIN}))

app.use("/",Router)

const start =async ()=>{
    try {
         DatabaseConnect();
    app.listen(PORT , ()=>{
     console.log(`${PORT} , yes server started`)
    
     })
    } catch (error) {
        console.log(error)
    }
  
}


start();



