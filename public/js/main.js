const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

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
  e.target.element.msg.value = '';
  e.target.element.msg.focus();
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