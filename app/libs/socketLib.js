const token = require('./token');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events = require('events')
const eventEmitter = new events.EventEmitter();
const check = require('./checkLib');
const response = require('./responseLib'); 

let setServer = (server)=>{
    allOnlineUserList =  [];

    let io = socketio.listen(server);
    let myIo = io.of('');
    console.log('connection established')
    myIo.on('connection',(socket)=>{
     socket.emit('verifyUser','');

     socket.on('set-user',(authToken)=>{
         console.log('i am in setuser listen');
        token.verifyClaimWithoutSecret(authToken,(err,user)=>{
            console.log('verifyclaimwithoutsecret performed');
            if(err){
                socket.emit('authError',{status:500,message:'please provide authToken'})
            }else{
                let currentUser = user.data;
                let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                socket.userId=currentUser.userId
                
                console.log(`${fullName} is online`);
                let userObj = {userId:currentUser.userId,fullName:fullName}
                allOnlineUserList.push(userObj);
                console.log(allOnlineUserList);
                socket.room='mychat'
                socket.join(socket.room)
            }
        })
     })

     socket.on('disconnect',()=>{
         let removeIndex = allOnlineUserList.map(function(user){return user.userId}).indexOf(socket.userId);
         allOnlineUserList.splice(removeIndex,1);
         console.log(allOnlineUserList)
         console.log('disconnected');
         console.log(socket.userId)
     })
       socket.on('chat-msg',(data)=>{
           myIo.emit(data.receiverId,data);
       })
    
     
     
     socket.on('typing',(data)=>{
        socket.to(socket.room).broadcast.emit('typer',data);
    })
    })
   
}

module.exports ={
    setServer:setServer
}