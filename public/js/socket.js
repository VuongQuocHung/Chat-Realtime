import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

var socket = io();

// CLIENT_SEND_MESAGE
const formChat = document.querySelector(".chat .chat__form");
if(formChat){
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const content = formChat.content.value;
    if(content){
      const data = {
        content: content
      }
      socket.emit("CLIENT_SEND_MESAGE", data);
      formChat.content.value = "";
    }
  })
}
// END CLIENT_SEND_MESAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat__body");

  const myId = document.querySelector(".chat").getAttribute("my-id");
  const div = document.createElement("div");

  let htmlFullName = "";

  if(myId == data.userId){
    div.classList.add("message", "message--outgoing");
  } else {
    div.classList.add("message", "message--incoming");
    htmlFullName = `<div class="message__name">${data.fullName}</div>`
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="message__content">${data.content}</div>
  `
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
})
// END SERVER_RETURN_MESSAGE

// Scroll Chat to Bottom 
const bodyChat = document.querySelector(".chat .chat__body");
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Show Icon 
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker){
  const inputChat = document.querySelector(".chat .chat__form input[name='content']");

  const buttonIcon = document.querySelector(".chat .chat__form .button-icon");
  console.log(buttonIcon);
  const tooltip = document.querySelector(".chat .tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('show');
  })


  emojiPicker.addEventListener('emoji-click', event => {
    inputChat.value = inputChat.value + event.detail.unicode;
    console.log(event.detail.unicode);
  })
}