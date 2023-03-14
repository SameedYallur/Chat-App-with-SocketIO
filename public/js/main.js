const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');  

//getting username and room from the url
const {username , room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true //to remove the symbols
})

//join chatroom
socket.emit('joinRoom',{username,room})

//get room and users
socket.on('roomUsers',({room ,  users}) =>{
  outputRoomName(room);
  outputUsers(users);
});

//Get room and users
socket.on('roomUsers',({room , users}) => {
  outputRoomName(room);
  outputUsers(users);
})

//Message from server 
socket.on('message',message =>
{
     console.log(message);
     outputMessage(message);

     //scroll down =property as if setting the top margin(scrolltop)
      chatMessages.scrollTop = chatMessages.scrollHeight;
});



//Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;
 
  // emitting the message to the server
  socket.emit('chatMessage',msg);

  //clearing the field
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Outputting messages using DOM
function outputMessage(message)
{
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `<p class = "meta">${message.username} <span> ${message.time}</span></p>
  <p class = "text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
} 

//Adding room name using dom
function outputRoomName(room) {
  roomName.innerText = room;
  console.log(room);
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}