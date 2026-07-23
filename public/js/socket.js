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