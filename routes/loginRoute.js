const express = require('express');
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');

// const upload = multer({ dest: 'upload'});

const { Now } = require("../auths/auth");
const jwtverify = require('../middleware/verifyJwt')


//

const uploadPath = path.join(__dirname, '../upload')

const userRouter = express.Router();




// to make the temporory the file storgae to save the file

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'upload/')

    },

    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        //  console.log(fileName)
        cb(null, fileName)

    }
})




const upload = multer({ storage: storage })



userRouter.post("/sign", upload.single('profile'), async (req, res) => {
    try {


        const { userName, email, passcode, country, state, city } = req.body;

        const profile = req.file.filename; // save the profile name in database after multer save it in folder


        const emailCheck = await Now.findOne({ email: email }) // tp check the user exist or not
        const userNameCheck = await Now.findOne({ userName: userName }) // tp check the user exist or not

        if (emailCheck) {
            return res.status(409).json({ message: `${email} is already register` })

        } if (userNameCheck) {
            return res.status(409).json({ message: `${userName}UserName Already taken` })
        }

        const use = new Now({
            userName, email, passcode, country, city, state, profile
        })

        const user = await use.save()


        res.json({ message: `${req.body.userName} is register successfully` })

    }
    catch (e) {
        return res.status(500).json({ message: `Internal server error please try again later` })
    }

})





userRouter.post("/login", async (req, res) => {

    try {
        console.log("request comes")

        console.log("aksjdfh", req.body)

        const { userName, passcode } = req.body
        const login_check = await Now.findOne({ userName: userName }) // check the if the user is exist or not


        if (!login_check) {
            console.log('user not fosefsund')
            return res.status(422).send({ message: 'invalid details' })

        }
        const checkPasscode = await bycrypt.compare(passcode, login_check.passcode) // checking passcode of user entered  correct or not


        if (!checkPasscode) {
            console.log('passcode is incorrect')
            return res.status(422).json({ message: 'incorrect passcode' })
        }

        const token = jwt.sign({ id: login_check._id, userName: login_check.userName, profile: login_check.profile }, process.env.SECRET_KEY)  // generating jwt token with this middleware
    


        console.log("allow access")

        res.cookie('authToken', token, { // saving the  HTTP-cookie when a user is successfuly logged in 
            secure: true, // it is important to give secure if we use sameSite otherwise it is not works
            httpOnly: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // cookie is saved for 7 days
        })
            .status(200).json({ authToken: token, message: 'all the details are correct' })

    }
    catch (e) {

        console.log(e.message)
        res.status(500).json({ message: 'Internal server error' })
    }


})



userRouter.get('/verifyJwt', jwtverify, async (req, res) => {
    try {


        if (!res.locals.tokenExist) return res.status(500).send({ message: false, data: 'Please login First' })
        // select all the user accept one who is login at that time 

        const data = await Now.find(

            { $nor: [{ userName: res.locals.user.userName }] },

            "userName _id profile" // it is projection we are selecting only their userName and _id becasue they both are unique
        )



        res.send({ message: true, userData: res.locals.user, allData: data })
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: true, data: 'internal server error' })
    }

})


userRouter.get('/getImage/:fileName', (req, res) => {
    const file = path.join(uploadPath, req.params.fileName)
    res.status(200).sendFile(file)
})


module.exports = userRouter;