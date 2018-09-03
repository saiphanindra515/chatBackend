
const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkRSa3cyUm8yTCIsImlhdCI6MTUzNTc3ODMwNjUzMCwiZXhwIjoxNTM1ODY0NzA2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6ODc5OTksImVtYWlsIjoibmF2bml0YUBnbWFpbC5jb20iLCJsYXN0TmFtZSI6InZpc2h3YW5hdGgiLCJmaXJzdE5hbWUiOiJuYXZuaXRhIiwidXNlcklkIjoiRk50MDk5ODFtIn19.t7658rDT98l_zqWbtWAusIoEbY8QztVN__7tMJWeY9M";
const socket = io('http://localhost:3000')

//const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InUxampUWkN0OSIsImlhdCI6MTUzNTY0MTE3NDc1NSwiZXhwIjoxNTM1NzI3NTc0LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6OTg5Nzg2NzksImVtYWlsIjoic2FpcGhhbmluZHJhQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoicGhhbmluZHJhIiwiZmlyc3ROYW1lIjoic2FpIiwidXNlcklkIjoiM292U0dKVHloIn19.whKyYuOBuunehZonO3NcfIQRp1AbqHgCvypmDqpXLNc"
 const userId="FNt09981m"
  let chatMessage = {
      receiverId:"3ovSGJTyh",
      receiverName:'saiphanindra',
      senderId:'FNt09981m',
      senderName:"navnita"
  }

 chatSocket =()=>{
     console.log('i am in chatSocket');
     socket.on('verifyUser',(data)=>{
       console.log('verifying user');
       socket.emit('set-user',authToken)
     });
     socket.on(userId,(data)=>{
         console.log('you received a message from '+data.senderName);
         console.log(data.message);
     });

     $("#send").click(function(){
         console.log('i am in click')
        let message= $("#msgtext").val();
        chatMessage.message=message;
        socket.emit('chat-msg',chatMessage);
    });
    $("#msgtext").keypress(function(){
        socket.emit('typing',senderName)
    });
    socket.on('typer',(data)=>{
        console.log(data+' is typing...');
    });
 }
 chatSocket();

 