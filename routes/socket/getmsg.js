const express = require('express')
const { message } = require('../../auths/auth')



const getMessageRouter = express.Router()


getMessageRouter.post('/', async (req, res) => {
    try {
        const { senderId, toWhomSendId } = req.body
        const getMsg = await message.find({

            $or: [
                {
                    $and: [{ inComingId: senderId }, { outGoingId: toWhomSendId }]
                },
                {
                    $and: [{ outGoingId: senderId }, { inComingId: toWhomSendId }]
                }
            ]
        }


        )



        // console.log(getMsg)

        res.send(getMsg)

    } catch (error) {
        console.log(error.message)
    }



})




















module.exports = getMessageRouter