const express = require("express");
const dotenv = require('dotenv')
const mongo = require('mongoose')
const cor = require('cors')
const cookie_parser = require('cookie-parser')
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketMain = require('./routes/socket/socketChat')



const app = express();

const httpServer = createServer(app)
//Routers
const loginRouter = require("./routes/loginRoute")
const getMsg = require("./routes/socket/getmsg")






//libraries


app.use(cor( // make sure that, use the cors before any endppoints and router otherwise cors not works on those router which are used befre the cors fucntion
    {
        origin: [
            "https://chat-app-ajay.vercel.app",
            "http://192.168.43.211:5173/",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ], // here you must use localhost instead of "127.0.0.1" because its not working in credintial at the frontend it will show error
        credentials: true  // when we use credentials in requests so it is important to give origin and credential in cors otherwise there are not any use of HTTP cookie
    }
));


app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for the form data we must use this function
app.use(cookie_parser())


//router
app.use(loginRouter)

app.use('/getmsg', getMsg)




//env file data
dotenv.config({ path: "./.env" })

const port = process.env.PORT || 3000

const database = process.env.DATABASE_URL;



app.set('view engine', 'ejs')




mongo.connect(database).then(() => {
    console.log("connection is successful")
}).catch(() => {
    console.log("connection failed")
})




const io = new Server(httpServer, {  // making connection
    cors: {
        origin: "https://chat-app-ajay.vercel.app", // Update this to match your client's origin
        methods: ["GET", "POST"]
    }
})





socketMain(io)





httpServer.listen(port, () => {
    console.log("port is listening", port)
})



