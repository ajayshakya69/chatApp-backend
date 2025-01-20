
const { message } = require('../../auths/auth')


module.exports = async (usermessage, sendUserId,senterId) => {

    try {
        const msgDate = new Date()
        const messageObject = new message({
            inComingId: sendUserId,
            outGoingId:senterId,
            message: usermessage,
        })

        const saveMessage = await messageObject.save()


        if (saveMessage) {
            console.log('message saved')
        }

    } catch (error) {
        console.log(error)
    }

}