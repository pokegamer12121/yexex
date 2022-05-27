var firebaseConfig = {
    apiKey: "AIzaSyAa9nIvVqumqkClFO8il19Va0KoQ_wmN8M",
    authDomain: "yexs-chat.firebaseapp.com",
    databaseURL: "https://yexs-chat-default-rtdb.firebaseio.com",
    projectId: "yexs-chat",
    storageBucket: "yexs-chat.appspot.com",
    messagingSenderId: "784190773413",
    appId: "1:784190773413:web:5de305c6e34bc779a6154c"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const username = prompt("Please Tell Us Your Name");

  document.getElementById("message-form").addEventListener("submit", sendMessage);

  function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

  // clear the input box
    messageInput.value = "";

  //auto scroll to bottom
    document.querySelectorAll('#messages > li')[document.querySelectorAll('#messages > li').length - 1].scrollIntoView();

  // create db collection and send in the data
    database.ref("messages/" + timestamp).set({
      username,
      message,
    });
}

const fetchChat = database.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<div id="fname">${messages.username.substring(0, 1)}</div><li class=${
    username === messages.username ? "sent" : "receive"
  }><span id='user'>${messages.username}</span> <span id='msg'>${messages.message}</span></li><br/>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
  document.querySelectorAll('#messages > li')[document.querySelectorAll('#messages > li').length - 1].scrollIntoView();
});