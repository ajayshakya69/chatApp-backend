const saveMsg = require('./saveMsg')

function saveMessage(message, userId) {
    console.log(`msg send ${message} to the id ${userId}`)
}


function joinRoom(room_id, socket) {
    console.log('join', room_id)
    socket.join(room_id)
}


function socketMain(io) {

    io.on('connection', socket => {

        console.log('this', socket.id)



        socket.on('join-room', room_id => {
            joinRoom(room_id, socket)

        }) // join the user to the socket room when they comes to the chat page



        socket.on('typing_status',(senterId, sendUserId)=>{
            console.log('who is typing now ',senterId)
            
            socket.to(sendUserId).emit('istyping',senterId)

            console.log('send event succfully to', sendUserId)
            console.log('typing now')

        })


        socket.on('sendMessage', ( message, sendUserId,senterId) => {




            saveMsg(message, sendUserId,senterId) // to save the message to the datavase 




            socket.to(sendUserId).emit('recieveMessage', message,senterId)
            console.log(`message is sent to ${sendUserId}`)

        })
    })
}

module.exports = socketMain