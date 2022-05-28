const firebaseConfig = {
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

let username = "";
let usernames = [];
let users = [];
const fetchUsers = database.ref("users/");
fetchUsers.on("child_added", function (snapshot) {
  usernames.push(snapshot.val().username.toLowerCase());
  users = usernames.map(og => "@" + og);
});
document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

  // clear the input box
    messageInput.value = "";
    
  // create db collection and send in the data
    database.ref("messages/" + timestamp).set({
      username,
      message
    });
}

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

const fetchChat = database.ref("messages/");
let cusers = [];
let tStamp = Date.now() + 250;

setTimeout(() => {
  document.getElementById("user-form").addEventListener("submit", (ev) => {
   ev.preventDefault();
   username = document.getElementById("user-input").value;
   const lenConstraint = !(username.length > 25);
   const isNotDupe = !(usernames.includes(username.toLowerCase()));
   if(lenConstraint && isNotDupe) {
     document.getElementById("user-form").style.display = "none";
     database.ref("users/" + tStamp).set({username});
      SnackBar({
        message: "Chat Loaded Successfully!",
        status: 'success',
        position: "br",
        fixed: true,
        timeout: 1500
      });
      document.getElementById("chat").style.display = "block";
  } else {
     username = null;
     document.getElementById("user-input").value = "";
     SnackBar({
        message: "Username cannot be more than 25 characters!",
        status: 'error',
        icon: "!",
        position: "br",
        fixed: true,
        timeout: 1500
      });     
   } 
  });

  users.forEach((value) => {
      if(!cusers.includes("<span id='mcolor'>" + value + "</span>")) {
        cusers.push("<span id='mcolor'>" + value + "</span>");
      }
  });
  
  fetchChat.on("child_added", function (snapshot) {
  
  const messages = snapshot.val();
  const message = `<div id="fname">${messages.username.substring(0, 1)}</div><li class=${
    username === messages.username ? "sent" : "receive"
  }><span id="user">@${messages.username}</span><br/><span id="msg">${messages.message.replaceArray(users, cusers)}</span></li><br/>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
  document.querySelectorAll('#messages > li')[document.querySelectorAll('#messages > li').length - 1].scrollIntoView();
  let mentions = localStorage.getItem('mentions') != null ? JSON.parse(localStorage.getItem('mentions')) : [];
  if(messages.message.includes('@' + (username ? username : localStorage.uuid)) && !mentions.includes(messages.message)) {
      SnackBar({message: `${messages.username} mentioned you!`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500, actions: [{text: "View", function: function () {
        for (let lm of document.querySelectorAll('#messages > li')) {
          if(lm.children[2].textContent.includes('@' + username)) {
            lm.scrollIntoView();
          }
        }
      }}]});
      mentions.push(messages.message);
      localStorage.setItem('mentions', JSON.stringify(mentions));
  } 
});

if(document.querySelectorAll('#messages > li').length > 0) document.querySelectorAll('#messages > li')[document.querySelectorAll('#messages > li').length - 1].scrollIntoView();

fetchChat.on("child_removed", function (snapshot) {
  const deletedMessage = snapshot.val();
  const len = document.querySelectorAll('#messages > li').length;
  for(const listItem of document.querySelectorAll('#messages > li')) {
    if(listItem.textContent.includes(deletedMessage.username) && listItem.textContent.includes(deletedMessage.message)) {
      listItem.previousElementSibling.remove();
      listItem.children[1].remove();
      listItem.nextElementSibling.remove();
      listItem.remove();
    }
  }
  if(len > 0) document.querySelectorAll('#messages > li')[document.querySelectorAll('#messages > li').length - 1].scrollIntoView();
});
  window.onunload = () => database.ref("users/" + tStamp).remove();
}, 250);