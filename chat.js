const firebaseConfig = {
  apiKey: "AIzaSyAa9nIvVqumqkClFO8il19Va0KoQ_wmN8M",
  authDomain: "yexs-chat.firebaseapp.com",
  databaseURL: "https://yexs-chat-default-rtdb.firebaseio.com",
  projectId: "yexs-chat",
  storageBucket: "yexs-chat.appspot.com",
  messagingSenderId: "784190773413",
  appId: "1:784190773413:web:5de305c6e34bc779a6154c"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let usernames = [];
let users = [];
let cusers = [];
const fetchUsers = database.ref("users/");
fetchUsers.on("child_added", function (snapshot) {
  usernames.push(snapshot.val().username.toLowerCase());
  users.push("@" + snapshot.val().username);
  cusers.push("<span id='mcolor'>@" + snapshot.val().username + "</span>");
});

fetchUsers.on("child_removed", function (snapshot) {
  usernames.deleteItem(snapshot.val().username.toLowerCase());
  users.deleteItem("@" + snapshot.val().username);
  cusers.deleteItem("<span id='mcolor'>@" + snapshot.val().username + "</span>");
});

class User {
  constructor(name) {
    this.username = name;
  }
  meetsConstraints() {
    return (this.username.length <= 25 && !usernames.includes(this.username) && !this.username.match(/^yex$/i)) || (this.username.match(/^yex$/i) && localStorage.getItem('uuid') == atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5"));
  }
  changeUsername(newName) {
    usernames.deleteItem(this.username);
    this.username = newName;
    usernames.push(newName);
    users = usernames.map((og) => "@" + og);
    cusers = users.map((og) => "<span id='mcolor'>" + og + "</span>");
  }
  get name() {
    return this.username;
  }
  get errorMsg() {
   const errorMsgs = ["That username is too long! max is 25 chars", "That username is in use!"]; 
   if(!this.meetsConstraints()) {
    if(this.username.length > 25)
      return errorMsgs[0];
    else if(usernames.includes(this.username))
      return errorMsgs[1]; 
    else if(this.username.match(/^yex$/i) && localStorage.getItem('uuid') != atob("YzUzNDBkYzQtODZmMi00NmFlLTg0OGYtZDYyZmU1YzJkZjA5")) 
      return errorMsgs[1];
   } else return "No Error Thrown!"; 
  }
}
let username = new User("Guest");
elem("#message-form").submit(sendMessage);

function sendMessage(e) {
    e.preventDefault();

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = elem("#message-input");
    const message = messageInput.val();

  // clear the input box
    messageInput.value = "";
    
  // create db collection and send in the data
    database.ref("messages/" + timestamp).set({
      username: username.name,
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
let tStamp = Date.now();

elem("#user-form").submit(function(ev) { 
   ev.preventDefault();
   username = new User(elem("#user-input").val());
   if(username.meetsConstraints()) {
     elem("#user-form").css({display: "none"});
     database.ref("users/" + tStamp).set({username: username.name});
     SnackBar({
        message: "Username set to " + username.name,
        status: 'success',
        position: "br",
        fixed: true,
        timeout: 1500
    });
    elem("#chat").css({display: "block"});
    if(Array.isArray(elem("#messages > li"))) 
      elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
     elem("#user-input").value = '';
     SnackBar({
        message: username.errorMsg,
        status: 'error',
        icon: "!",
        position: "br",
        fixed: true,
        timeout: 2000
      });
   } 
  });
  fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const linkCatch = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) : [];
  const linkReplace = messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? messages.message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).map(og => `<a id='clink' target='_blank' href='${og.startsWith("http://") || og.startsWith("https://") ? og : "https://" + og}'>` + og + "</a>") : [];
  const message = `<div id="fname">${messages.username.substring(0, 1)}</div><li class=${
    username === messages.username ? "sent" : "receive"
  }><span id="user">@${messages.username}</span><br/><span id="msg">${messages.message.replaceArray(users, cusers).replace(/@yex/gi, "<a class='yex' href='https://github.com/" + window.location.href.substring(8, 13) + "'>@Yex</a>").replaceArray(linkCatch, linkReplace)}</span></li><br/>`;
  // append the message on the page
  elem("#messages").innerHTML += message;
  if(elem("#messages > li") instanceof Array) {
    elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
  } else {
    elem("#messages > li").scrollIntoView();
  }
  let mentions = localStorage.getItem('mentions') != null ? JSON.parse(localStorage.getItem('mentions')) : [];
  if(messages.message.includes('@' + (username ? username : localStorage.uuid)) && !mentions.includes(messages.message)) {
      SnackBar({message: `${messages.username} mentioned you!`, status: 'info', icon: 'i', fixed: true, position: 'br', timeout: 3500, actions: [{text: "View", function: function () {
        for (let lm of elem("#messages > li")) {
          if(lm.children[2].textContent == messages.message && lm.children[0].textContent == messages.username) {
            lm.scrollIntoView();
          }
        }
      }}]});
      mentions.push(messages.message);
      localStorage.setItem('mentions', JSON.stringify(mentions));
  } 
});

fetchChat.on("child_removed", function (snapshot) {
  const deletedMessage = snapshot.val();
  for(const listItem of elem("#messages > li")) {
    if(listItem.textContent.includes(deletedMessage.username) && listItem.textContent.includes(deletedMessage.message)) {
      listItem.previousElementSibling.remove();
      listItem.children[1].remove();
      listItem.nextElementSibling.remove();
      listItem.remove();
    }
  }
  if(elem("#messages > li").length > 0) elem("#messages > li")[elem("#messages > li").length - 1].scrollIntoView();
});
  window.onunload = () => database.ref("users/" + tStamp).remove();