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

  const elementListTyping = document.querySelector(".chat .inner-list-typing");

  body.insertBefore(div, elementListTyping);

  socket.emit("CLIENT_SEND_TYPING", false);

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
  const tooltip = document.querySelector(".chat .tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('show');
  })


  emojiPicker.addEventListener('emoji-click', event => {
    inputChat.value = inputChat.value + event.detail.unicode;
  });

  var timeOutTyping;

  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", true);

    clearTimeout(timeOutTyping);

    timeOutTyping = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", false);
    }, 3000)
  })
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping){
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type){
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
      if(!existBoxTyping){
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");

        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML=`
          <div class="inner-name"> ${data.fullName} </div>
          <div class="inner-dots"> 
            <span></span> 
            <span></span> 
            <span></span>
          </div>
        `
        elementListTyping.appendChild(boxTyping);
      } 
    } else {
      const existBoxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
      if(existBoxTyping){
        elementListTyping.removeChild(existBoxTyping);
      }
    }
  })
}
// END SERVER_RETURN_TYPING