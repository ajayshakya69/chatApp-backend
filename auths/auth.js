
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

mongoose.pluralize(null)

const userSchema = new mongoose.Schema({  //userschema for sign up form
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
    },

})


const messagesSchema = new mongoose.Schema({
    inComingId: {
        type: String,
        required: true,
    },
    outGoingId: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },
    timeStamp: {
        date: {
            type: String,
            default: ()=> new Date().toDateString()
        },
        time: {
            type: String,
            default:()=> `${new Date().getHours()}:${new Date().getMinutes()}`

        }
    }
})




userSchema.pre('save', async function (next) {
    if (this.isModified('passcode')) {
        try {
            console.log(this.passcode)
            const salt = await bycrypt.genSalt(10);
            this.passcode = await bycrypt.hash(this.passcode, salt)
            next();

        } catch (error) {
            console.log('here')
            next(error)
        }
    } else {
        next()
    }

})

userSchema.methods.generateAuthToken = async function () {
    try {

        const token = jwt.sign({ l: this._id }, process.env.SECRET_KEY)

        return token;
    } catch (error) {
        console.log(error.message);

    }
}

const Now = mongoose.model('now', userSchema)
const message = mongoose.model('chatMessages', messagesSchema)


module.exports = { message, Now }