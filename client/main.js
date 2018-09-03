const socket = io('http://localhost:3000')

const authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InMwS3FiQmdXWiIsImlhdCI6MTUzNTc3ODQ0NTYwMSwiZXhwIjoxNTM1ODY0ODQ1LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6OTg5Nzg2NzksImVtYWlsIjoic2FpcGhhbmluZHJhQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoicGhhbmluZHJhIiwiZmlyc3ROYW1lIjoic2FpIiwidXNlcklkIjoiM292U0dKVHloIn19.hzKdHYCv1-ZZC_cZBFW2ABTcKz1qFr0MdJLXm09S3Z0";
 const userId="3ovSGJTyh"
  let chatMessage = {
      senderId:"3ovSGJTyh",
      senderName:'saiphanindra',
      receiverId:'FNt09981m',
      receiverName:"navnita"
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
     })
     $('#send').click(function(){
            console.log('i am clicked');
            let message= $("#msgtext").val();
            chatMessage.message=message;
            socket.emit('chat-msg',chatMessage);
        
        
    });
    $("#msgtext").keypress(function(){
        socket.emit('typing','navnita')
    });
    socket.on('typer',(data)=>{
        console.log(data+' is typing...');
    });
 }
 chatSocket();

 